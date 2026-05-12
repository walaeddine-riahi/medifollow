/**
 * login/page.tsx
 * Forme de connexion pour patient ou médecin
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import { ArrowLeft, Loader2, AlertCircle, HeartPulse } from "lucide-react";
import { login } from "@/lib/api";
import { useSession } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result) {
        // Stocke la session
        setSession({
          role: result.role,
          userId: result.user.id,
        });
        // Redirige vers le bon dashboard
        const path =
          result.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient";
        router.push(path);
      }
    } catch (err: any) {
      setError(err.message || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-white flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-medical-500 text-white grid place-items-center">
            <HeartPulse className="h-6 w-6" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Connexion
        </h1>
        <p className="text-slate-600 text-center mb-8">
          Accédez à votre tableau de bord personnel
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="label block mb-2">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="input"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="label block mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mot de passe"
              className="input"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-danger-50 border border-danger-100 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 text-danger-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Signup link */}
        <p className="text-sm text-slate-600 text-center mt-6">
          Pas encore inscrit ?{" "}
          <Link
            href="/register"
            className="text-medical-500 font-medium hover:text-medical-600"
          >
            Créer un compte
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-500 mb-2 uppercase">
            Comptes de démo
          </p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>
              <strong>Patient:</strong> demo@patient.com / demo
            </li>
            <li>
              <strong>Médecin:</strong> demo@doctor.com / demo
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
