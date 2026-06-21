"use client";

import { useCallback } from "react";
import { useGlobalStore } from "@/stores/global";
import { useFeatureStore } from "@/stores/feature";
import type { Country } from "@/types";

export function useCountry() {
  const country = useGlobalStore((s) => s.country);
  const setCountry = useGlobalStore((s) => s.setCountry);
  const invalidateModule = useFeatureStore((s) => s.invalidateModule);

  const updateCountry = useCallback(
    (c: Country) => {
      if (c === country) return;
      // Invalidate all modules before switching
      ["metals", "stocks", "fuel", "forex"].forEach((m) => invalidateModule(m));
      setCountry(c);
    },
    [country, setCountry, invalidateModule]
  );

  return { country, updateCountry };
}