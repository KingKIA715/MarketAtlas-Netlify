"use client";

import { Card } from "@/components/shared/Card";
import { LiveBadge } from "@/components/shared/LiveBadge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { MetalData } from "@/types";
import { Coins } from "lucide-react";

interface MetalCardProps {
  data: MetalData;
  currency: string;
}

export function MetalCard({ data, currency }: MetalCardProps) {
  return (
    <Card title="Precious Metals" action={<LiveBadge timestamp={data.updatedAt} />}>
      <div className="space-y-4">
        {/* Gold */}
        <div className="rounded-lg bg-slate-800/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Coins className="h-4 w-4 text-gold-400" />
            <span className="text-sm font-semibold text-gold-400">Gold</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Gram (24K)</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.gold.k24, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Sovereign</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.gold.sovereign, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">22K</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.gold.k22, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">18K</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.gold.k18, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Gram</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.gold.gram, currency)}</p>
            </div>
          </div>
        </div>

        {/* Silver */}
        <div className="rounded-lg bg-slate-800/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Coins className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-semibold text-slate-300">Silver</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-slate-500">Gram</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.silver.gram, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">KG</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.silver.kg, currency)}</p>
            </div>
          </div>
        </div>

        {/* Platinum */}
        <div className="rounded-lg bg-slate-800/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Coins className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Platinum</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-slate-500">Gram</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.platinum.gram, currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">KG</p>
              <p className="text-sm font-bold text-white">{formatCurrency(data.platinum.kg, currency)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}