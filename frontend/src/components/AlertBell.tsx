/**
 * AlertBell.tsx
 * ------------------------------------------------------------
 * Rôle : icône cloche avec compteur d'alertes non lues.
 * Pulse rouge lorsque alertes > 0.
 * ------------------------------------------------------------
 */
"use client";
import { Bell } from "lucide-react";

export function AlertBell({ count }: { count: number }) {
  return (
    <button
      className={
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 " +
        (count > 0 ? "ring-2 ring-danger-500/50 animate-pulseAlert" : "")
      }
      aria-label="Alertes"
      type="button"
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger-500 text-white text-[10px] font-bold grid place-items-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
