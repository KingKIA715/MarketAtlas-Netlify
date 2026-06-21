"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { HistoricalPoint } from "@/types";
import { cn } from "@/lib/utils";

const Recharts = dynamic(() => import("recharts"), { ssr: false, loading: () => <div className="h-48 animate-pulse rounded bg-slate-800" /> });

interface ChartProps {
  data: HistoricalPoint[];
  color?: string;
  className?: string;
  height?: number;
}

export function Chart({ data, color = "#fbbf24", className, height = 200 }: ChartProps) {
  const ChartContent = useMemo(() => {
    if (!data?.length) return null;
    return (
      <Recharts.ResponsiveContainer width="100%" height={height}>
        <Recharts.AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Recharts.XAxis dataKey="date" hide />
          <Recharts.YAxis hide domain={["auto", "auto"]} />
          <Recharts.Tooltip
            contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px" }}
            itemStyle={{ color: "#e2e8f0" }}
            labelStyle={{ display: "none" }}
            formatter={(value: number) => [value.toFixed(2), ""]}
          />
          <Recharts.Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#chartGrad)" />
        </Recharts.AreaChart>
      </Recharts.ResponsiveContainer>
    );
  }, [data, color, height]);

  return <div className={cn("w-full", className)}>{ChartContent}</div>;
}