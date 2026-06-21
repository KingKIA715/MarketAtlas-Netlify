"use server";

import { z } from "zod";
import { getCache, setCache } from "@/lib/cache";
import { METAL_TTL, TIMEOUT_MS } from "@/lib/constants";
import type { MetalData, ProviderResult } from "@/types";

const metalSchema = z.object({
  rates: z.record(z.number()),
  base: z.string(),
  date: z.string(),
});

const RATE_MAP: Record<string, string> = {
  XAU: "gold", XAG: "silver", XPT: "platinum",
};

export async function fetchMetalprice(
  apiKey: string,
  baseCurrency: string
): Promise<ProviderResult<MetalData> | null> {
  const cacheKey = ["metalprice", baseCurrency, new Date().toISOString().split("T")[0]];
  const cached = getCache<MetalData>(cacheKey);
  if (cached) return { data: cached.data, source: "metalprice-cache", cached: true, stale: cached.stale };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(
      `https://metalpriceapi.com/v1/latest?api_key=${apiKey}&base=${baseCurrency}&currency=${baseCurrency}`,
      { signal: controller.signal, next: { revalidate: 0 } }
    );
    clearTimeout(timer);

    if (!res.ok) throw new Error(`MetalpriceAPI ${res.status}`);
    const json = await res.json();
    const parsed = metalSchema.parse(json);

    const data: MetalData = {
      gold: {
        gram: parsed.rates.XAU ? 1 / parsed.rates.XAU / 31.1035 : 0,
        sovereign: parsed.rates.XAU ? (1 / parsed.rates.XAU / 31.1035) * 8 : 0,
        k24: parsed.rates.XAU ? 1 / parsed.rates.XAU / 31.1035 : 0,
        k22: parsed.rates.XAU ? (1 / parsed.rates.XAU / 31.1035) * 0.9167 : 0,
        k18: parsed.rates.XAU ? (1 / parsed.rates.XAU / 31.1035) * 0.75 : 0,
      },
      silver: {
        gram: parsed.rates.XAG ? 1 / parsed.rates.XAG / 31.1035 : 0,
        kg: parsed.rates.XAG ? (1 / parsed.rates.XAG / 31.1035) * 1000 : 0,
      },
      platinum: {
        gram: parsed.rates.XPT ? 1 / parsed.rates.XPT / 31.1035 : 0,
        kg: parsed.rates.XPT ? (1 / parsed.rates.XPT / 31.1035) * 1000 : 0,
      },
      updatedAt: new Date().toISOString(),
    };

    setCache(cacheKey, data, METAL_TTL);
    return { data, source: "metalprice", cached: false, stale: false };
  } catch (err) {
    console.error("MetalpriceAPI error:", err);
    return null;
  }
}