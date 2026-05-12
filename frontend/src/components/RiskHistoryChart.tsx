/**
 * RiskHistoryChart.tsx
 * ------------------------------------------------------------
 * Rôle : graphique d'évolution du niveau de risque (axe Y discret 1..3).
 * Source : collection risk_history (sortie DSO1 archivée).
 * ------------------------------------------------------------
 */
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RiskPoint } from "@/lib/types";

export function RiskHistoryChart({ data }: { data: RiskPoint[] }) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    }),
    level: d.numeric,
  }));
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 6, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            interval={4}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            domain={[0.5, 3.5]}
            ticks={[1, 2, 3]}
            tickFormatter={(v) => ({ 1: "Faible", 2: "Moyen", 3: "Élevé" } as any)[v] || ""}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
              boxShadow: "0 8px 24px -8px rgba(15,23,42,.12)",
            }}
            formatter={(v: number) =>
              [({ 1: "Faible", 2: "Moyen", 3: "Élevé" } as any)[v] || v, "Risque"] as any
            }
          />
          <Area
            type="stepAfter"
            dataKey="level"
            stroke="#dc2626"
            strokeWidth={2}
            fill="url(#riskFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
