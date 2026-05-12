/**
 * RiskBadge.tsx
 * ------------------------------------------------------------
 * Rôle : badge coloré indiquant le niveau de risque (DSO1).
 * Codes couleurs : vert (faible), orange (moyen), rouge (élevé).
 * ------------------------------------------------------------
 */
import { RiskLevel } from "@/lib/types";
import { riskColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function RiskBadge({
  level,
  size = "md",
  withDot = true,
}: {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  withDot?: boolean;
}) {
  const c = riskColor(level);
  const label =
    level === "élevé" ? "Risque élevé" : level === "moyen" ? "Risque moyen" : "Risque faible";
  const sz =
    size === "lg"
      ? "text-sm px-3 py-1.5"
      : size === "sm"
      ? "text-[11px] px-2 py-0.5"
      : "text-xs px-2.5 py-1";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold ring-1",
        c.bg,
        c.text,
        c.ring,
        sz
      )}
    >
      {withDot && <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />}
      {label}
    </span>
  );
}
