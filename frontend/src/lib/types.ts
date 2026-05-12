/**
 * types.ts
 * ------------------------------------------------------------
 * Rôle        : définitions TypeScript partagées (modèles métier).
 * Dépendances ML : reflète les sorties des modèles DSO1, DSO2, DSO3.
 * Collections MongoDB associées :
 *   - users, patients, doctors, patient_profiles,
 *     interactions, alerts, messages, risk_history
 * ------------------------------------------------------------
 */

export type RiskLevel = "faible" | "moyen" | "élevé";

export type Pathologie =
  | "cardiovasculaire"
  | "diabète"
  | "respiratoire"
  | "oncologique"
  | "neurologique"
  | "post-chirurgicale";

export type Difficulte = "facile" | "modérée" | "difficile";

export type Categorie =
  | "kinésithérapie"
  | "nutrition"
  | "médication"
  | "auto-surveillance"
  | "psychologique"
  | "activité physique";

export interface User {
  id: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  sexe: "M" | "F";
  typePathologie: Pathologie;
  nbComorbidites: number;
  scoreAutonomie: number; // 0..10
  doctorId: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  specialite: string;
  rpps: string;
  email: string;
}

export interface Item {
  id: string;
  nom: string;
  categorie: Categorie;
  frequenceRecommandee: string; // ex: "2x/jour"
  niveauDifficulte: Difficulte;
  pathologieCible: Pathologie;
}

export interface Interaction {
  id: string;
  patientId: string;
  itemId: string;
  rating: number; // 1..5
  completed: boolean;
  nbFoisRealise: number;
  timestamp: string;
}

export interface PatientProfile {
  patientId: string;
  niveauRisque: RiskLevel;
  clusterId: number;
  clusterLabel: string;
  observance: number; // 0..1
  topRecommendations: string[]; // item ids
  updatedAt: string;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  oldRisk: RiskLevel;
  newRisk: RiskLevel;
  acknowledged: boolean;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: "patient" | "doctor";
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface RiskPoint {
  date: string;
  niveauRisque: RiskLevel;
  numeric: number; // 1 (faible) → 3 (élevé) pour graphique
}

export interface ObservancePoint {
  date: string;
  observance: number; // 0..1
}
