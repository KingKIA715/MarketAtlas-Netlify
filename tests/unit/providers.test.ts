import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMetalprice } from "@/lib/providers/metalprice";
import { fetchFrankfurter } from "@/lib/providers/frankfurter";
import { getCache, invalidateAll } from "@/lib/cache";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Provider Fallbacks", () => {
  beforeEach(() => {
    invalidateAll();
    mockFetch.mockClear();
  });

  it("MetalpriceAPI returns parsed metal data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rates: { XAU: 0.0005, XAG: 0.012, XPT: 0.001 },
        base: "USD",
        date: "2024-01-01",
      }),
    });

    const result = await fetchMetalprice("test-key", "USD");
    expect(result).not.toBeNull();
    expect(result?.source).toBe("metalprice");
    expect(result?.data.gold.gram).toBeGreaterThan(0);
    expect(result?.data.silver.kg).toBeGreaterThan(0);
  });

  it("MetalpriceAPI falls back to cache on timeout", async () => {
    mockFetch.mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 6000)));

    const result = await fetchMetalprice("test-key", "USD");
    expect(result).toBeNull();
  });

  it("Frankfurter returns forex data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rates: { USD: 1.08, GBP: 0.85, INR: 90.5 },
        base: "EUR",
      }),
    });

    const result = await fetchFrankfurter("EUR");
    expect(result).not.toBeNull();
    expect(result?.source).toBe("frankfurter");
    expect(result?.data.rates.USD).toBe(1.08);
  });

  it("Frankfurter returns null on 500", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });
    const result = await fetchFrankfurter("EUR");
    expect(result).toBeNull();
  });

  it("uses cached data when available", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rates: { XAU: 0.0005, XAG: 0.012, XPT: 0.001 },
        base: "USD",
        date: "2024-01-01",
      }),
    });

    await fetchMetalprice("test-key", "USD");
    const second = await fetchMetalprice("test-key", "USD");
    expect(second?.source).toContain("cache");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});