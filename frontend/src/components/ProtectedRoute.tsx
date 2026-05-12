/**
 * ProtectedRoute.tsx
 * Composant HOC pour protéger les routes
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  requiredRole?: "patient" | "doctor";
  children: React.ReactNode;
}

export function ProtectedRoute({
  requiredRole,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { session, ready } = useSession();

  useEffect(() => {
    if (!ready) return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (requiredRole && session.role !== requiredRole) {
      router.push(
        session.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"
      );
    }
  }, [session, ready, router, requiredRole]);

  if (!ready || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-medical-500" />
      </div>
    );
  }

  if (requiredRole && session.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-medical-500" />
      </div>
    );
  }

  return <>{children}</>;
}
