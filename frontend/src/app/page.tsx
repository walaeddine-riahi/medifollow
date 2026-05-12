/**
 * page.tsx (Home)
 * ------------------------------------------------------------
 * Page d'accueil marketing de la plateforme MediSuiv.
 * Présente les 3 piliers ML : Prédiction (DSO1), Segmentation (DSO2),
 * Recommandation (DSO3). Boutons : connexion / inscription.
 * ------------------------------------------------------------
 */
import Link from "next/link";
import {
  Activity,
  Brain,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-medical-500 text-white grid place-items-center">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="font-semibold text-slate-900">MediSuiv</span>
            <span className="hidden sm:inline text-xs text-slate-400 ml-2">
              Suivi post-hospitalisation
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost">
              Connexion
            </Link>
            <Link href="/register" className="btn-primary">
              Créer un compte
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-medical-50 via-white to-white" />
        <div className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-medical-100 blur-3xl opacity-60" />
        <div className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="chip bg-medical-50 text-medical-600 ring-1 ring-medical-100">
              <Sparkles className="h-3.5 w-3.5" />
              Projet académique — Data Science médicale
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Le suivi post-hospitalisation
              <span className="block text-medical-500">augmenté par le ML</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl">
              Trois modèles ML cohabitent pour aider patients et soignants :
              <strong className="text-slate-800"> prédire le risque</strong>,
              <strong className="text-slate-800"> segmenter la patientèle</strong> et
              <strong className="text-slate-800"> recommander les bons soins</strong> au
              bon moment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary">
                <Stethoscope className="h-4 w-4" />
                Se connecter
              </Link>
              <Link href="/register" className="btn-secondary">
                <Users className="h-4 w-4" />
                Créer un compte
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat label="Modèles ML" value="3" />
              <Stat label="Collections Mongo" value="8" />
              <Stat label="Endpoints API" value="20+" />
            </div>
          </div>

          {/* Mock card */}
          <div className="relative">
            <div className="card-soft p-6 rotate-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Patiente · Sophie Martin · 67 ans</p>
                  <p className="font-semibold text-slate-900">
                    Profil ML mis à jour à l'instant
                  </p>
                </div>
                <span className="chip bg-danger-50 text-danger-600 ring-1 ring-danger-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger-500" />
                  Risque élevé
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniMetric
                  label="Observance"
                  value="58%"
                  hint="−12% sur 7j"
                  tone="warn"
                />
                <MiniMetric
                  label="Cluster"
                  value="Groupe 2"
                  hint="Multi-comorbidités"
                />
              </div>
              <div className="mt-5">
                <p className="label mb-2">Top recommandations (DSO3)</p>
                <ul className="space-y-2">
                  {[
                    "Mesure de la tension artérielle",
                    "Prise du traitement antihypertenseur",
                    "Marche modérée 20 min",
                  ].map((x) => (
                    <li
                      key={x}
                      className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-3 py-2.5"
                    >
                      <span className="text-slate-700">{x}</span>
                      <span className="text-xs text-medical-500 font-medium">
                        recommandé
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-6 card p-4 w-56">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-success-50 text-success-500 grid place-items-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Alerte WebSocket</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Médecin notifié
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-2xl font-semibold text-slate-900">
          Trois modèles ML, une expérience clinique
        </h2>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Chaque modèle alimente une fonctionnalité concrète du parcours patient
          et du tableau de bord médecin.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          <Feature
            icon={<Brain className="h-5 w-5" />}
            tag="DSO1 · Random Forest"
            title="Prédiction du niveau de risque"
            body="Pour chaque patient, on prédit faible / moyen / élevé à partir de l'âge, du sexe, des comorbidités, de la pathologie et de l'observance."
            color="bg-medical-50 text-medical-500"
          />
          <Feature
            icon={<Users className="h-5 w-5" />}
            tag="DSO2 · K-Means"
            title="Segmentation des patients"
            body="Quatre profils types (autonomes, chroniques observants, à risque multi-comorbidités, jeunes en rémission) avec libellés interprétables."
            color="bg-warning-50 text-warning-500"
          />
          <Feature
            icon={<Activity className="h-5 w-5" />}
            tag="DSO3 · Filtrage collaboratif"
            title="Recommandation de soins"
            body="Top-5 soins personnalisés à partir des interactions patient × items, adaptés à la pathologie et au niveau d'autonomie."
            color="bg-success-50 text-success-500"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-slate-500 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MediSuiv — démonstrateur académique.</p>
          <p>FastAPI · MongoDB · Next.js · Tailwind</p>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "warn" | "ok";
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="label">{label}</p>
      <p className="text-xl font-semibold text-slate-900 mt-1">{value}</p>
      <p
        className={
          "text-xs mt-1 " +
          (tone === "warn" ? "text-warning-600" : "text-slate-500")
        }
      >
        {hint}
      </p>
    </div>
  );
}

function Feature({
  icon,
  tag,
  title,
  body,
  color,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div className="card p-6">
      <div className={"inline-flex h-10 w-10 items-center justify-center rounded-xl " + color}>
        {icon}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {tag}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{body}</p>
    </div>
  );
}
