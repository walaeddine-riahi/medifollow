/**
 * mockData.ts
 * ------------------------------------------------------------
 * Rôle : jeux de données simulés pour développement front sans backend.
 * Reproduit les sorties attendues des modèles ML (DSO1/DSO2/DSO3)
 * ainsi que les collections MongoDB côté serveur.
 * À remplacer par des appels axios vers l'API FastAPI en production.
 * ------------------------------------------------------------
 */
import type {
  Alert,
  Doctor,
  Interaction,
  Item,
  Message,
  ObservancePoint,
  Patient,
  PatientProfile,
  RiskPoint,
} from "./types";

/* ----------------------------- Doctors ----------------------------- */
export const mockDoctors: Doctor[] = [
  {
    id: "doc_001",
    userId: "user_doc_001",
    firstName: "Amélie",
    lastName: "Dubois",
    specialite: "Cardiologie",
    rpps: "10100123456",
    email: "amelie.dubois@medisuiv.fr",
  },
  {
    id: "doc_002",
    userId: "user_doc_002",
    firstName: "Karim",
    lastName: "Mansouri",
    specialite: "Médecine interne",
    rpps: "10100987654",
    email: "karim.mansouri@medisuiv.fr",
  },
  {
    id: "doc_demo",
    userId: "user_doc_demo",
    firstName: "Demo",
    lastName: "Doctor",
    specialite: "Médecine générale",
    rpps: "10100000000",
    email: "demo@doctor.com",
  },
];

/* ----------------------------- Cluster labels ----------------------------- */
export const clusterLabels: Record<number, string> = {
  0: "Patients autonomes à faible risque",
  1: "Patients chroniques observants",
  2: "Patients à risque élevé multi-comorbidités",
  3: "Patients jeunes en rémission",
};

export const clusterDescriptions: Record<number, string> = {
  0: "Bonne autonomie, faible nombre de comorbidités, observance élevée. Suivi standard.",
  1: "Pathologies chroniques bien suivies, observance forte mais vigilance constante requise.",
  2: "Profil le plus exposé : âge avancé, multi-comorbidités, observance fragile. Surveillance rapprochée.",
  3: "Patients jeunes, en phase de rémission. Soutien à l'autonomie et prévention des rechutes.",
};

/* ----------------------------- Patients ----------------------------- */
export const mockPatients: Patient[] = [
  {
    id: "pat_demo",
    userId: "user_pat_demo",
    firstName: "Demo",
    lastName: "Patient",
    email: "demo@patient.com",
    age: 67,
    sexe: "F",
    typePathologie: "cardiovasculaire",
    nbComorbidites: 3,
    scoreAutonomie: 6.2,
    doctorId: "doc_demo",
    createdAt: "2026-03-12T09:00:00Z",
  },
  {
    id: "pat_001",
    userId: "user_pat_001",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@example.com",
    age: 67,
    sexe: "F",
    typePathologie: "cardiovasculaire",
    nbComorbidites: 3,
    scoreAutonomie: 6.2,
    doctorId: "doc_001",
    createdAt: "2026-03-12T09:00:00Z",
  },
  {
    id: "pat_002",
    userId: "user_pat_002",
    firstName: "Jean",
    lastName: "Lefebvre",
    email: "jean.lefebvre@example.com",
    age: 74,
    sexe: "M",
    typePathologie: "respiratoire",
    nbComorbidites: 4,
    scoreAutonomie: 4.1,
    doctorId: "doc_001",
    createdAt: "2026-02-04T09:00:00Z",
  },
  {
    id: "pat_003",
    userId: "user_pat_003",
    firstName: "Inès",
    lastName: "Bouchard",
    email: "ines.bouchard@example.com",
    age: 42,
    sexe: "F",
    typePathologie: "oncologique",
    nbComorbidites: 1,
    scoreAutonomie: 8.4,
    doctorId: "doc_001",
    createdAt: "2026-04-21T09:00:00Z",
  },
  {
    id: "pat_004",
    userId: "user_pat_004",
    firstName: "Marc",
    lastName: "Rousseau",
    email: "marc.rousseau@example.com",
    age: 58,
    sexe: "M",
    typePathologie: "diabète",
    nbComorbidites: 2,
    scoreAutonomie: 7.0,
    doctorId: "doc_001",
    createdAt: "2026-01-30T09:00:00Z",
  },
  {
    id: "pat_005",
    userId: "user_pat_005",
    firstName: "Léa",
    lastName: "Garnier",
    email: "lea.garnier@example.com",
    age: 35,
    sexe: "F",
    typePathologie: "post-chirurgicale",
    nbComorbidites: 0,
    scoreAutonomie: 9.1,
    doctorId: "doc_002",
    createdAt: "2026-04-02T09:00:00Z",
  },
];

