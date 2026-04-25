import { ArrowDown, ArrowUp } from "lucide-react";
import { marketPrices } from "@/data/marketplace";
import { OfflineNotice } from "@/components/OfflineNotice";

const MarketPrices = () => (
  <section className="animate-gentle-rise">
    <OfflineNotice />
    <header className="mb-5">
      <h1 className="text-4xl font-black">Market Prices</h1>
      <p className="mt-2 text-xl font-bold text-muted-foreground">Today near Tamale</p>
    </header>
    <div className="grid gap-4 md:grid-cols-3">
      {marketPrices.map((item) => {
        const isUp = item.change === "up";
        const Arrow = isUp ? ArrowUp : ArrowDown;
        return (
          <article key={item.crop} className="rounded-3xl border bg-card p-5 shadow-touch">
            <div className="flex items-center justify-between">
              <span className="text-6xl" aria-hidden="true">{item.icon}</span>
              <span className={`grid size-14 place-items-center rounded-full ${isUp ? "bg-surface-leaf text-success" : "bg-earth-soft text-secondary"}`}>
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
  </section>
);

export default MarketPrices;
