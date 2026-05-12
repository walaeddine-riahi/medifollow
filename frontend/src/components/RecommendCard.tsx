/**
 * RecommendCard.tsx
 * ------------------------------------------------------------
 * Rôle : carte d'un soin recommandé (DSO3).
 * Affiche nom, catégorie (icône), fréquence, difficulté, bouton "complété".
 * ------------------------------------------------------------
 */
"use client";
import {
  Activity,
  Apple,
  Brain,
  CheckCircle2,
  Circle,
  Dumbbell,
  Pill,
  Stethoscope,
} from "lucide-react";
import type { Categorie, Difficulte, Item } from "@/lib/types";

const catIcon: Record<Categorie, React.ReactNode> = {
  "kinésithérapie": <Dumbbell className="h-4 w-4" />,
  nutrition: <Apple className="h-4 w-4" />,
  "médication": <Pill className="h-4 w-4" />,
  "auto-surveillance": <Stethoscope className="h-4 w-4" />,
  psychologique: <Brain className="h-4 w-4" />,
  "activité physique": <Activity className="h-4 w-4" />,
};

const diffStyles: Record<Difficulte, string> = {
  facile: "bg-success-50 text-success-600",
  "modérée": "bg-warning-50 text-warning-600",
  difficile: "bg-danger-50 text-danger-600",
};

export function RecommendCard({
  item,
  completed,
  onToggle,
}: {
  item: Item;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card p-4 flex items-start gap-4 hover:shadow-soft transition">
      <div className="h-10 w-10 rounded-xl bg-medical-50 text-medical-500 grid place-items-center shrink-0">
        {catIcon[item.categorie]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-slate-900 truncate">{item.nom}</p>
          <span className={"chip " + diffStyles[item.niveauDifficulte]}>
            {item.niveauDifficulte}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 capitalize">{item.categorie}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Fréquence : <span className="text-slate-700 font-medium">{item.frequenceRecommandee}</span>
          </span>
          <button
            type="button"
            onClick={onToggle}
            className={
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition " +
              (completed
                ? "bg-success-50 text-success-600 hover:bg-success-50/80"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200")
            }
          >
            {completed ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Complété
              </>
            ) : (
              <>
                <Circle className="h-3.5 w-3.5" /> Marquer fait
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
