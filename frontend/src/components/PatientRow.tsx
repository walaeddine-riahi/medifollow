/**
 * PatientRow.tsx
 * ------------------------------------------------------------
 * Rôle : ligne du tableau médecin — résume un patient avec
 * badge de risque (DSO1), cluster (DSO2), observance, dernière activité.
 * ------------------------------------------------------------
 */
"use client";
import Link from "next/link";
import type { Patient, PatientProfile } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";
import { formatDate, shortName } from "@/lib/utils";

export function PatientRow({
  patient,
  profile,
  lastActivity,
}: {
  patient: Patient;
  profile?: PatientProfile;
  lastActivity: string | null;
}) {
  const initials = shortName(patient.firstName, patient.lastName);
  return (
    <Link
      href={`/doctor/patients/${patient.id}`}
      className="grid grid-cols-12 items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0"
    >
      <div className="col-span-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-medical-50 text-medical-600 grid place-items-center font-semibold text-sm">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-slate-900 truncate">
            {patient.firstName} {patient.lastName}
          </p>
          <p className="text-xs text-slate-500 capitalize">
            {patient.age} ans · {patient.typePathologie} · {patient.nbComorbidites} comorb.
          </p>
        </div>
      </div>
      <div className="col-span-2">
        {profile ? <RiskBadge level={profile.niveauRisque} /> : <span className="text-xs text-slate-400">—</span>}
      </div>
      <div className="col-span-3 text-sm text-slate-600 truncate">
        {profile ? `Groupe ${profile.clusterId} — ${profile.clusterLabel}` : "—"}
      </div>
      <div className="col-span-2">
        {profile ? (
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={
                  "h-full " +
                  (profile.observance > 0.75
                    ? "bg-success-500"
                    : profile.observance > 0.5
                    ? "bg-warning-500"
                    : "bg-danger-500")
                }
                style={{ width: `${Math.round(profile.observance * 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-700">
              {Math.round(profile.observance * 100)}%
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </div>
      <div className="col-span-1 text-xs text-slate-500 text-right">
        {lastActivity ? formatDate(lastActivity) : "—"}
      </div>
    </Link>
  );
}
