import { Header } from "@/components/Header";
import { CountrySwitcher } from "@/components/CountrySwitcher";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { FXCard } from "@/components/modules/FXCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { getForexAction } from "@/services/actions";
import { Suspense } from "react";

async function ForexData({ currency }: { currency: string }) {
  try {
    const data = await getForexAction(currency);
    return <FXCard data={data} currency={currency} />;
  } catch (err) {
    return <ErrorState message={(err as Error).message} />;
  }
}

export default function CurrenciesPage({
  searchParams,
}: {
  searchParams: { country?: string; currency?: string };
}) {
  const currency = searchParams.currency || "USD";

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Currency Exchange</h1>
          <div className="flex gap-3">
            <CountrySwitcher />
            <CurrencySwitcher />
          </div>
        </div>
        <Suspense fallback={<Skeleton className="h-96 w-full" count={2} />}>
          <ForexData currency={currency} />
        </Suspense>
      </div>
    </>
  );
}