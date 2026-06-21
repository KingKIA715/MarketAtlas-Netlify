"use client";

import { useState } from "react";
import { Card } from "@/components/shared/Card";
import { Table } from "@/components/shared/Table";
import { LiveBadge } from "@/components/shared/LiveBadge";
import { formatNumber } from "@/lib/utils";
import type { ForexData } from "@/types";
import { Search, ArrowRightLeft } from "lucide-react";

interface FXCardProps {
  data: ForexData;
  currency: string;
}

export function FXCard({ data, currency }: FXCardProps) {
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState(currency);
  const [to, setTo] = useState("USD");

  const rates = Object.entries(data.rates)
    .filter(([k]) => k !== currency)
    .filter(([k]) => search === "" || k.toLowerCase().includes(search.toLowerCase()))
    .map(([k, v]) => ({ code: k, rate: v, inverse: 1 / v }));

  const convertRate = data.rates[to] || 1;
  const converted = parseFloat(amount || "0") * convertRate;

  return (
    <div className="space-y-4">
      <Card title="Currency Rates" action={<LiveBadge timestamp={data.updatedAt} />}>
        <div className="mb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-600"
            />
          </div>
        </div>
        <Table
          data={rates.slice(0, 10)}
          keyExtractor={(r) => r.code}
          columns={[
            { key: "code", header: "Currency", className: "font-mono font-semibold" },
            {
              key: "rate",
              header: `1 ${currency} =`,
              render: (r) => <span className="text-white">{formatNumber(r.rate, 4)}</span>,
            },
            {
              key: "inverse",
              header: `1 ${data.base} =`,
              render: (r) => <span className="text-slate-500">{formatNumber(r.inverse, 4)}</span>,
            },
          ]}
        />
      </Card>

      <Card title="Converter">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="mb-1 text-xs text-slate-500">Amount</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-slate-600"
            />
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs text-slate-500">From</p>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
            >
              {Object.keys(data.rates).concat(data.base).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <ArrowRightLeft className="mt-5 h-5 w-5 text-slate-500" />
          <div className="flex-1">
            <p className="mb-1 text-xs text-slate-500">To</p>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
            >
              {Object.keys(data.rates).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-slate-800/50 p-4 text-center">
          <p className="text-sm text-slate-500">
            {amount} {from} =
          </p>
          <p className="text-2xl font-bold text-white">
            {formatNumber(converted, 4)} {to}
          </p>
        </div>
      </Card>
    </div>
  );
}