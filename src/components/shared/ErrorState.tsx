"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message = "Failed to load data", onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-xl border border-red-900/30 bg-red-950/20 p-6", className)}>
      <AlertTriangle className="h-8 w-8 text-red-400" />
      <p className="text-sm text-red-300">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 rounded-lg bg-red-900/40 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-900/60">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      )}
    </div>
  );
}