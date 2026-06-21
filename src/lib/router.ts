"use server";

import {
  fetchMetalprice,
  fetchRapidMetals,
  fetchRapidFuel,
  fetchAlphaVantageStocks,
  fetchAlphaVantageForex,
  fetchFrankfurter,
} from "./providers";
import { getCache } from "./cache";
import type { MetalData, StockData, FuelData, ForexData, ProviderResult } from "@/types";

// --- Metals Router ---
export async function getMetals(
  country: string,
  currency: string
): Promise<ProviderResult<MetalData>> {
  const cacheKey = ["metals", country, currency, new Date().toISOString().split("T")[0]];
  const stale = getCache<MetalData>(cacheKey);

  const metalKey = process.env.METALPRICE_API_KEY || "";
  const rapidKey = process.env.RAPIDAPI_KEY || "";

  // Primary: MetalpriceAPI
  const primary = await fetchMetalprice(metalKey, currency);
  if (primary) return primary;

  // Fallback: RapidAPI
  const fallback = await fetchRapidMetals(rapidKey, currency);
  if (fallback) return fallback;

  // Stale cache
  if (stale) return { data: stale.data, source: "stale-cache", cached: true, stale: true };

  // Dead end
  throw new Error("All metals providers failed. No cached data available.");
}

// --- Stocks Router ---
export async function getStocks(): Promise<ProviderResult<StockData>> {
  const cacheKey = ["stocks", new Date().toISOString().split("T")[0]];
  const stale = getCache<StockData>(cacheKey);

  const alphaKey = process.env.ALPHAVANTAGE_API_KEY || "";

  const primary = await fetchAlphaVantageStocks(alphaKey);
  if (primary) return primary;

  if (stale) return { data: stale.data, source: "stale-cache", cached: true, stale: true };

  throw new Error("All stocks providers failed. No cached data available.");
}

// --- Fuel Router ---
export async function getFuel(country: string): Promise<ProviderResult<FuelData>> {
  const cacheKey = ["fuel", country, new Date().toISOString().split("T")[0]];
  const stale = getCache<FuelData>(cacheKey);

  const rapidKey = process.env.RAPIDAPI_KEY || "";

  const primary = await fetchRapidFuel(rapidKey, country);
  if (primary) return primary;

  if (stale) return { data: stale.data, source: "stale-cache", cached: true, stale: true };

  throw new Error("All fuel providers failed. No cached data available.");
}

// --- Forex Router ---
export async function getForex(
  baseCurrency: string
): Promise<ProviderResult<ForexData>> {
  const cacheKey = ["forex", baseCurrency, new Date().toISOString().split("T")[0]];
  const stale = getCache<ForexData>(cacheKey);

  const alphaKey = process.env.ALPHAVANTAGE_API_KEY || "";

  // Primary: Frankfurter (free, no key, no rate limit)
  const primary = await fetchFrankfurter(baseCurrency);
  if (primary) return primary;

  // Fallback: AlphaVantage
  const fallback = await fetchAlphaVantageForex(alphaKey, baseCurrency, "USD");
  if (fallback) return fallback;

  if (stale) return { data: stale.data, source: "stale-cache", cached: true, stale: true };

  throw new Error("All forex providers failed. No cached data available.");
}