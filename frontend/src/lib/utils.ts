/**
 * utils.ts
 * ------------------------------------------------------------
 * Rôle : helpers UI partagés (classnames, formatage, mapping risque).
 * ------------------------------------------------------------
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function riskToNumeric(r: RiskLevel): number {
  if (r === "faible") return 1;
  if (r === "moyen") return 2;
  return 3;
}

export function riskColor(r: RiskLevel): {
  bg: string;
  text: string;
  ring: string;
  dot: string;
} {
  if (r === "élevé")
    return {
      bg: "bg-danger-50",
      text: "text-danger-600",
      ring: "ring-danger-500/40",
      dot: "bg-danger-500",
    };
  if (r === "moyen")
    return {
      bg: "bg-warning-50",
      text: "text-warning-600",
      ring: "ring-warning-500/40",
      dot: "bg-warning-500",
    };
  return {
    bg: "bg-success-50",
    text: "text-success-600",
    ring: "ring-success-500/40",
    dot: "bg-success-500",
  };
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shortName(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}
