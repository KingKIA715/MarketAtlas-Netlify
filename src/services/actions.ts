"use server";

import { z } from "zod";
import { getMetals, getStocks, getFuel, getForex } from "@/lib/router";
import type { MetalData, StockData, FuelData, ForexData } from "@/types";

const countrySchema = z.enum(["IN", "US", "GB", "AE", "SG"]);
const currencySchema = z.enum(["INR", "USD", "EUR", "GBP", "AED", "SGD"]);

export async function getMetalsAction(country: string, currency: string): Promise<MetalData> {
  const c = countrySchema.parse(country);
  const cur = currencySchema.parse(currency);
  const result = await getMetals(c, cur);
  return result.data;
}

export async function getStocksAction(): Promise<StockData> {
  const result = await getStocks();
  return result.data;
}

export async function getFuelAction(country: string): Promise<FuelData> {
  const c = countrySchema.parse(country);
  const result = await getFuel(c);
  return result.data;
}

export async function getForexAction(currency: string): Promise<ForexData> {
  const cur = currencySchema.parse(currency);
  const result = await getForex(cur);
  return result.data;
}