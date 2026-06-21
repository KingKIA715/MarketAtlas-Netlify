"use client";

import { useGlobalStore } from "@/stores/global";

export function useCurrency() {
  const currency = useGlobalStore((s) => s.currency);
  const setCurrency = useGlobalStore((s) => s.setCurrency);
  return { currency, setCurrency };
}