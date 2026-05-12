/**
 * SegmentCard.tsx
 * ------------------------------------------------------------
 * Rôle : carte affichant le cluster (DSO2) du patient + libellé interprétatif.
 * ------------------------------------------------------------
 */
import { Users } from "lucide-react";

export function SegmentCard({
  clusterId,
  label,
  description,
}: {
  clusterId: number;
  label: string;
  description: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-medical-50 text-medical-500 grid place-items-center shrink-0">
          <Users className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="label">Segmentation · DSO2</p>
          <p className="mt-0.5 text-base font-semibold text-slate-900 truncate">
            Groupe {clusterId} — {label}
          </p>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
