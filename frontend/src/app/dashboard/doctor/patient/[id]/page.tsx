/**
 * dashboard/doctor/patient/[id]/page.tsx
 * Fiche patient détaillée pour le médecin
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  Activity,
  Heart,
  TrendingUp,
  MessageSquare,
  FileText,
  Download,
  Stethoscope,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useSession } from "@/lib/session";
import {
  getPatient,
  getPatientProfile,
  getRecommendedItems,
  getPatientInteractions,
  getDoctor,
  getItemById,
  getThread,
  sendMessage,
} from "@/lib/api";
import type { Patient, PatientProfile, Item, Interaction, Message } from "@/lib/types";
import { MessageThread } from "@/components/MessageThread";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function PatientDetailPage() {
  return (
    <ProtectedRoute requiredRole="doctor">
      <PatientDetailContent />
    </ProtectedRoute>
  );
}

function PatientDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { session } = useSession();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [doctor, setDoctor] = useState(null);
  const [recommendations, setRecommendations] = useState<Item[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const loadData = async () => {
    if (!session?.userId) return;
    try {
      const [pat, prof, recs, inter, doc, msgs] = await Promise.all([
        getPatient(patientId),
        getPatientProfile(patientId),
        getRecommendedItems(patientId),
        getPatientInteractions(patientId),
        getDoctor(session.userId),
        getThread(patientId, session.userId),
      ]);

      setPatient(pat || null);
      setProfile(prof || null);
      setRecommendations(recs);
      setInteractions(inter);
      setDoctor(doc);
      setMessages(msgs);
    } catch (error) {
      console.error("Erreur lors du chargement", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Poll for new messages every 5 seconds
    const intervalId = setInterval(async () => {
      if (session?.userId && patientId) {
        const msgs = await getThread(patientId, session.userId).catch(() => []);
        if (msgs.length > 0) {
          setMessages(msgs);
        }
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [patientId, session?.userId]);

  if (loading || !patient || !profile) {
    return (
      <div className="min-h-screen">
        <DashboardNavbar title="Fiche Patient" userRole="doctor" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 rounded-full bg-medical-100 animate-spin"></div>
        </div>
      </div>
    );
  }

  const riskLevelColor = {
    faible: "bg-success-50 text-success-600 ring-success-100",
    moyen: "bg-warning-50 text-warning-600 ring-warning-100",
    élevé: "bg-danger-50 text-danger-600 ring-danger-100",
  };

  // Statistiques des interactions
  const completedCount = interactions.filter((i) => i.completed).length;
  const avgRating =
    interactions.length > 0
      ? (
          interactions.reduce((sum, i) => sum + i.rating, 0) /
          interactions.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-canvas">
      <DashboardNavbar
        title={`${patient.firstName} ${patient.lastName}`}
        userRole="doctor"
      />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header with Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-medical-600 hover:text-medical-700 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </button>

        {/* Patient Info Card */}
        <div className="card p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-slate-600 mt-1">{patient.email}</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <div>
                  <p className="label text-slate-500 mb-1">Âge</p>
                  <p className="font-semibold text-slate-900">
                    {patient.age} ans
                  </p>
                </div>
                <div>
                  <p className="label text-slate-500 mb-1">Sexe</p>
                  <p className="font-semibold text-slate-900">
                    {patient.sexe === "M" ? "Homme" : "Femme"}
                  </p>
                </div>
                <div>
                  <p className="label text-slate-500 mb-1">Pathologie</p>
                  <p className="font-semibold text-slate-900">
                    {patient.typePathologie}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="label text-slate-500 mb-2">Niveau de risque</p>
                  <span
                    className={`chip ring-1 text-lg px-4 py-2 ${
                      riskLevelColor[profile.niveauRisque]
                    }`}
                  >
                    {profile.niveauRisque.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Observance</p>
                  <p className="text-xl font-bold text-slate-900">
                    {Math.round(profile.observance * 100)}%
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Comorbidités</p>
                  <p className="text-xl font-bold text-slate-900">
                    {patient.nbComorbidites}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <p className="label text-slate-500 mb-2">Cluster ML</p>
            <p className="font-bold text-slate-900">
              Groupe {profile.clusterId}
            </p>
          </div>
          <div className="card p-4">
            <p className="label text-slate-500 mb-2">Actions complétées</p>
            <p className="font-bold text-slate-900">{completedCount}</p>
          </div>
          <div className="card p-4">
            <p className="label text-slate-500 mb-2">Note moyenne</p>
            <p className="font-bold text-slate-900">{avgRating}/5</p>
          </div>
          <div className="card p-4">
            <p className="label text-slate-500 mb-2">Autonomie</p>
            <p className="font-bold text-slate-900">
              {patient.scoreAutonomie.toFixed(1)}/10
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="btn-primary flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {isChatOpen ? "Fermer le chat" : "Envoyer un message"}
          </button>
          <button 
            onClick={async () => {
              if (confirm("Voulez-vous envoyer une alerte d'urgence à ce patient pour qu'il se rende à la clinique ?")) {
                await sendMessage({
                  senderId: session?.userId || "",
                  senderRole: "doctor",
                  receiverId: patientId,
                  content: "🚨 ALERTE CRITIQUE : Votre état nécessite une consultation immédiate. Veuillez vous rendre à la clinique la plus proche dès maintenant."
                });
                const msgs = await getThread(patientId, session?.userId || "");
                setMessages(msgs);
                alert("Alerte envoyée !");
              }
            }}
            className="px-4 py-2 bg-danger-600 text-white rounded-xl font-semibold hover:bg-danger-700 transition flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Alerte Clinique
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes cliniques
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter rapport
          </button>
        </div>

        {isChatOpen && (
          <div className="mb-8">
            <MessageThread 
              messages={messages} 
              currentUserId={session?.userId || ""} 
              onSend={async (text) => {
                await sendMessage({
                  senderId: session?.userId || "",
                  senderRole: "doctor",
                  receiverId: patientId,
                  content: text
                });
                const msgs = await getThread(patientId, session?.userId || "");
                setMessages(msgs);
              }}
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recommendations */}
          <div className="card p-6">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-medical-500" />
              Recommandations actives
            </h2>
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-lg p-3"
                  >
                    <p className="font-medium text-slate-900 text-sm">
                      {item.nom}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="chip bg-medical-50 text-medical-600 ring-1 ring-medical-100 text-xs">
                        {item.frequenceRecommandee}
                      </span>
                      <span className="chip bg-slate-50 text-slate-600 ring-1 ring-slate-100 text-xs">
                        {item.niveauDifficulte}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm">
                Aucune recommandation active
              </p>
            )}
          </div>

          {/* Profile */}
          <div className="card p-6">
            <h2 className="section-title mb-4">Profil ML (DSO2)</h2>
            <div className="space-y-4">
              <div>
                <p className="label text-slate-500 mb-2">Cluster</p>
                <p className="font-semibold text-slate-900">
                  Groupe {profile.clusterId}: {profile.clusterLabel}
                </p>
              </div>
              <div>
                <p className="label text-slate-500 mb-2">Description</p>
                <p className="text-sm text-slate-700">
                  Ce patient appartient à un profil clinique particulier avec
                  des besoins spécifiques en matière de suivi et d'observance.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="label text-slate-500 mb-2">Actions principales</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Surveillance rapprochée recommandée</li>
                  <li>• Contact mensuel conseillé</li>
                  <li>• Assistance à l'observance prioritaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Interactions Chart */}
        <div className="card p-6">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-medical-500" />
            Historique des interactions
          </h2>
          {interactions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Complétées",
                    count: completedCount,
                  },
                  {
                    name: "Non complétées",
                    count: interactions.length - completedCount,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1a6fbc" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-600 text-sm">
              Aucune interaction enregistrée
            </p>
          )}
        </div>

        {/* Interactions Table */}
        <div className="card mt-8 overflow-hidden">
          <div className="border-b border-slate-200/70 p-6">
            <h2 className="section-title">Détail des interactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {interactions.length > 0 ? (
                  interactions.slice(0, 10).map((interaction) => {
                    const item = getItemById(interaction.itemId);
                    return (
                      <tr key={interaction.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(interaction.timestamp).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {item?.nom || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`chip ring-1 ${
                              interaction.completed
                                ? "bg-success-50 text-success-600 ring-success-100"
                                : "bg-slate-50 text-slate-600 ring-slate-100"
                            }`}
                          >
                            {interaction.completed
                              ? "Complétée"
                              : "Recommandée"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {interaction.rating}/5
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <p className="text-slate-600">
                        Aucune interaction enregistrée
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
