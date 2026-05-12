/**
 * dashboard/doctor/page.tsx
 * Dashboard du médecin avec liste de patients
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  AlertCircle,
  TrendingUp,
  Plus,
  Search,
  Eye,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useSession } from "@/lib/session";
import { getDoctor, getAllPatients, getPatientProfile } from "@/lib/api";
import type { Doctor, Patient, PatientProfile } from "@/lib/types";

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="doctor">
      <DoctorDashboardContent />
    </ProtectedRoute>
  );
}

function DoctorDashboardContent() {
  const router = useRouter();
  const { session } = useSession();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientProfiles, setPatientProfiles] = useState<
    Record<string, PatientProfile>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.userId) return;
      try {
        const [doc, allPatients] = await Promise.all([
          getDoctor(session.userId),
          getAllPatients(),
        ]);

        setDoctor(doc || null);

        // Filtrer les patients du médecin
        const docPatients = allPatients.filter((p) => p.doctorId === doc?.id);
        setPatients(docPatients);

        // Charger les profils
        const profiles: Record<string, PatientProfile> = {};
        for (const patient of docPatients) {
          const profile = await getPatientProfile(patient.id);
          if (profile) profiles[patient.id] = profile;
        }
        setPatientProfiles(profiles);
      } catch (error) {
        console.error("Erreur lors du chargement", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session?.userId]);

  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const riskColors = {
    faible: "bg-success-50 text-success-600 ring-success-100",
    moyen: "bg-warning-50 text-warning-600 ring-warning-100",
    élevé: "bg-danger-50 text-danger-600 ring-danger-100",
  };

  if (loading || !doctor) {
    return (
      <div className="min-h-screen">
        <DashboardNavbar title="Dashboard Médecin" userRole="doctor" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-medical-100 animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <DashboardNavbar
        title={`Dr. ${doctor.firstName} ${doctor.lastName}`}
        userRole="doctor"
      />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Tableau de bord médecin
            </h1>
            <p className="text-slate-600 mt-2">
              Gérez et suivez vos {patients.length} patient(s)
            </p>
          </div>
          <button className="btn-primary flex items-center justify-center gap-2 sm:w-auto w-full">
            <Plus className="h-4 w-4" />
            Ajouter un patient
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-slate-500 mb-2">Total patients</p>
                <p className="text-2xl font-bold text-slate-900">
                  {patients.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-medical-50 text-medical-500 ring-1 ring-medical-100">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-slate-500 mb-2">À risque élevé</p>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    Object.values(patientProfiles).filter(
                      (p) => p.niveauRisque === "élevé"
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-danger-50 text-danger-500 ring-1 ring-danger-100">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-slate-500 mb-2">Observance moyenne</p>
                <p className="text-2xl font-bold text-slate-900">
                  {patients.length > 0
                    ? Math.round(
                        (Object.values(patientProfiles).reduce(
                          (sum, p) => sum + p.observance,
                          0
                        ) /
                          Object.keys(patientProfiles).length) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="p-3 rounded-xl bg-success-50 text-success-500 ring-1 ring-success-100">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="card">
          {/* Search */}
          <div className="border-b border-slate-200/70 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Chercher un patient..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Âge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Pathologie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Risque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Observance
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => {
                    const profile = patientProfiles[patient.id];
                    return (
                      <tr
                        key={patient.id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {patient.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.age} ans
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.typePathologie}
                        </td>
                        <td className="px-6 py-4">
                          {profile ? (
                            <span
                              className={`chip ring-1 ${
                                riskColors[profile.niveauRisque]
                              }`}
                            >
                              {profile.niveauRisque}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {profile
                            ? `${Math.round(profile.observance * 100)}%`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/doctor/patient/${patient.id}`
                              )
                            }
                            className="flex items-center gap-1 text-medical-600 hover:text-medical-700 font-medium text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            Voir
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-slate-600">
                        {searchTerm
                          ? "Aucun patient trouvé"
                          : "Aucun patient assigné"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
