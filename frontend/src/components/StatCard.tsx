/**
 * StatCard.tsx
 * ------------------------------------------------------------
 * Rôle : carte KPI réutilisable (label, valeur, indicateur secondaire).
 * ------------------------------------------------------------
 */
import { cn } from "@/lib/utils";

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "medical";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-50 text-slate-600",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    danger: "bg-danger-50 text-danger-600",
    medical: "bg-medical-50 text-medical-600",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="label">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <div
          className={cn(
            "h-10 w-10 rounded-xl grid place-items-center shrink-0",
            tones[tone]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
