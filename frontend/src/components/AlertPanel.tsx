/**
 * AlertPanel.tsx
 * ------------------------------------------------------------
 * Rôle : panneau "Alertes urgentes" du médecin.
 * Source : collection "alerts" (job APScheduler 24h).
 * Permet d'acquitter une alerte (POST /doctors/alerts/{id}/ack).
 * ------------------------------------------------------------
 */
"use client";
import { AlertTriangle, Check } from "lucide-react";
import type { Alert } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function AlertPanel({
  alerts,
  onAck,
}: {
  alerts: Alert[];
  onAck: (id: string) => void;
}) {
  const open = alerts.filter((a) => !a.acknowledged);
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={
              "h-8 w-8 rounded-lg grid place-items-center " +
              (open.length > 0
                ? "bg-danger-50 text-danger-600 animate-pulseAlert"
                : "bg-slate-100 text-slate-500")
            }
          >
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="section-title">Alertes urgentes</p>
            <p className="text-xs text-slate-500">
              {open.length} alerte{open.length > 1 ? "s" : ""} non acquittée
              {open.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {alerts.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-slate-500">
            Aucune alerte récente.
          </li>
        )}
        {alerts.map((a) => (
          <li
            key={a.id}
            className={
              "px-5 py-3.5 flex items-start gap-3 " +
              (a.acknowledged ? "opacity-60" : "")
            }
          >
            <div
              className={
                "mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 " +
                (a.newRisk === "élevé" ? "bg-danger-500" : "bg-warning-500")
              }
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <strong className="text-slate-900">{a.patientName}</strong>{" "}
                <span className="text-slate-500">passe de</span>{" "}
                <span className="font-medium text-slate-700">{a.oldRisk}</span>{" "}
                <span className="text-slate-500">→</span>{" "}
                <span className="font-semibold text-danger-600">{a.newRisk}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(a.timestamp)}</p>
            </div>
            {!a.acknowledged && (
              <button
                onClick={() => onAck(a.id)}
                className="btn-ghost text-xs"
                type="button"
              >
                <Check className="h-3.5 w-3.5" /> Acquitter
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
