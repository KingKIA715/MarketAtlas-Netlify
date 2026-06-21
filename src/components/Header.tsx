import Link from "next/link";
import { Globe, TrendingUp, Coins, Fuel, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/precious-metals/", label: "Metals", icon: Coins },
  { href: "/stocks/", label: "Stocks", icon: TrendingUp },
  { href: "/gasoline/", label: "Fuel", icon: Fuel },
  { href: "/currencies/", label: "Forex", icon: Globe },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-gold-400" />
          <span className="text-lg font-bold tracking-tight">MarketAtlas</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}