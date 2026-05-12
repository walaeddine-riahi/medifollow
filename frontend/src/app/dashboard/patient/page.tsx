/**
 * dashboard/patient/page.tsx
 * Dashboard complet du patient
 */
"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Clock,
  Heart,
  Zap,
  LineChart,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { useSession } from "@/lib/session";
import {
  getPatient,
  getPatientProfile,
  getRecommendedItems,
  getPatientRiskHistory,
  getPatientObservance,
  getThread,
  sendMessage,
  postInteraction,
} from "@/lib/api";
import type { Patient, PatientProfile, Item, RiskPoint, Message } from "@/lib/types";
import { MessageThread } from "@/components/MessageThread";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { VitalsModal } from "@/components/VitalsModal";

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute requiredRole="patient">
      <PatientDashboardContent />
    </ProtectedRoute>
  );
}

function PatientDashboardContent() {
  const { session } = useSession();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Item[]>([]);
  const [riskHistory, setRiskHistory] = useState<RiskPoint[]>([]);
  const [observanceData, setObservanceData] = useState<
    Array<{ date: string; observance: number }>
  >([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [vitals, setVitals] = useState<any>(null);

  const loadData = async (customVitals?: any) => {
    if (!session?.userId) return null;
    setLoading(true);
    try {
      // If we have custom vitals, we must update the profile FIRST 
      // to ensure recommendations are recalculated based on them
      let pat, prof, recs, risk, obs, msgs;
      
      const userId = session.userId;
      
      if (customVitals) {
        // Sequentially update profile first to ensure fresh recommendations
        prof = await getPatientProfile(userId, customVitals);
        [pat, recs, risk, obs, msgs] = await Promise.all([
          getPatient(userId),
          getRecommendedItems(userId),
          getPatientRiskHistory(userId),
          getPatientObservance(userId),
          getThread(userId, "any").catch(() => []),
        ]);
      } else {
        [pat, prof, recs, risk, obs, msgs] = await Promise.all([
          getPatient(userId),
          getPatientProfile(userId),
          getRecommendedItems(userId),
          getPatientRiskHistory(userId),
          getPatientObservance(userId),
          getThread(userId, "any").catch(() => []),
        ]);
      }

      setPatient(pat || null);
      setProfile(prof || null);
      setRecommendations(recs);
      setRiskHistory(risk);
      setMessages(msgs || []);
      setObservanceData(
        obs.map((o) => ({
          date: new Date(o.date).toLocaleDateString("fr-FR", {
            month: "short",
            day: "numeric",
          }),
          observance: Math.round(o.observance * 100),
        }))
      );
      return prof;
    } catch (error) {
      console.error("Erreur lors du chargement des données", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Poll for new messages every 5 seconds
    const intervalId = setInterval(async () => {
      if (session?.userId) {
        const msgs = await getThread(session.userId, "any").catch(() => []);
        if (msgs.length > 0) {
          setMessages(msgs);
        }
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [session?.userId]);

  const handleMarkAsDone = async (item: Item & { originalId?: string }) => {
    if (!session?.userId) {
      console.warn("Pas de session utilisateur pour marquer comme fait");
      return;
    }
    
    const itemId = item.id;
    const backendId = item.originalId || item.id;
    
    console.log("Marquage de l'item comme fait:", itemId, "(Backend ID:", backendId, ")");
    
    // Optimistic UI update: remove item immediately
    setRecommendations(prev => {
      const filtered = prev.filter(it => it.id !== itemId);
      return filtered;
    });

    try {
      await postInteraction({
        patientId: session.userId,
        itemId: backendId,
        completed: true
      });
    } catch (error) {
      console.error("Erreur lors du marquage comme fait", error);
    }
  };

  const handleVitalsSubmit = async (newVitals: any) => {
    setVitals(newVitals);
    // Reload main profile data and get the fresh result
    const freshProfile = await loadData(newVitals);
    
    // Dynamically append to history if we have the profile
    if (freshProfile) {
      const newPoint: RiskPoint = {
        date: new Date().toISOString(),
        niveauRisque: freshProfile.niveauRisque,
        numeric: freshProfile.niveauRisque === "élevé" ? 3 : freshProfile.niveauRisque === "moyen" ? 2 : 1
      };
      setRiskHistory(prev => [newPoint, ...prev]);
    }
  };

  if (loading && !patient) {
    return (
      <div className="min-h-screen">
        <DashboardNavbar title="Dashboard Patient" userRole="patient" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-medical-100 animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement de vos données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!patient || !profile) {
    return (
      <div className="min-h-screen">
        <DashboardNavbar title="Erreur" userRole="patient" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-600">Impossible de charger votre profil. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  const riskLevelColor = {
    faible: "bg-success-50 text-success-600 ring-success-100",
    moyen: "bg-warning-50 text-warning-600 ring-warning-100",
    élevé: "bg-danger-50 text-danger-600 ring-danger-100",
  };

  const riskLevelIcon = {
    faible: <TrendingDown className="h-5 w-5" />,
    moyen: <Zap className="h-5 w-5" />,
    élevé: <AlertCircle className="h-5 w-5" />,
  };

  return (
    <div className="min-h-screen bg-canvas">
      <DashboardNavbar
        title={`${patient?.firstName} ${patient?.lastName}`}
        userRole="patient"
      />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Emergency Alert Banner */}
        {messages.some(m => m.content.includes("🚨 ALERTE CRITIQUE") && m.senderRole === "doctor") && (
          <div className="mb-8 p-4 bg-danger-600 text-white rounded-2xl shadow-xl animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-lg">ALERTE MÉDICALE URGENTE</p>
                <p className="opacity-90">Votre médecin demande votre présence immédiate en clinique.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="px-6 py-2 bg-white text-danger-600 rounded-xl font-bold hover:bg-slate-100 transition"
            >
              Voir les détails
            </button>
          </div>
        )}
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Bienvenue, {patient?.firstName} !
            </h1>
            <p className="text-slate-600 mt-2">
              Voici votre tableau de bord personnalisé de suivi médical.
            </p>
          </div>
          <button
            onClick={() => setIsVitalsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-medical-500 text-white rounded-2xl font-semibold hover:bg-medical-600 transition shadow-lg shadow-medical-500/25 w-fit"
          >
            <Activity className="h-5 w-5" />
            Mettre à jour mes constantes
          </button>
        </div>

        <VitalsModal
          isOpen={isVitalsModalOpen}
          onClose={() => setIsVitalsModalOpen(false)}
          onSubmit={handleVitalsSubmit}
        />

        {/* KPIs Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Risk Level */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-slate-500 mb-2">Niveau de risque</p>
                <p className="text-2xl font-bold text-slate-900">
                  {profile.niveauRisque.charAt(0).toUpperCase() +
                    profile.niveauRisque.slice(1)}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ring-1 ${
                  riskLevelColor[profile.niveauRisque]
                }`}
              >
                {riskLevelIcon[profile.niveauRisque]}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Basé sur votre âge, pathologie et comorbidités
            </p>
          </div>

          {/* Observance */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-slate-500 mb-2">Observance</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(profile.observance * 100)}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-medical-50 text-medical-500 ring-1 ring-medical-100">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Suivi des recommandations
            </p>
          </div>

          {/* Patient Info */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-slate-500 mb-2">Informations</p>
                <p className="text-sm font-semibold text-slate-900">
                  {patient.age} ans · {patient.sexe === "M" ? "Homme" : "Femme"}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {patient.typePathologie}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-100">
                <Heart className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              {patient.nbComorbidites} comorbidité(s)
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Observance Chart */}
          <div className="card p-6">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <LineChart className="h-5 w-5 text-medical-500" />
              Évolution de l'observance
            </h2>
            {observanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <RechartsLineChart data={observanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="observance"
                    stroke="#1a6fbc"
                    dot={{ fill: "#1a6fbc" }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-600 text-sm">Aucune donnée disponible</p>
            )}
          </div>

          {/* Risk History */}
          <div className="card p-6">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-medical-500" />
              Historique du risque
            </h2>
            {riskHistory.length > 0 ? (
              <div className="space-y-3">
                {riskHistory.slice(0, 5).map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">
                        {new Date(point.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <span
                      className={`chip ring-1 ${
                        riskLevelColor[point.niveauRisque]
                      }`}
                    >
                      {point.niveauRisque}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card p-6">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-medical-500" />
            Recommandations personnalisées
          </h2>

          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.nom}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="chip bg-medical-50 text-medical-600 ring-1 ring-medical-100">
                        {item.categorie}
                      </span>
                      <span className="chip bg-slate-50 text-slate-600 ring-1 ring-slate-100">
                        {item.frequenceRecommandee}
                      </span>
                      <span className="chip bg-slate-50 text-slate-600 ring-1 ring-slate-100">
                        {item.niveauDifficulte}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleMarkAsDone(item)}
                    className="flex-shrink-0 ml-4 px-4 py-2 bg-medical-50 text-medical-600 rounded-lg hover:bg-medical-100 transition font-medium text-sm"
                  >
                    Marquer comme fait
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">
              Aucune recommandation disponible pour le moment.
            </p>
          )}
        </div>
        {/* Chat Section */}
        <div className="mt-8">
          <MessageThread 
            messages={messages} 
            currentUserId={session?.userId || ""} 
            onSend={async (text) => {
              await sendMessage({
                senderId: session?.userId || "",
                senderRole: "patient",
                receiverId: patient?.doctorId || "doc_demo",
                content: text
              });
              const msgs = await getThread(session?.userId || "", "any");
              setMessages(msgs);
            }}
          />
        </div>

        {/* Patient Profile */}
        <div className="card p-6 mt-8">
          <h2 className="section-title mb-4">Votre profil ML (DSO2)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="label text-slate-500 mb-2">Cluster assigné</p>
              <p className="font-semibold text-slate-900 text-lg">
                Groupe {profile.clusterId}
              </p>
              <p className="text-slate-600 text-sm mt-2">
                {profile.clusterLabel}
              </p>
            </div>
            <div>
              <p className="label text-slate-500 mb-2">Description</p>
              <p className="text-slate-700 text-sm italic">
                {profile.clusterId === 0 && "Vous faites partie du groupe des patients qui suivent rigoureusement leur traitement. Votre risque de complication est actuellement stable grâce à votre assiduité."}
                {profile.clusterId === 1 && "Votre profil indique des variations dans vos constantes biométriques. Une surveillance plus régulière de votre tension et de votre activité physique est suggérée."}
                {profile.clusterId === 2 && "En tant que profil en phase d'ajustement, le système analyse vos constantes pour établir votre rythme de base. Continuez à renseigner vos données pour affiner l'analyse."}
                {![0, 1, 2].includes(profile.clusterId) && "Analyse personnalisée de votre profil en cours basée sur vos constantes médicales et votre historique de soins."}
              </p>
            </div>
          </div>
        </div>

        {/* Floating Chat Toggle */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="h-14 w-14 bg-medical-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-medical-600 transition hover:scale-110 active:scale-95"
          >
            <Activity className="h-6 w-6" />
          </button>
        </div>

        {isChatOpen && (
          <div className="fixed bottom-24 right-8 z-50 w-[400px] shadow-2xl animate-in slide-in-from-bottom-4">
            <MessageThread 
              messages={messages} 
              currentUserId={session?.userId || ""} 
              onSend={async (text) => {
                await sendMessage({
                  senderId: session?.userId || "",
                  senderRole: "patient",
                  receiverId: patient?.doctorId || "doc_demo",
                  content: text
                });
                const msgs = await getThread(session?.userId || "", "any");
                setMessages(msgs);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
