"use client";

import { Card } from "@/components/shared/Card";
import { LiveBadge } from "@/components/shared/LiveBadge";
import { formatCurrency } from "@/lib/utils";
import type { FuelData } from "@/types";
import { Droplets, Fuel as FuelIcon, Flame, Truck, Home } from "lucide-react";

interface FuelCardProps {
  data: FuelData;
  currency: string;
}

export function FuelCard({ data, currency }: FuelCardProps) {
  const items = [
    { label: "Crude Oil", value: data.crude, icon: Droplets, color: "text-amber-400", unit: "barrel" },
    { label: "Petrol", value: data.petrol, icon: FuelIcon, color: "text-red-400", unit: "litre" },
    { label: "Diesel", value: data.diesel, icon: Truck, color: "text-orange-400", unit: "litre" },
    { label: "LPG Commercial", value: data.lpgCommercial, icon: Flame, color: "text-blue-400", unit: "cylinder" },
    { label: "LPG Domestic", value: data.lpgDomestic, icon: Home, color: "text-green-400", unit: "cylinder" },
  ];

  return (
    <Card title="Energy & Fuel" action={<LiveBadge timestamp={data.updatedAt} />}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
            <div className={item.color}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-lg font-bold text-white">{formatCurrency(item.value, currency)}</p>
              <p className="text-xs text-slate-600">per {item.unit}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}