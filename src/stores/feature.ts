"use client";

import { create } from "zustand";
import type { MetalData, StockData, FuelData, ForexData } from "@/types";

interface FeatureState {
  metals: MetalData | null;
  stocks: StockData | null;
  fuel: FuelData | null;
  forex: ForexData | null;
  isLoading: Record<string, boolean>;
  errors: Record<string, string | null>;
}

interface FeatureActions {
  setMetals: (d: MetalData | null) => void;
  setStocks: (d: StockData | null) => void;
  setFuel: (d: FuelData | null) => void;
  setForex: (d: ForexData | null) => void;
  setLoading: (k: string, v: boolean) => void;
  setError: (k: string, v: string | null) => void;
  invalidateModule: (k: string) => void;
}

export const useFeatureStore = create<FeatureState & FeatureActions>()((set) => ({
  metals: null,
  stocks: null,
  fuel: null,
  forex: null,
  isLoading: {},
  errors: {},
  setMetals: (d) => set({ metals: d }),
  setStocks: (d) => set({ stocks: d }),
  setFuel: (d) => set({ fuel: d }),
  setForex: (d) => set({ forex: d }),
  setLoading: (k, v) => set((s) => ({ isLoading: { ...s.isLoading, [k]: v } })),
  setError: (k, v) => set((s) => ({ errors: { ...s.errors, [k]: v } })),
  invalidateModule: (k) =>
    set((s) => {
      const next: Partial<FeatureState> = {};
      if (k === "metals") next.metals = null;
      if (k === "stocks") next.stocks = null;
      if (k === "fuel") next.fuel = null;
      if (k === "forex") next.forex = null;
      return next;
    }),
}));