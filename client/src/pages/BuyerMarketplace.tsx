import { Search } from "lucide-react";
import { ProduceCard } from "@/components/ProduceCard";
import { OfflineNotice } from "@/components/OfflineNotice";
import { cropOptions, produceListings } from "@/data/marketplace";

const BuyerMarketplace = () => (
  <section className="animate-gentle-rise">
    <OfflineNotice />
    <header className="mb-5">
      <h1 className="text-4xl font-black">Buy Produce</h1>
      <p className="mt-2 text-xl font-bold text-muted-foreground">Call or WhatsApp farmers</p>
    </header>

    <div className="mb-5 grid gap-3 rounded-3xl border bg-card p-4 shadow-touch md:grid-cols-2">
      <label className="grid gap-2 text-lg font-black">
        🌾 Crop
        <select className="min-h-14 rounded-2xl border bg-background px-4 text-lg font-bold">
          <option>All crops</option>
          {cropOptions.map((crop) => <option key={crop.value}>{crop.icon} {crop.label}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-lg font-black">
        💰 Price
        <select className="min-h-14 rounded-2xl border bg-background px-4 text-lg font-bold">
          <option>Any price</option>
          <option>Low price</option>
          <option>High quantity</option>
        </select>
      </label>
    </div>

    {produceListings.length < 1 ? (
      <div className="grid min-h-64 place-items-center rounded-3xl border bg-card p-8 text-center shadow-touch">
        <Search className="mb-3 size-12 text-muted-foreground" />
        <p className="text-2xl font-black">No produce available yet</p>
      </div>
    ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {produceListings.map((item) => <ProduceCard key={item.id} {...item} />)}
      </div>
    )}
  </section>
);

export default BuyerMarketplace;
