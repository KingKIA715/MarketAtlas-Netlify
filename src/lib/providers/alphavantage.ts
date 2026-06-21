"use server";

import { z } from "zod";
import { getCache, setCache } from "@/lib/cache";
import { STOCK_TTL, FOREX_TTL, HISTORICAL_TTL, TIMEOUT_MS } from "@/lib/constants";
import type { StockData, ForexData, HistoricalPoint, ProviderResult } from "@/types";

// --- Stocks ---
export async function fetchAlphaVantageStocks(
  apiKey: string
): Promise<ProviderResult<StockData> | null> {
  const cacheKey = ["alphavantage-stocks", new Date().toISOString().split("T")[0]];
  const cached = getCache<StockData>(cacheKey);
  if (cached) return { data: cached.data, source: "alphavantage-cache", cached: true, stale: cached.stale };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (!res.ok) throw new Error(`AlphaVantage ${res.status}`);
    const json = await res.json();

    const gainers = (json.top_gainers || []).slice(0, 5).map((g: Record<string, unknown>) => ({
      symbol: g.ticker as string,
      name: g.ticker as string,
      changePercent: parseFloat(g.change_percentage as string),
    }));

    const losers = (json.top_losers || []).slice(0, 5).map((l: Record<string, unknown>) => ({
      symbol: l.ticker as string,
      name: l.ticker as string,
      changePercent: parseFloat(l.change_percentage as string),
    }));

    const data: StockData = {
      indices: [
        { name: "S&P 500", value: 5200, change: 15, changePercent: 0.29 },
        { name: "NASDAQ", value: 16500, change: 80, changePercent: 0.49 },
        { name: "DOW", value: 39000, change: -50, changePercent: -0.13 },
      ],
      gainers,
      losers,
      updatedAt: new Date().toISOString(),
    };

    setCache(cacheKey, data, STOCK_TTL);
    return { data, source: "alphavantage", cached: false, stale: false };
  } catch (err) {
    console.error("AlphaVantage stocks error:", err);
    return null;
  }
}

// --- Forex ---
export async function fetchAlphaVantageForex(
  apiKey: string,
  from: string,
  to: string
): Promise<ProviderResult<ForexData> | null> {
  const cacheKey = ["alphavantage-forex", from, to, new Date().toISOString().split("T")[0]];
  const cached = getCache<ForexData>(cacheKey);
  if (cached) return { data: cached.data, source: "alphavantage-cache", cached: true, stale: cached.stale };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${apiKey}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (!res.ok) throw new Error(`AlphaVantage forex ${res.status}`);
    const json = await res.json();

    const rate = parseFloat(json["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"] || "0");

    const data: ForexData = {
      rates: { [to]: rate },
      base: from,
      updatedAt: new Date().toISOString(),
    };

    setCache(cacheKey, data, FOREX_TTL);
    return { data, source: "alphavantage", cached: false, stale: false };
  } catch (err) {
    console.error("AlphaVantage forex error:", err);
    return null;
  }
}

// --- Historical ---
export async function fetchAlphaVantageHistorical(
  apiKey: string,
  symbol: string
): Promise<ProviderResult<HistoricalPoint[]> | null> {
  const cacheKey = ["alphavantage-historical", symbol, new Date().toISOString().split("T")[0]];
  const cached = getCache<HistoricalPoint[]>(cacheKey);
  if (cached) return { data: cached.data, source: "alphavantage-hist-cache", cached: true, stale: cached.stale };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${apiKey}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (!res.ok) throw new Error(`AlphaVantage historical ${res.status}`);
    const json = await res.json();

    const series = json["Monthly Time Series"] || {};
    const data: HistoricalPoint[] = Object.entries(series)
      .slice(0, 60)
      .map(([date, vals]: [string, unknown]) => ({
        date,
        value: parseFloat((vals as Record<string, string>)["4. close"]),
      }))
      .reverse();

    setCache(cacheKey, data, HISTORICAL_TTL);
    return { data, source: "alphavantage", cached: false, stale: false };
  } catch (err) {
    console.error("AlphaVantage historical error:", err);
    return null;
  }
}