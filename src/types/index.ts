export type Country = "IN" | "US" | "GB" | "AE" | "SG";
export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD";

export interface GlobalState {
  country: Country;
  currency: Currency;
  timezone: string;
}

export interface MetalData {
  gold: { gram: number; sovereign: number; k24: number; k22: number; k18: number };
  silver: { gram: number; kg: number };
  platinum: { gram: number; kg: number };
  updatedAt: string;
}

export interface StockData {
  indices: Array<{ name: string; value: number; change: number; changePercent: number }>;
  gainers: Array<{ symbol: string; name: string; changePercent: number }>;
  losers: Array<{ symbol: string; name: string; changePercent: number }>;
  updatedAt: string;
}

export interface FuelData {
  crude: number;
  petrol: number;
  diesel: number;
  lpgCommercial: number;
  lpgDomestic: number;
  updatedAt: string;
}

export interface ForexData {
  rates: Record<string, number>;
  base: string;
  updatedAt: string;
}

export interface HistoricalPoint {
  date: string;
  value: number;
}

export type ModuleKey = "metals" | "stocks" | "fuel" | "forex";

export interface CacheEntry<T> {
  data: T;
  ttl: number;
  stale: boolean;
  createdAt: number;
}

export interface ProviderResult<T> {
  data: T;
  source: string;
  cached: boolean;
  stale: boolean;
}