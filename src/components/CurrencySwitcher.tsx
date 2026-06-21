"use client";

import { useState } from "react";
import { ChevronDown, Banknote } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { CURRENCIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Currency } from "@/types";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium transition hover:border-slate-600"
        )}
      >
        <Banknote className="h-4 w-4 text-slate-400" />
        <span className="text-slate-200">{currency}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-slate-500 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCurrency(c as Currency);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center px-3 py-2.5 text-sm font-mono transition hover:bg-slate-800",
                currency === c ? "bg-slate-800 text-white" : "text-slate-400"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}