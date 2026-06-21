"use client";

import { ErrorState } from "@/components/shared/ErrorState";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-20">
      <ErrorState message={error.message} onRetry={reset} />
    </div>
  );
}