/* ----------------------------- Items ----------------------------- */
export const mockItems: Item[] = [
  {
    id: "itm_walk",
    nom: "Marche modérée 20 min",
    categorie: "activité physique",
    frequenceRecommandee: "1x/jour",
    niveauDifficulte: "facile",
    pathologieCible: "cardiovasculaire",
  },
  {
    id: "itm_bp",
    nom: "Mesure de la tension artérielle",
    categorie: "auto-surveillance",
    frequenceRecommandee: "2x/jour",
    niveauDifficulte: "facile",
    pathologieCible: "cardiovasculaire",
  },
  {
    id: "itm_meds",
    nom: "Prise du traitement antihypertenseur",
    categorie: "médication",
    frequenceRecommandee: "1x/jour",
    niveauDifficulte: "facile",
    pathologieCible: "cardiovasculaire",
  },
  {
    id: "itm_breath",
    nom: "Exercices respiratoires guidés",
    categorie: "kinésithérapie",
    frequenceRecommandee: "3x/jour",
    niveauDifficulte: "modérée",
    pathologieCible: "respiratoire",
  },
  {
    id: "itm_diet",
    nom: "Plan alimentaire pauvre en sel",
    categorie: "nutrition",
    frequenceRecommandee: "quotidien",
    niveauDifficulte: "modérée",
    pathologieCible: "cardiovasculaire",
  },
  {
    id: "itm_glyc",
    nom: "Glycémie capillaire",
    categorie: "auto-surveillance",
    frequenceRecommandee: "2x/jour",
    niveauDifficulte: "facile",
    pathologieCible: "diabète",
  },
  {
    id: "itm_psy",
    nom: "Séance de relaxation",
    categorie: "psychologique",
    frequenceRecommandee: "1x/jour",
    niveauDifficulte: "facile",
    pathologieCible: "oncologique",
  },
  {
    id: "itm_kine",
    nom: "Kinésithérapie post-opératoire",
    categorie: "kinésithérapie",
    frequenceRecommandee: "3x/semaine",
    niveauDifficulte: "difficile",
    pathologieCible: "post-chirurgicale",
  },
  {
    id: "itm_water",
    nom: "Hydratation 1,5 L",
    categorie: "nutrition",
    frequenceRecommandee: "quotidien",
    niveauDifficulte: "facile",
    pathologieCible: "cardiovasculaire",
  },
  {
    id: "itm_diary",
    nom: "Journal des symptômes",
    categorie: "auto-surveillance",
    frequenceRecommandee: "1x/jour",
    niveauDifficulte: "facile",
    pathologieCible: "oncologique",
  },
];

/* ----------------------------- Profils ML ----------------------------- */
export const mockProfiles: PatientProfile[] = [
  {
    patientId: "pat_demo",
    niveauRisque: "élevé",
    clusterId: 2,
    clusterLabel: clusterLabels[2],
    observance: 0.58,
    topRecommendations: [
      "itm_bp",
      "itm_meds",
      "itm_walk",
      "itm_diet",
      "itm_water",
    ],
    updatedAt: "2026-05-11T07:00:00Z",
  },
  {
    patientId: "pat_001",
    niveauRisque: "élevé",
    clusterId: 2,
    clusterLabel: clusterLabels[2],
    observance: 0.58,
    topRecommendations: [
      "itm_bp",
      "itm_meds",
      "itm_walk",
      "itm_diet",
      "itm_water",
    ],
    updatedAt: "2026-05-11T07:00:00Z",
  },
  {
    patientId: "pat_002",
    niveauRisque: "élevé",
    clusterId: 2,
    clusterLabel: clusterLabels[2],
    observance: 0.49,
    topRecommendations: [
      "itm_breath",
      "itm_meds",
      "itm_diary",
      "itm_walk",
      "itm_water",
    ],
    updatedAt: "2026-05-11T07:00:00Z",
  },
  {
    patientId: "pat_003",
    niveauRisque: "moyen",
    clusterId: 1,
    clusterLabel: clusterLabels[1],
    observance: 0.76,
    topRecommendations: [
      "itm_psy",
      "itm_diary",
      "itm_walk",
      "itm_water",
      "itm_diet",
    ],
    updatedAt: "2026-05-11T07:00:00Z",
  },
  {
    patientId: "pat_004",
    niveauRisque: "moyen",
    clusterId: 1,
    clusterLabel: clusterLabels[1],
    observance: 0.81,
    topRecommendations: [
      "itm_glyc",
      "itm_meds",
      "itm_walk",
      "itm_diet",
      "itm_water",
    ],
    updatedAt: "2026-05-11T07:00:00Z",
  },
  {
    patientId: "pat_005",
    niveauRisque: "faible",
    clusterId: 3,
    clusterLabel: clusterLabels[3],
    observance: 0.92,
    topRecommendations: [
      "itm_kine",
      "itm_walk",
      "itm_water",
      "itm_diary",
      "itm_psy",
    ],
    updatedAt: "2026-05-11T07:00:00Z",
  },
];

