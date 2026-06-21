import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAlphaVantageHistorical } from "@/lib/providers/alphavantage";
import { invalidateAll } from "@/lib/cache";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Historical Charts", () => {
  beforeEach(() => {
    invalidateAll();
    mockFetch.mockClear();
  });

  it("fetches 5 years of monthly data", async () => {
    const monthlyData: Record<string, Record<string, string>> = {};
    const dates: string[] = [];

    // Generate 60 months of data
    for (let i = 0; i < 60; i++) {
      const d = new Date(2024, 11 - i, 1);
      const key = d.toISOString().split("T")[0];
      dates.push(key);
      monthlyData[key] = {
        "1. open": "100",
        "2. high": "110",
        "3. low": "95",
        "4. close": (100 + i * 0.5).toString(),
        "5. volume": "1000000",
      };
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ "Monthly Time Series": monthlyData }),
    });

    const result = await fetchAlphaVantageHistorical("test-key", "AAPL");
    expect(result).not.toBeNull();
    expect(result?.data.length).toBe(60);
    expect(result?.data[0].value).toBe(100);
    expect(result?.data[59].value).toBe(129.5);
    expect(result?.source).toBe("alphavantage");
  });

  it("caches historical data for 24h", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        "Monthly Time Series": {
          "2024-01-01": { "4. close": "150" },
        },
      }),
    });

    await fetchAlphaVantageHistorical("test-key", "AAPL");
    const cached = await fetchAlphaVantageHistorical("test-key", "AAPL");
    expect(cached?.source).toContain("cache");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});