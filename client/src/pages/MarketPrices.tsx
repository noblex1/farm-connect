import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toPriceCard } from "@/lib/marketMappers";
import { fetchMarketPrices } from "@/services/marketApi";
import { OfflineNotice } from "@/components/OfflineNotice";

const MarketPrices = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["market-prices"],
    queryFn: fetchMarketPrices,
    retry: 1,
  });

  const items = useMemo(() => (data?.data || []).map(toPriceCard), [data]);

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <header className="mb-5">
        <h1 className="text-4xl font-black">Market Prices</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Today near Tamale</p>
      </header>
      {isLoading ? (
        <div className="grid min-h-64 place-items-center rounded-3xl border bg-card p-8 text-center shadow-touch">
          <p className="text-xl font-black">Loading market prices...</p>
        </div>
      ) : isError ? (
        <div className="grid min-h-64 place-items-center rounded-3xl border border-destructive bg-card p-8 text-center shadow-touch">
          <p className="text-xl font-black text-destructive">{error instanceof Error ? error.message : "Could not load market prices"}</p>
        </div>
      ) : items.length < 1 ? (
        <div className="grid min-h-64 place-items-center rounded-3xl border bg-card p-8 text-center shadow-touch">
          <p className="text-xl font-black">No market prices available yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => {
            const isUp = item.change === "up";
            const Arrow = isUp ? ArrowUp : ArrowDown;
            return (
              <article key={item.crop} className="rounded-3xl border bg-card p-5 shadow-touch">
                <div className="flex items-center justify-between">
                  <span className="text-6xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span
                    className={`grid size-14 place-items-center rounded-full ${
                      isUp ? "bg-surface-leaf text-success" : "bg-earth-soft text-secondary"
                    }`}
                  >
                    <Arrow className="size-8" aria-hidden="true" />
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-black">{item.crop}</h2>
                <p className="mt-2 text-4xl font-black text-primary">{item.price}</p>
                <p className="mt-1 text-lg font-bold text-muted-foreground">per {item.unit}</p>
                <p className="mt-4 inline-flex rounded-full bg-surface-warm px-4 py-2 text-lg font-black">{item.note}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MarketPrices;
