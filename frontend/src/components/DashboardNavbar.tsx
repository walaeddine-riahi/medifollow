/**
 * DashboardNavbar.tsx
 * Barre de navigation pour les dashboards authentifiés
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartPulse, LogOut, Settings, User, Menu, X } from "lucide-react";
import { useSession } from "@/lib/session";

interface DashboardNavbarProps {
  title: string;
  userRole: "patient" | "doctor";
}

export function DashboardNavbar({ title, userRole }: DashboardNavbarProps) {
  const router = useRouter();
  const { setSession } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setSession(null);
    router.push("/");
  };

  const isDoctor = userRole === "doctor";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/70 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-medical-500 text-white grid place-items-center flex-shrink-0">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">MediSuiv</p>
              <p className="text-xs text-slate-500">{title}</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden sm:flex items-center gap-4">
            {isDoctor && (
              <Link
                href="/dashboard/doctor"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Mes patients
              </Link>
            )}
            {!isDoctor && (
              <Link
                href="/dashboard/patient"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Mon suivi
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 text-slate-600"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-200/70 px-6 py-4 space-y-3">
            {isDoctor && (
              <Link
                href="/dashboard/doctor"
                className="block text-sm text-slate-600 hover:text-slate-900 transition py-2"
              >
                Mes patients
              </Link>
            )}
            {!isDoctor && (
              <Link
                href="/dashboard/patient"
                className="block text-sm text-slate-600 hover:text-slate-900 transition py-2"
              >
                Mon suivi
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition py-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        )}
      </header>
    </>
  );
}
