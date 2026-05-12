/**
 * api.ts
 * ------------------------------------------------------------
 * Rôle : couche API factice qui simule les endpoints FastAPI :
 *   - /auth/* , /patients/me/*, /doctors/*, /ml/*
 * En production, remplacer chaque fonction par un appel axios
 * vers `NEXT_PUBLIC_API_URL`.
 * ------------------------------------------------------------
 */
import {
  buildObservanceSeries,
  clusterDescriptions,
  mockAlerts,
  mockDoctors,
  mockInteractions,
  mockItems,
  mockMessages,
  mockPatients,
  mockProfiles,
  mockRiskHistory,
} from "./mockData";
import type {
  Alert,
  Doctor,
  Item,
  Message,
  ObservancePoint,
  Patient,
  PatientProfile,
  RiskPoint,
} from "./types";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

/* --------------------------------- AUTH --------------------------------- */
export async function login(email: string, password: string) {
  await delay();
  const doc = mockDoctors.find((d) => d.email === email);
  if (doc) {
    return {
      token: "fake-jwt-doctor",
      role: "doctor" as const,
      user: doc,
    };
  }
  const patient = mockPatients.find((p) => p.email === email);
  if (patient) {
    return {
      token: "fake-jwt-patient",
      role: "patient" as const,
      user: patient,
    };
  }
  // Fallback démo
  return {
    token: "fake-jwt-patient",
    role: "patient" as const,
    user: mockPatients[0],
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* --------------------------------- PATIENT --------------------------------- */
export async function getPatient(id: string): Promise<Patient | undefined> {
  await delay();
  return mockPatients.find((p) => p.id === id);
}

export async function getPatientProfile(
  id: string,
  vitals?: {
    imc?: number;
    freq_cardiaque?: number;
    pa_systolique?: number;
    pa_diastolique?: number;
    spo2?: number;
    temperature?: number;
  }
): Promise<PatientProfile | undefined> {
  const patient = await getPatient(id);
  if (!patient) return undefined;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    // If no new vitals, try to GET existing profile first
    if (!vitals) {
      const getResponse = await fetch(`${API_URL}/ml/profile/${id}`, { signal: controller.signal });
      if (getResponse.ok) {
        clearTimeout(timeoutId);
        const data = await getResponse.json();
        return {
          ...data,
          updatedAt: data.updatedAt || new Date().toISOString()
        };
      }
    }

    // Otherwise, POST to calculate/update
    const response = await fetch(`${API_URL}/ml/profile?patient_id=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        age: patient.age,
        imc: vitals?.imc ?? 24.5,
        freq_cardiaque: vitals?.freq_cardiaque ?? 72,
        pa_systolique: vitals?.pa_systolique ?? 120,
        pa_diastolique: vitals?.pa_diastolique ?? 80,
        spo2: vitals?.spo2 ?? 98,
        temperature: vitals?.temperature ?? 36.6,
        duree_hospitalisation: 3,
        nb_diagnostics: 2,
        observance_traitement: 0.6,
        score_questionnaire: patient.scoreAutonomie
      }),
    });
    
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        updatedAt: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error("ML API Error:", error);
  }

  // Fallback to mock if API fails or times out
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
    console.error("ML History API Error:", error);
  }
  return [];
}

export async function getPatientObservance(
  id: string
): Promise<ObservancePoint[]> {
  await delay();
  return buildObservanceSeries(id);
}

export async function getRecommendedItems(id: string): Promise<Item[]> {
  try {
    const response = await fetch(`${API_URL}/ml/recommend/${id}`);
    if (response.ok) {
      const { recommendations } = await response.json();
      
      // Mapping numeric IDs from ML (0-7) to frontend mock IDs
      const idMap: Record<string, string> = {
        "0": "itm_diary",
        "1": "itm_breath",
        "2": "itm_meds",
        "3": "itm_psy",
        "4": "itm_breath",
        "5": "itm_glyc",
        "6": "itm_walk",
        "7": "itm_water"
      };

      const uniqueItemsMap = new Map<string, any>();
      
      recommendations.forEach((iid: string, index: number) => {
        const mappedId = idMap[iid] || iid;
        const found = mockItems.find((i) => i.id === mappedId);
        if (found && !uniqueItemsMap.has(found.id)) {
          uniqueItemsMap.set(found.id, {
            ...found,
            id: `${found.id}_${index}`, // Keep unique key for React
            originalId: found.id
          });
        }
      });
      
      const items = Array.from(uniqueItemsMap.values());
      if (items.length > 0) return items;
    }
  } catch (error) {
    console.error("ML Recommend API Error:", error);
  }

  // Fallback to mock if API fails or returns no matches
  return mockItems.slice(0, 5);
}

export async function getPatientInteractions(id: string) {
  await delay();
  return mockInteractions.filter((i) => i.patientId === id);
}

export async function postInteraction(payload: {
  patientId: string;
  itemId: string;
  completed: boolean;
  rating?: number;
}) {
  try {
    const response = await fetch(`${API_URL}/ml/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: payload.patientId,
        itemId: payload.itemId,
        completed: payload.completed,
        rating: payload.rating ?? (payload.completed ? 5 : 0),
      }),
    });
    if (response.ok) return { ok: true };
  } catch (error) {
    console.error("Interaction API Error:", error);
  }

  // Fallback to mock
  mockInteractions.push({
    id: `int_${Date.now()}`,
    patientId: payload.patientId,
    itemId: payload.itemId,
    rating: payload.rating ?? (payload.completed ? 4 : 2),
    completed: payload.completed,
    nbFoisRealise: payload.completed ? 1 : 0,
    timestamp: new Date().toISOString(),
  });
  return { ok: true };
}

