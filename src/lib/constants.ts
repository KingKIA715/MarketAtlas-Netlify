export const COUNTRIES = [
  { code: "IN", name: "India", currency: "INR", timezone: "Asia/Kolkata" },
  { code: "US", name: "United States", currency: "USD", timezone: "America/New_York" },
  { code: "GB", name: "United Kingdom", currency: "GBP", timezone: "Europe/London" },
  { code: "AE", name: "UAE", currency: "AED", timezone: "Asia/Dubai" },
  { code: "SG", name: "Singapore", currency: "SGD", timezone: "Asia/Singapore" },
] as const;

export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD"] as const;

export const METAL_TTL = 30 * 60 * 1000;
export const STOCK_TTL = 15 * 60 * 1000;
export const FOREX_TTL = 5 * 60 * 1000;
export const FUEL_TTL = 60 * 60 * 1000;
export const HISTORICAL_TTL = 24 * 60 * 60 * 1000;
export const GLOBAL_TTL = 60 * 60 * 1000;

export const TIMEOUT_MS = 5000;
export const RETRY_COUNT = 1;

export const INDIA_GST = 0.03;
export const INDIA_IMPORT_CHARGE = 0.075;