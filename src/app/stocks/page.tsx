import { Header } from "@/components/Header";
import { CountrySwitcher } from "@/components/CountrySwitcher";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { StockCard } from "@/components/modules/StockCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { getStocksAction } from "@/services/actions";
import { Suspense } from "react";

async function StocksData({ currency }: { currency: string }) {
  try {
    const data = await getStocksAction();
    return <StockCard data={data} currency={currency} />;
  } catch (err) {
    return <ErrorState message={(err as Error).message} />;
  }
}

export default function StocksPage({
  searchParams,
}: {
  searchParams: { country?: string; currency?: string };
}) {
  const currency = searchParams.currency || "INR";

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stock Market</h1>
          <div className="flex gap-3">
            <CountrySwitcher />
            <CurrencySwitcher />
          </div>
        </div>
        <Suspense fallback={<Skeleton className="h-96 w-full" count={3} />}>
          <StocksData currency={currency} />
        </Suspense>
      </div>
    </>
  );
}