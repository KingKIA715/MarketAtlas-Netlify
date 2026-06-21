"use client";

import { useCallback, useEffect } from "react";
import useSWR from "swr";
import { useGlobalStore } from "@/stores/global";
import { useFeatureStore } from "@/stores/feature";
import type { ModuleKey } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const TTL_MAP: Record<ModuleKey, number> = {
  metals: 30 * 60 * 1000,
  stocks: 15 * 60 * 1000,
  forex: 5 * 60 * 1000,
  fuel: 60 * 60 * 1000,
};

export function useModuleData<T>(module: ModuleKey, endpoint: string) {
  const country = useGlobalStore((s) => s.country);
  const currency = useGlobalStore((s) => s.currency);
  const key = `${endpoint}?country=${country}&currency=${currency}`;

  const setLoading = useFeatureStore((s) => s.setLoading);
  const setError = useFeatureStore((s) => s.setError);

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    refreshInterval: 0,
    dedupingInterval: TTL_MAP[module],
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    keepPreviousData: true,
    onError: (err) => setError(module, err.message),
    onSuccess: () => setError(module, null),
  });

  useEffect(() => {
    setLoading(module, isLoading);
  }, [isLoading, module, setLoading]);

  const refresh = useCallback(() => mutate(), [mutate]);

  return { data: data as T | undefined, error, isLoading, refresh };
}