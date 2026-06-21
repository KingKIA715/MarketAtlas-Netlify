import { Header } from "@/components/Header";
import { CountrySwitcher } from "@/components/CountrySwitcher";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { Dashboard } from "@/components/Dashboard";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="flex justify-end gap-3">
          <CountrySwitcher />
          <CurrencySwitcher />
        </div>
      </div>
      <Dashboard />
    </>
  );
}