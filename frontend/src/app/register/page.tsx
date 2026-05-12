/**
 * register/page.tsx
 * Formulaire d'inscription pour patient ou médecin
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import { ArrowLeft, Loader2, AlertCircle, HeartPulse } from "lucide-react";
import { useSession } from "@/lib/session";

interface RegisterData {
  role: "patient" | "doctor" | "";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialite?: string; // Pour médecin
  rpps?: string; // Pour médecin
}

export default function RegisterPage() {
  const router = useRouter();
  const { setSession } = useSession();
  const [form, setForm] = useState<RegisterData>({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.role) {
      setError("Veuillez sélectionner votre type de profil");
      return;
    }
    if (!form.firstName || !form.lastName) {
      setError("Le prénom et le nom sont requis");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (form.role === "doctor" && !form.specialite) {
      setError("La spécialité est requise pour les médecins");
      return;
    }

    setLoading(true);
    try {
      // Simulation d'inscription
      // En production, appeler une API d'inscription
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
        ...(form.role === "doctor" && { specialite: form.specialite }),
      };

      // Stocker la session
      setSession({
        role: form.role as "patient" | "doctor",
        userId: mockUser.id,
      });

      // Redirection
      const path =
        form.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient";
      router.push(path);
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
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
          Créer un compte
        </h1>
        <p className="text-slate-600 text-center mb-8">
          Inscrivez-vous en quelques minutes
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="label block mb-2">
              Type de profil
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input"
            >
              <option value="">Sélectionnez votre profil</option>
              <option value="patient">Patient</option>
              <option value="doctor">Médecin</option>
            </select>
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="label block mb-2">
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Jean"
              className="input"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="label block mb-2">
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Dupont"
              className="input"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Doctor fields */}
          {form.role === "doctor" && (
            <>
              <div>
                <label htmlFor="specialite" className="label block mb-2">
                  Spécialité
                </label>
                <select
                  id="specialite"
                  name="specialite"
                  value={form.specialite || ""}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Sélectionnez votre spécialité</option>
                  <option value="Cardiologie">Cardiologie</option>
                  <option value="Pneumologie">Pneumologie</option>
                  <option value="Neurologie">Neurologie</option>
                  <option value="Oncologie">Oncologie</option>
                  <option value="Médecine générale">Médecine générale</option>
                </select>
              </div>
              <div>
                <label htmlFor="rpps" className="label block mb-2">
                  RPPS (Numéro de praticien)
                </label>
                <input
                  id="rpps"
                  type="text"
                  name="rpps"
                  placeholder="123456"
                  className="input"
                  value={form.rpps || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="label block mb-2">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="votre@email.com"
              className="input"
              value={form.email}
              onChange={handleChange}
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
              name="password"
              placeholder="Min. 6 caractères"
              className="input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="label block mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              className="input"
              value={form.confirmPassword}
              onChange={handleChange}
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
                Inscription en cours...
              </>
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-sm text-slate-600 text-center mt-6">
          Déjà inscrit ?{" "}
          <Link
            href="/login"
            className="text-medical-500 font-medium hover:text-medical-600"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
