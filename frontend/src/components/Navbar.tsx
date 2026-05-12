/**
 * Navbar.tsx
 * ------------------------------------------------------------
 * Rôle : barre de navigation des espaces patient/médecin.
 * Affiche le logo, le rôle, un bouton de déconnexion.
 * ------------------------------------------------------------
 */
"use client";
import Link from "next/link";
import { HeartPulse, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";

export function Navbar({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  const { setSession } = useSession();

  const logout = () => {
    setSession(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200/70">
      <div className="mx-auto max-w-7xl px-6 py-3.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-medical-500 text-white grid place-items-center">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{title}</p>
            {subtitle && <p className="text-xs text-slate-500 leading-tight">{subtitle}</p>}
          </div>
        </Link>
        <div className="flex items-center gap-3">
          {right}
          <button onClick={logout} className="btn-ghost" type="button">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
