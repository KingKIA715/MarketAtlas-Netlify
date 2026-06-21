import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (v: number, currency: string, locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(v);

export const formatNumber = (v: number, digits = 2) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(v);

export const formatPercent = (v: number) =>
  `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

export const nowKey = () => new Date().toISOString().split("T")[0];