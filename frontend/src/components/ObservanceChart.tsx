/**
 * ObservanceChart.tsx
 * ------------------------------------------------------------
 * Rôle : LineChart Recharts affichant l'observance sur 30 jours.
 * Observance = moyenne ratings / 5, normalisée entre 0 et 1.
 * ------------------------------------------------------------
 */
"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ObservancePoint } from "@/lib/types";

export function ObservanceChart({ data }: { data: ObservancePoint[] }) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    }),
    obs: Math.round(d.observance * 100),
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="obsLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1a6fbc" />
              <stop offset="100%" stopColor="#16a34a" />
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
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px -8px rgba(15,23,42,.12)",
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v} %`, "Observance"]}
          />
          <Line
            type="monotone"
            dataKey="obs"
            stroke="url(#obsLine)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#1a6fbc" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
