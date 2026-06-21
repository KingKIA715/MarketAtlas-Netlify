"use client";

import { useGlobalStore } from "@/stores/global";
import { Card } from "@/components/shared/Card";
import { Skeleton } from "@/components/shared/Skeleton";
import { LiveBadge } from "@/components/shared/LiveBadge";
import { TrendingUp, TrendingDown, DollarSign, Droplets, Flame, Coins } from "lucide-react";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

export function Dashboard() {
  const currency = useGlobalStore((s) => s.currency);

  // Static preview data - will be replaced by real data in module pages
  const modules = [
    { label: "Gold", value: 6245.32, change: 1.24, icon: Coins, color: "text-gold-400", href: "/precious-metals/" },
    { label: "Silver", value: 72.18, change: -0.45, icon: Coins, color: "text-slate-300", href: "/precious-metals/" },
    { label: "Nifty 50", value: 23456.78, change: 0.89, icon: TrendingUp, color: "text-emerald-400", href: "/stocks/" },
    { label: "Crude Oil", value: 78.42, change: -1.12, icon: Droplets, color: "text-amber-400", href: "/gasoline/" },
    { label: "USD/INR", value: 83.12, change: 0.05, icon: DollarSign, color: "text-blue-400", href: "/currencies/" },
    { label: "Petrol", value: 102.45, change: 0.0, icon: Flame, color: "text-red-400", href: "/gasoline/" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Real-time financial data for everyone</p>
        </div>
        <LiveBadge timestamp={new Date().toISOString()} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <a key={m.label} href={m.href} className="group">
            <Card className="transition hover:border-slate-700 hover:bg-slate-800/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg bg-slate-800 p-2", m.color)}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{m.label}</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(m.value, currency)}</p>
                  </div>
                </div>
                <span className={cn("text-sm font-medium", m.change >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {formatPercent(m.change)}
                </span>
              </div>
            </Card>
          </a>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card title="Market Overview" className="h-64">
          <Skeleton className="h-full w-full" count={1} />
        </Card>
        <Card title="Top Movers" className="h-64">
          <Skeleton className="h-full w-full" count={1} />
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}