/* ----------------------------- Interactions ----------------------------- */
function genInteractions(): Interaction[] {
  const list: Interaction[] = [];
  const now = new Date("2026-05-11T18:00:00Z").getTime();
  const day = 24 * 3600 * 1000;
  for (const p of mockPatients) {
    const recs = mockProfiles.find(
      (x) => x.patientId === p.id
    )!.topRecommendations;
    for (let d = 0; d < 30; d++) {
      for (const r of recs) {
        const completedProb =
          p.id === "pat_005" ? 0.95 : p.id === "pat_002" ? 0.45 : 0.7;
        const completed = Math.random() < completedProb;
        if (Math.random() > 0.5 || completed) {
          list.push({
            id: `int_${p.id}_${d}_${r}`,
            patientId: p.id,
            itemId: r,
            rating: completed ? 3 + Math.round(Math.random() * 2) : 2,
            completed,
            nbFoisRealise: completed ? Math.ceil(Math.random() * 2) : 0,
            timestamp: new Date(
              now - d * day - Math.random() * day
            ).toISOString(),
          });
        }
      }
    }
  }
  return list;
}
export const mockInteractions: Interaction[] = genInteractions();

/* ----------------------------- Risk history ----------------------------- */
function genRiskHistory(
  patientId: string,
  current: PatientProfile
): RiskPoint[] {
  const map: Record<string, number> = { faible: 1, moyen: 2, élevé: 3 };
  const labels: ("faible" | "moyen" | "élevé")[] = ["faible", "moyen", "élevé"];
  const out: RiskPoint[] = [];
  const now = new Date("2026-05-11T07:00:00Z").getTime();
  const day = 24 * 3600 * 1000;
  let level = map[current.niveauRisque];
  for (let d = 29; d >= 0; d--) {
    if (Math.random() < 0.12) {
      level = Math.max(1, Math.min(3, level + (Math.random() < 0.5 ? -1 : 1)));
    }
    out.push({
      date: new Date(now - d * day).toISOString(),
      niveauRisque: labels[level - 1],
      numeric: level,
    });
  }
  out[out.length - 1].niveauRisque = current.niveauRisque;
  out[out.length - 1].numeric = map[current.niveauRisque];
  return out;
}
export const mockRiskHistory: Record<string, RiskPoint[]> = Object.fromEntries(
  mockProfiles.map((p) => [p.patientId, genRiskHistory(p.patientId, p)])
);

/* ----------------------------- Observance series ----------------------------- */
export function buildObservanceSeries(patientId: string): ObservancePoint[] {
  const day = 24 * 3600 * 1000;
  const now = new Date("2026-05-11T18:00:00Z").getTime();
  const out: ObservancePoint[] = [];
  for (let d = 29; d >= 0; d--) {
    const dayStart = now - d * day - 12 * 3600 * 1000;
    const dayEnd = dayStart + day;
    const dayInter = mockInteractions.filter(
      (i) =>
        i.patientId === patientId &&
        new Date(i.timestamp).getTime() >= dayStart &&
        new Date(i.timestamp).getTime() < dayEnd
    );
    if (dayInter.length === 0) {
      out.push({
        date: new Date(now - d * day).toISOString(),
        observance: out.length > 0 ? out[out.length - 1].observance : 0.7,
      });
    } else {
      const avg =
        dayInter.reduce((s, x) => s + x.rating, 0) / dayInter.length / 5;
      out.push({
        date: new Date(now - d * day).toISOString(),
        observance: avg,
      });
    }
  }
  return out;
}

/* ----------------------------- Alerts ----------------------------- */
export const mockAlerts: Alert[] = [
  {
    id: "al_001",
    patientId: "pat_001",
    patientName: "Sophie Martin",
    doctorId: "doc_001",
    oldRisk: "moyen",
    newRisk: "élevé",
    acknowledged: false,
    timestamp: "2026-05-11T06:12:00Z",
  },
  {
    id: "al_002",
    patientId: "pat_002",
    patientName: "Jean Lefebvre",
    doctorId: "doc_001",
    oldRisk: "moyen",
    newRisk: "élevé",
    acknowledged: false,
    timestamp: "2026-05-10T22:45:00Z",
  },
  {
    id: "al_003",
    patientId: "pat_003",
    patientName: "Inès Bouchard",
    doctorId: "doc_001",
    oldRisk: "faible",
    newRisk: "moyen",
    acknowledged: true,
    timestamp: "2026-05-09T15:08:00Z",
  },
];

/* ----------------------------- Messages ----------------------------- */
export const mockMessages: Message[] = [
  {
    id: "msg_001",
    senderId: "pat_001",
    senderRole: "patient",
    receiverId: "doc_001",
    content:
      "Bonjour Dr Dubois, je ressens des palpitations depuis hier soir. Dois-je m'inquiéter ?",
    timestamp: "2026-05-11T08:14:00Z",
    read: false,
  },
  {
    id: "msg_002",
    senderId: "doc_001",
    senderRole: "doctor",
    receiverId: "pat_001",
    content:
      "Bonjour Sophie, prenez votre tension matin et soir aujourd'hui et notez-la dans votre journal. Si > 16/10, contactez-moi immédiatement.",
    timestamp: "2026-05-11T09:02:00Z",
    read: true,
  },
  {
    id: "msg_003",
    senderId: "pat_001",
    senderRole: "patient",
    receiverId: "doc_001",
    content: "Très bien, merci pour votre réponse rapide.",
    timestamp: "2026-05-11T09:30:00Z",
    read: true,
  },
];
