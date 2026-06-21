import { describe, it, expect, beforeEach } from "vitest";
import { getCache, setCache, invalidateCache, invalidateAll, getCacheStats } from "@/lib/cache";

describe("Cache", () => {
  beforeEach(() => {
    invalidateAll();
  });

  it("stores and retrieves data", () => {
    setCache(["test", "key"], { value: 42 }, 60000);
    const cached = getCache<{ value: number }>(["test", "key"]);
    expect(cached?.data.value).toBe(42);
    expect(cached?.cached).toBe(false);
  });

  it("returns undefined for expired entries", () => {
    setCache(["expired"], { value: 1 }, -1);
    const cached = getCache(["expired"]);
    expect(cached).toBeUndefined();
  });

  it("invalidates by pattern", () => {
    setCache(["metals", "IN", "2024-01-01"], { a: 1 }, 60000);
    setCache(["stocks", "2024-01-01"], { b: 2 }, 60000);
    invalidateCache("metals");
    expect(getCache(["metals", "IN", "2024-01-01"])).toBeUndefined();
    expect(getCache(["stocks", "2024-01-01"])).toBeDefined();
  });

  it("tracks stats", () => {
    setCache(["a"], 1, 60000);
    setCache(["b"], 2, 60000);
    const stats = getCacheStats();
    expect(stats.size).toBe(2);
    expect(stats.keys).toContain("a");
  });
});