/**
 * layout.tsx
 * ------------------------------------------------------------
 * Layout racine de l'application Next.js.
 * - Charge la police Inter
 * - Définit les métadonnées
 * - Injecte le SessionProvider (mock auth)
 * ------------------------------------------------------------
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/session";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "MediSuiv — Suivi post-hospitalisation intelligent",
  description:
    "Plateforme académique combinant Random Forest, K-Means et filtrage collaboratif pour le suivi post-hospitalisation des patients.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="min-h-screen bg-canvas text-slate-800">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
