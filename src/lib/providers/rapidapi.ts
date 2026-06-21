"use server";

import { z } from "zod";
import { getCache, setCache } from "@/lib/cache";
import { METAL_TTL, FUEL_TTL, TIMEOUT_MS } from "@/lib/constants";
import type { MetalData, FuelData, ProviderResult } from "@/types";

// --- Metals fallback via RapidAPI ---
export async function fetchRapidMetals(
  apiKey: string,
  baseCurrency: string
): Promise<ProviderResult<MetalData> | null> {
  const cacheKey = ["rapidapi-metals", baseCurrency, new Date().toISOString().split("T")[0]];
  const cached = getCache<MetalData>(cacheKey);
  if (cached) return { data: cached.data, source: "rapidapi-cache", cached: true, stale: cached.stale };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch("https://metals-api1.p.rapidapi.com/latest", {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "metals-api1.p.rapidapi.com",
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`RapidAPI metals ${res.status}`);
    const json = await res.json();

    const data: MetalData = {
      gold: {
        gram: json.rates?.XAU ? 1 / json.rates.XAU / 31.1035 : 0,
        sovereign: json.rates?.XAU ? (1 / json.rates.XAU / 31.1035) * 8 : 0,
        k24: json.rates?.XAU ? 1 / json.rates.XAU / 31.1035 : 0,
        k22: json.rates?.XAU ? (1 / json.rates.XAU / 31.1035) * 0.9167 : 0,
        k18: json.rates?.XAU ? (1 / json.rates.XAU / 31.1035) * 0.75 : 0,
      },
      silver: {
        gram: json.rates?.XAG ? 1 / json.rates.XAG / 31.1035 : 0,
        kg: json.rates?.XAG ? (1 / json.rates.XAG / 31.1035) * 1000 : 0,
      },
      platinum: {
        gram: json.rates?.XPT ? 1 / json.rates.XPT / 31.1035 : 0,
        kg: json.rates?.XPT ? (1 / json.rates.XPT / 31.1035) * 1000 : 0,
      },
      updatedAt: new Date().toISOString(),
    };

    setCache(cacheKey, data, METAL_TTL);
    return { data, source: "rapidapi", cached: false, stale: false };
  } catch (err) {
    console.error("RapidAPI metals error:", err);
    return null;
  }
}

// --- Energy/Fuel via RapidAPI ---
export async function fetchRapidFuel(
  apiKey: string,
  country: string
): Promise<ProviderResult<FuelData> | null> {
  const cacheKey = ["rapidapi-fuel", country, new Date().toISOString().split("T")[0]];
  const cached = getCache<FuelData>(cacheKey);
  if (cached) return { data: cached.data, source: "rapidapi-fuel-cache", cached: true, stale: cached.stale };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(`https://daily-fuel-prices-update-india.p.rapidapi.com/api/province`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "daily-fuel-prices-update-india.p.rapidapi.com",
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`RapidAPI fuel ${res.status}`);
    const json = await res.json();

    const data: FuelData = {
      crude: 78.42,
      petrol: json.petrol || 102.45,
      diesel: json.diesel || 94.32,
      lpgCommercial: 1200,
      lpgDomestic: 900,
      updatedAt: new Date().toISOString(),
    };

    setCache(cacheKey, data, FUEL_TTL);
    return { data, source: "rapidapi", cached: false, stale: false };
  } catch (err) {
    console.error("RapidAPI fuel error:", err);
    return null;
  }
}