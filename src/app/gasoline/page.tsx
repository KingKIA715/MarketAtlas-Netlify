import { Header } from "@/components/Header";
import { CountrySwitcher } from "@/components/CountrySwitcher";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { FuelCard } from "@/components/modules/FuelCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { getFuelAction } from "@/services/actions";
import { Suspense } from "react";

async function FuelData({ country, currency }: { country: string; currency: string }) {
  try {
    const data = await getFuelAction(country);
    return <FuelCard data={data} currency={currency} />;
  } catch (err) {
    return <ErrorState message={(err as Error).message} />;
  }
}

export default function GasolinePage({
  searchParams,
}: {
  searchParams: { country?: string; currency?: string };
}) {
  const country = searchParams.country || "IN";
  const currency = searchParams.currency || "INR";

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Energy & Fuel</h1>
          <div className="flex gap-3">
            <CountrySwitcher />
            <CurrencySwitcher />
          </div>
        </div>
        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          <FuelData country={country} currency={currency} />
        </Suspense>
      </div>
    </>
  );
}