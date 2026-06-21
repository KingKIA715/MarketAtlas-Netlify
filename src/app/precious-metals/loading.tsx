import { Skeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-20">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}