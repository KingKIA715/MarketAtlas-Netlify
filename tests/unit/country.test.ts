import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountry } from "@/hooks/useCountry";
import { useGlobalStore } from "@/stores/global";
import { useFeatureStore } from "@/stores/feature";

describe("Country Switch", () => {
  it("invalidates all modules on country change", () => {
    const { result } = renderHook(() => useCountry());

    // Set initial state
    act(() => {
      useGlobalStore.getState().setCountry("IN");
      useFeatureStore.getState().setMetals({ gold: { gram: 1, sovereign: 8, k24: 1, k22: 0.9, k18: 0.75 }, silver: { gram: 0.5, kg: 500 }, platinum: { gram: 2, kg: 2000 }, updatedAt: "" });
    });

    expect(useFeatureStore.getState().metals).not.toBeNull();

    // Switch country
    act(() => {
      result.current.updateCountry("US");
    });

    expect(useGlobalStore.getState().country).toBe("US");
    expect(useGlobalStore.getState().currency).toBe("USD");
    expect(useFeatureStore.getState().metals).toBeNull();
    expect(useFeatureStore.getState().stocks).toBeNull();
    expect(useFeatureStore.getState().fuel).toBeNull();
    expect(useFeatureStore.getState().forex).toBeNull();
  });

  it("does not invalidate on same country", () => {
    const { result } = renderHook(() => useCountry());

    act(() => {
      useGlobalStore.getState().setCountry("IN");
      useFeatureStore.getState().setMetals({ gold: { gram: 1, sovereign: 8, k24: 1, k22: 0.9, k18: 0.75 }, silver: { gram: 0.5, kg: 500 }, platinum: { gram: 2, kg: 2000 }, updatedAt: "" });
    });

    const invalidateSpy = vi.spyOn(useFeatureStore.getState(), "invalidateModule");

    act(() => {
      result.current.updateCountry("IN");
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});