"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useCountry } from "@/hooks/useCountry";
import { COUNTRIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Country } from "@/types";

export function CountrySwitcher() {
  const { country, updateCountry } = useCountry();
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((c) => c.code === country);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium transition hover:border-slate-600"
        )}
      >
        <MapPin className="h-4 w-4 text-slate-400" />
        <span className="text-slate-200">{selected?.name}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-slate-500 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                updateCountry(c.code as Country);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2.5 text-sm transition hover:bg-slate-800",
                country === c.code ? "bg-slate-800 text-white" : "text-slate-400"
              )}
            >
              <span className="text-xs font-mono uppercase text-slate-500">{c.code}</span>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}