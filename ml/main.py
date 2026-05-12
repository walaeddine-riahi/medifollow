from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from models import ml_service
from fastapi.middleware.cors import CORSMiddleware
from database import db, connect_to_mongo, close_mongo_connection
from datetime import datetime
import uuid

app = FastAPI(title="MediSuiv API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    # Optionnel: On pourrait ajouter ici un seeder si la base est vide

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# --- Modèles ---

class PatientData(BaseModel):
    age: Optional[float] = 0
    imc: Optional[float] = 0
    freq_cardiaque: Optional[float] = 0
    pa_systolique: Optional[float] = 0
    pa_diastolique: Optional[float] = 0
    spo2: Optional[float] = 0
    temperature: Optional[float] = 0
    duree_hospitalisation: Optional[float] = 0
    nb_diagnostics: Optional[float] = 0
    observance_traitement: Optional[float] = 0.5
    score_questionnaire: Optional[float] = 5

class LoginRequest(BaseModel):
    email: str
    password: str

class MessageCreate(BaseModel):
    senderId: str
    senderRole: str
    receiverId: str
    content: str

# --- Endpoints Auth ---

@app.post("/auth/register")
async def register(user: dict):
    if db.db is not None:
        # Check if email already exists
        existing = await db.db.patients.find_one({"email": user["email"]})
        if not existing:
            existing = await db.db.doctors.find_one({"email": user["email"]})
        
        if existing:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
        
        # Add a unique ID for the business logic
        user["id"] = str(uuid.uuid4())
        
        if user["role"] == "patient":
            await db.db.patients.insert_one(user)
        else:
            user["userId"] = user["id"] # Many parts of code use userId for doctors
            await db.db.doctors.insert_one(user)
            
        user["_id"] = str(user["_id"])
        return {"status": "success", "user": user}
    
    raise HTTPException(status_code=500, detail="Database connection error")

@app.post("/auth/login")
async def login(req: LoginRequest):
    if db.db is not None:
        # On cherche d'abord dans les médecins
        doctor = await db.db.doctors.find_one({"email": req.email})
        if doctor:
            doctor["_id"] = str(doctor["_id"])
            return {"role": "doctor", "user": doctor, "token": "fake-jwt-token"}
        
        # Sinon dans les patients
        patient = await db.db.patients.find_one({"email": req.email})
        if patient:
            patient["_id"] = str(patient["_id"])
            return {"role": "patient", "user": patient, "token": "fake-jwt-token"}
            
    raise HTTPException(status_code=401, detail="Identifiants invalides")

# --- Endpoints Patients & Doctors ---

@app.get("/patients")
async def get_all_patients():
    if db.db is not None:
        cursor = db.db.patients.find({})
        patients = await cursor.to_list(length=100)
        for p in patients: p["_id"] = str(p["_id"])
        return patients
    return []

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    if db.db is not None:
        patient = await db.db.patients.find_one({"id": patient_id})
        if patient:
            patient["_id"] = str(patient["_id"])
            return patient
    raise HTTPException(status_code=404, detail="Patient not found")

@app.get("/doctors/{doctor_id}")
async def get_doctor(doctor_id: str):
    if db.db is not None:
        # On cherche par id ou userId
        doctor = await db.db.doctors.find_one({"$or": [{"id": doctor_id}, {"userId": doctor_id}]})
        if doctor:
            doctor["_id"] = str(doctor["_id"])
            return doctor
    raise HTTPException(status_code=404, detail="Doctor not found")

# --- Endpoints ML & Profil ---

@app.get("/ml/profile/{patient_id}")
async def get_patient_profile(patient_id: str):
    if db.db is not None:
        profile = await db.db.patient_profiles.find_one({"patientId": patient_id})
        if profile:
            profile["_id"] = str(profile["_id"])
            return profile
    raise HTTPException(status_code=404, detail="Profile not found")

@app.post("/ml/profile")
async def get_full_profile(patient_id: str, data: PatientData):
    # Mapping simple pour les modèles ML si l'ID est une string
    p_id_numeric = 0
    if patient_id.isdigit():
        p_id_numeric = int(patient_id)
    elif patient_id == "pat_demo":
        p_id_numeric = 0
        
    risk = ml_service.predict_risk(data.dict())
    cluster_id, label = ml_service.segment_patient(data.dict())
    recs = ml_service.get_recommendations(p_id_numeric, vitals=data.dict(), risk_level=risk)
    
    result = {
        "patientId": patient_id,
        "niveauRisque": risk,
        "clusterId": cluster_id,
        "clusterLabel": label,
        "topRecommendations": recs,
        "observance": data.observance_traitement,
        "updatedAt": datetime.utcnow().isoformat()
    }

    if db.db is not None:
        await db.db.patient_profiles.update_one(
            {"patientId": patient_id},
            {"$set": result},
            upsert=True
        )
        await db.db.risk_history.insert_one({
            "patientId": patient_id,
            "date": datetime.utcnow().isoformat(),
            "niveauRisque": risk,
            "vitals": data.dict()
        })

    return result

@app.get("/ml/recommend/{patient_id}")
async def recommend(patient_id: str):
    p_id = 0 if not patient_id.isdigit() else int(patient_id)
    
    # Try to get context from latest profile
    vitals = None
    risk = None
    if db.db is not None:
        profile = await db.db.patient_profiles.find_one({"patientId": patient_id})
        if profile:
            # We use the stored recommendations if they exist, 
            # or re-calculate with the stored vitals for consistency
            risk = profile.get("niveauRisque")
            # We don't store raw vitals in profile currently, but we could 
            # or just return the pre-calculated recs
            if "topRecommendations" in profile:
                return {"recommendations": profile["topRecommendations"]}

    # Fallback to calculation without context if profile not found
    recommendations = ml_service.get_recommendations(p_id, vitals=vitals, risk_level=risk)
    return {"recommendations": recommendations}

@app.get("/ml/history/{patient_id}")
async def get_history(patient_id: str):
    if db.db is not None:
        cursor = db.db.risk_history.find({"patientId": patient_id}).sort("date", -1).limit(20)
        history = await cursor.to_list(length=20)
        for h in history: h["_id"] = str(h["_id"])
        return history
    return []

@app.post("/ml/interactions")
async def save_interaction(interaction: dict):
    if db.db is not None:
        interaction["timestamp"] = datetime.utcnow().isoformat()
        await db.db.interactions.insert_one(interaction)
        return {"status": "success"}
    return {"status": "error"}

# --- Endpoints Alertes & Messages ---

@app.get("/alerts/{doctor_id}")
async def get_alerts(doctor_id: str):
    if db.db is not None:
        cursor = db.db.alerts.find({"doctorId": doctor_id})
        alerts = await cursor.to_list(length=50)
        for a in alerts: a["_id"] = str(a["_id"])
        return alerts
    return []

@app.post("/alerts/ack/{alert_id}")
async def acknowledge_alert(alert_id: str):
    if db.db is not None:
        await db.db.alerts.update_one({"id": alert_id}, {"$set": {"acknowledged": True}})
        return {"status": "success"}
    return {"status": "error"}

@app.get("/messages/{p_id}/{d_id}")
async def get_messages(p_id: str, d_id: str):
    if db.db is not None:
        query = {
            "$or": [
                {"senderId": p_id, "receiverId": d_id},
                {"senderId": d_id, "receiverId": p_id}
            ]
        }
        if d_id == "any":
            query = {
                "$or": [
                    {"senderId": p_id},
                    {"receiverId": p_id}
                ]
            }
        cursor = db.db.messages.find(query).sort("timestamp", 1)
        messages = await cursor.to_list(length=100)
        for m in messages: 
            m["_id"] = str(m["_id"])
            if "id" not in m: m["id"] = m["_id"]
        return messages
    return []

@app.post("/messages")
async def send_message(msg: MessageCreate):
    if db.db is not None:
        new_msg = msg.dict()
        new_msg["id"] = str(uuid.uuid4())
        new_msg["timestamp"] = datetime.utcnow().isoformat()
        new_msg["read"] = False
        await db.db.messages.insert_one(new_msg)
        new_msg["_id"] = str(new_msg["_id"])
        return new_msg
    return {"status": "error"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

