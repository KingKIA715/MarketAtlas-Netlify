import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMetals, getStocks, getForex, getFuel } from "@/lib/router";
import { invalidateAll } from "@/lib/cache";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Provider Router", () => {
  beforeEach(() => {
    invalidateAll();
    mockFetch.mockClear();
    vi.stubEnv("METALPRICE_API_KEY", "mp-key");
    vi.stubEnv("RAPIDAPI_KEY", "ra-key");
    vi.stubEnv("ALPHAVANTAGE_API_KEY", "av-key");
  });

  it("getMetals uses primary then fallback", async () => {
    // Primary fails
    mockFetch.mockRejectedValueOnce(new Error("Primary down"));
    // Fallback succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rates: { XAU: 0.0005, XAG: 0.012, XPT: 0.001 },
        base: "USD",
        date: "2024-01-01",
      }),
    });

    const result = await getMetals("IN", "USD");
    expect(result.source).toBe("rapidapi");
    expect(result.data.gold.gram).toBeGreaterThan(0);
  });

  it("getMetals throws when all fail and no cache", async () => {
    mockFetch.mockRejectedValue(new Error("All down"));
    await expect(getMetals("IN", "USD")).rejects.toThrow("All metals providers failed");
  });

  it("getStocks returns data from AlphaVantage", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        top_gainers: [
          { ticker: "AAPL", change_percentage: "5.2%" },
          { ticker: "TSLA", change_percentage: "3.8%" },
        ],
        top_losers: [
          { ticker: "META", change_percentage: "-2.1%" },
        ],
      }),
    });

    const result = await getStocks();
    expect(result.source).toBe("alphavantage");
    expect(result.data.gainers.length).toBe(2);
    expect(result.data.losers.length).toBe(1);
  });

  it("getForex prefers Frankfurter over AlphaVantage", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rates: { USD: 1.08, GBP: 0.85 },
        base: "EUR",
      }),
    });

    const result = await getForex("EUR");
    expect(result.source).toBe("frankfurter");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("getFuel uses RapidAPI", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ petrol: 102.45, diesel: 94.32 }),
    });

    const result = await getFuel("IN");
    expect(result.source).toBe("rapidapi");
    expect(result.data.petrol).toBe(102.45);
  });
});