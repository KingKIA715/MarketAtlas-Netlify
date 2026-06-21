"use server";

import { getCache, setCache } from "@/lib/cache";
import { FOREX_TTL, TIMEOUT_MS } from "@/lib/constants";
import type { ForexData, ProviderResult } from "@/types";

export async function fetchFrankfurter(
  baseCurrency: string
): Promise<ProviderResult<ForexData> | null> {
  const cacheKey = ["frankfurter", baseCurrency, new Date().toISOString().split("T")[0]];
  const cached = getCache<ForexData>(cacheKey);
  if (cached) return { data: cached.data, source: "frankfurter-cache", cached: true, stale: cached.stale };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${baseCurrency}&to=USD,EUR,GBP,INR,AED,SGD,JPY,CAD,AUD,CHF`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (!res.ok) throw new Error(`Frankfurter ${res.status}`);
    const json = await res.json();

    const data: ForexData = {
      rates: json.rates || {},
      base: json.base || baseCurrency,
      updatedAt: new Date().toISOString(),
    };

    setCache(cacheKey, data, FOREX_TTL);
    return { data, source: "frankfurter", cached: false, stale: false };
  } catch (err) {
    console.error("Frankfurter error:", err);
    return null;
  }
}