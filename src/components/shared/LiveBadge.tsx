"use client";

import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  timestamp?: string;
  className?: string;
}

export function LiveBadge({ timestamp, className }: LiveBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-medium text-emerald-400">LIVE</span>
      {timestamp && <span className="text-xs text-slate-500">{new Date(timestamp).toLocaleTimeString()}</span>}
    </div>
  );
}