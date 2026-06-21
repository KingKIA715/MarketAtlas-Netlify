"use client";

import { Card } from "@/components/shared/Card";
import { Table } from "@/components/shared/Table";
import { LiveBadge } from "@/components/shared/LiveBadge";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";
import type { StockData } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockCardProps {
  data: StockData;
  currency: string;
}

export function StockCard({ data, currency }: StockCardProps) {
  return (
    <div className="space-y-4">
      {/* Indices */}
      <Card title="Market Indices" action={<LiveBadge timestamp={data.updatedAt} />}>
        <div className="grid gap-3 sm:grid-cols-3">
          {data.indices.map((idx) => (
            <div key={idx.name} className="rounded-lg bg-slate-800/50 p-3">
              <p className="text-xs text-slate-500">{idx.name}</p>
              <p className="text-lg font-bold text-white">{formatNumber(idx.value)}</p>
              <p className={idx.changePercent >= 0 ? "text-xs text-emerald-400" : "text-xs text-red-400"}>
                {idx.change >= 0 ? "+" : ""}{formatNumber(idx.change)} ({formatPercent(idx.changePercent)})
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Gainers */}
      <Card title="Top Gainers" className="border-emerald-900/30">
        <Table
          data={data.gainers}
          keyExtractor={(r) => r.symbol}
          columns={[
            { key: "symbol", header: "Symbol", className: "font-mono" },
            { key: "name", header: "Name" },
            {
              key: "changePercent",
              header: "Change",
              render: (r) => (
                <span className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {formatPercent(r.changePercent)}
                </span>
              ),
            },
          ]}
        />
      </Card>

      {/* Losers */}
      <Card title="Top Losers" className="border-red-900/30">
        <Table
          data={data.losers}
          keyExtractor={(r) => r.symbol}
          columns={[
            { key: "symbol", header: "Symbol", className: "font-mono" },
            { key: "name", header: "Name" },
            {
              key: "changePercent",
              header: "Change",
              render: (r) => (
                <span className="flex items-center gap-1 text-red-400">
                  <TrendingDown className="h-3.5 w-3.5" />
                  {formatPercent(r.changePercent)}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}