/* --------------------------------- DOCTOR --------------------------------- */
export async function getDoctor(id: string): Promise<Doctor | undefined> {
  await delay();
  // On cherche par id (ex: doc_demo) ou userId (ex: user_doc_demo) par sécurité
  return mockDoctors.find((d) => d.id === id || d.userId === id);
}

export async function getAllPatients(): Promise<Patient[]> {
  await delay();
  return mockPatients;
}

export async function getDoctorPatients(doctorId: string) {
  await delay();
  const patients = mockPatients.filter((p) => p.doctorId === doctorId);
  return patients.map((p) => {
    const profile = mockProfiles.find((x) => x.patientId === p.id);
    const last = [...mockInteractions]
      .filter((i) => i.patientId === p.id && i.completed)
      .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))[0];
    return {
      patient: p,
      profile,
      lastActivity: last ? last.timestamp : null,
    };
  });
}

export async function getDoctorAlerts(doctorId: string): Promise<Alert[]> {
  await delay();
  return mockAlerts.filter((a) => a.doctorId === doctorId);
}

export async function ackAlert(alertId: string) {
  await delay();
  const a = mockAlerts.find((x) => x.id === alertId);
  if (a) a.acknowledged = true;
  return { ok: true };
}

/* --------------------------------- MESSAGES --------------------------------- */
export async function getThread(
  patientId: string,
  doctorId: string
): Promise<Message[]> {
  try {
    const response = await fetch(`${API_URL}/messages/${patientId}/${doctorId}`);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error("Get Thread Error:", error);
  }
  return [];
}

export async function sendMessage(payload: {
  senderId: string;
  senderRole: "patient" | "doctor";
  receiverId: string;
  content: string;
}) {
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
  
  // Fallback
  return {
    id: `msg_${Date.now()}`,
    ...payload,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

/* --------------------------------- HELPERS --------------------------------- */
export function getItemById(id: string): Item | undefined {
  return mockItems.find((i) => i.id === id);
}

export function getDoctorById(id: string): Doctor | undefined {
  return mockDoctors.find((d) => d.id === id);
}

export function getClusterDescription(id: number): string {
  return clusterDescriptions[id] || "Profil patient non encore catégorisé.";
}
