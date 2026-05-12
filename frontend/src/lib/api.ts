/**
 * api.ts
 * ------------------------------------------------------------
 * Rôle : couche API qui appelle le backend FastAPI sur Render.
 * ------------------------------------------------------------
 */
import {
  buildObservanceSeries,
  mockAlerts,
  mockDoctors,
  mockInteractions,
  mockItems,
  mockMessages,
  mockPatients,
  mockProfiles,
} from "./mockData";
import type {
  Alert,
  Doctor,
  Item,
  Interaction,
  Message,
  ObservancePoint,
  Patient,
  PatientProfile,
  RiskPoint,
} from "./types";

let base_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = base_url.endsWith("/") ? base_url.slice(0, -1) : base_url;

/* --------------------------------- AUTH --------------------------------- */
export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) return await response.json();
    
    const err = await response.json();
    throw new Error(err.detail || "Erreur de connexion");
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

export async function register(payload: any) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) return await response.json();
    
    const err = await response.json();
    throw new Error(err.detail || "Erreur d'inscription");
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
}

/* --------------------------------- PATIENT --------------------------------- */
export async function getPatient(id: string): Promise<Patient | undefined> {
  try {
    const response = await fetch(`${API_URL}/patients/${id}`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Get Patient Error:", error);
  }
  // Fallback
  return mockPatients.find((p) => p.id === id);
}

export async function getPatients(): Promise<Patient[]> {
  try {
    const response = await fetch(`${API_URL}/patients`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Get Patients Error:", error);
  }
  return mockPatients;
}

export async function getPatientProfile(
  id: string,
  vitals?: any
): Promise<PatientProfile | undefined> {
  try {
    if (vitals) {
      const response = await fetch(`${API_URL}/ml/profile?patient_id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vitals),
      });
      if (response.ok) return await response.json();
    } else {
      const response = await fetch(`${API_URL}/ml/profile/${id}`);
      if (response.ok) return await response.json();
    }
  } catch (error) {
    console.error("Get Profile Error:", error);
  }
  return mockProfiles.find((p) => p.patientId === id);
}

export async function getPatientRiskHistory(id: string): Promise<RiskPoint[]> {
  try {
    const response = await fetch(`${API_URL}/ml/history/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data.map((h: any) => ({
        date: h.date,
        niveauRisque: h.niveauRisque,
        numeric: h.niveauRisque === "élevé" ? 3 : h.niveauRisque === "moyen" ? 2 : 1
      }));
    }
  } catch (error) {
    console.error("ML History Error:", error);
  }
  return [];
}

export async function getPatientObservance(id: string): Promise<ObservancePoint[]> {
  return buildObservanceSeries(id);
}

export async function getRecommendedItems(id: string): Promise<Item[]> {
  try {
    const response = await fetch(`${API_URL}/ml/recommend/${id}`);
    if (response.ok) {
      const { recommendations } = await response.json();
      const idMap: Record<string, string> = {
        "0": "itm_diary", "1": "itm_breath", "2": "itm_meds", "3": "itm_psy",
        "4": "itm_breath", "5": "itm_glyc", "6": "itm_walk", "7": "itm_water"
      };
      const uniqueItems = new Set();
      const result: Item[] = [];
      recommendations.forEach((iid: string, index: number) => {
        const mappedId = idMap[iid] || iid;
        const found = mockItems.find((i) => i.id === mappedId);
        if (found && !uniqueItems.has(found.id)) {
          uniqueItems.add(found.id);
          result.push({ ...found, id: `${found.id}_${index}`, originalId: found.id });
        }
      });
      if (result.length > 0) return result;
    }
  } catch (error) {
    console.error("ML Recommend Error:", error);
  }
  return mockItems.slice(0, 5);
}

export async function getPatientInteractions(id: string) {
  // En production, on pourrait aussi fetch les interactions depuis MongoDB
  return mockInteractions.filter((i) => i.patientId === id);
}

export async function postInteraction(payload: any) {
  try {
    const response = await fetch(`${API_URL}/ml/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Post Interaction Error:", error);
  }
  return { status: "error" };
}

/* --------------------------------- DOCTOR --------------------------------- */
export async function getDoctor(id: string): Promise<Doctor | undefined> {
  try {
    const response = await fetch(`${API_URL}/doctors/${id}`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Get Doctor Error:", error);
  }
  return mockDoctors.find((d) => d.id === id || d.userId === id);
}

/* --------------------------------- ALERTS --------------------------------- */
export async function getAlerts(doctorId: string): Promise<Alert[]> {
  try {
    const response = await fetch(`${API_URL}/alerts/${doctorId}`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Get Alerts Error:", error);
  }
  return mockAlerts.filter((a) => a.doctorId === doctorId);
}

export async function acknowledgeAlert(alertId: string) {
  try {
    await fetch(`${API_URL}/alerts/ack/${alertId}`, { method: "POST" });
  } catch (error) {
    console.error("Ack Alert Error:", error);
  }
  return { ok: true };
}

/* --------------------------------- MESSAGES --------------------------------- */
export async function getThread(patientId: string, doctorId: string): Promise<Message[]> {
  try {
    const response = await fetch(`${API_URL}/messages/${patientId}/${doctorId}`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Get Thread Error:", error);
  }
  return [];
}

export async function sendMessage(payload: any) {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Send Message Error:", error);
  }
  return { ...payload, timestamp: new Date().toISOString(), id: `msg_${Date.now()}` };
}
