"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Country, Currency, GlobalState } from "@/types";
import { COUNTRIES } from "@/lib/constants";

type GlobalActions = {
  setCountry: (c: Country) => void;
  setCurrency: (c: Currency) => void;
  setTimezone: (tz: string) => void;
};

export const useGlobalStore = create<GlobalState & GlobalActions>()(
  persist(
    (set, get) => ({
      country: "IN",
      currency: "INR",
      timezone: "Asia/Kolkata",
      setCountry: (c) => {
        const country = COUNTRIES.find((x) => x.code === c);
        if (!country) return;
        set({ country: c, currency: country.currency as Currency, timezone: country.timezone });
        // Trigger module cache invalidation via event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("countrychange", { detail: { from: get().country, to: c } }));
        }
      },
      setCurrency: (c) => set({ currency: c }),
      setTimezone: (tz) => set({ timezone: tz }),
    }),
    { name: "ma-global" }
  )
);