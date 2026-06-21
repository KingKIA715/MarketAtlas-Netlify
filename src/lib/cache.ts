import type { CacheEntry } from "@/types";

const memoryCache = new Map<string, CacheEntry<unknown>>();

function key(parts: string[]) {
  return parts.join(":");
}

export function getCache<T>(parts: string[]): CacheEntry<T> | undefined {
  const k = key(parts);
  const entry = memoryCache.get(k) as CacheEntry<T> | undefined;
  if (!entry) return undefined;
  const now = Date.now();
  if (now > entry.ttl) {
    memoryCache.delete(k);
    return undefined;
  }
  return { ...entry, stale: now > entry.ttl - 60000 };
}

export function setCache<T>(parts: string[], data: T, ttlMs: number): void {
  const k = key(parts);
  memoryCache.set(k, {
    data,
    ttl: Date.now() + ttlMs,
    stale: false,
    createdAt: Date.now(),
  });
}

export function invalidateCache(pattern: string) {
  for (const k of memoryCache.keys()) {
    if (k.includes(pattern)) memoryCache.delete(k);
  }
}

export function invalidateAll() {
  memoryCache.clear();
}

export function getCacheStats() {
  return { size: memoryCache.size, keys: Array.from(memoryCache.keys()) };
}