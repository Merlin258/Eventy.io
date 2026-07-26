"use client";

import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  icon: LucideIcon;
  accent: "blue" | "amber" | "emerald";
  sparkline: number[];
}

const accentMap = {
  blue: { stroke: "#60a5fa", fill: "rgba(96,165,250,0.12)", icon: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  amber: { stroke: "#fbbf24", fill: "rgba(251,191,36,0.12)", icon: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  emerald: { stroke: "#34d399", fill: "rgba(52,211,153,0.12)", icon: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

function Sparkline({ data, stroke, fill }: { data: number[]; stroke: string; fill: string }) {
  const width = 240;
  const height = 56;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-14 w-full" preserveAspectRatio="none">
      <path d={areaPath} fill={fill} />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MetricCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  icon: Icon,
  accent,
  sparkline,
}: MetricCardProps) {
  const colors = accentMap[accent];

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">{value}</p>
          {delta && (
            <p
              className={`mt-1 text-xs font-medium ${
                deltaTone === "up"
                  ? "text-emerald-400"
                  : deltaTone === "down"
                    ? "text-red-400"
                    : "text-zinc-500"
              }`}
            >
              {delta}
            </p>
          )}
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${colors.icon}`}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-4 -mx-1">
        <Sparkline data={sparkline} stroke={colors.stroke} fill={colors.fill} />
      </div>
    </div>
  );
}