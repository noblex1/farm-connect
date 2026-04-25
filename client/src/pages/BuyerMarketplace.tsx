import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProduceCard } from "@/components/ProduceCard";
import { OfflineNotice } from "@/components/OfflineNotice";
import { cropOptions } from "@/constants/crops";
import { toProduceCard } from "@/lib/marketMappers";
import { fetchListings } from "@/services/marketApi";

const BuyerMarketplace = () => {
  const [crop, setCrop] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["listings", crop],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (crop) {
        params.set("cropType", crop);
      }
      params.set("limit", "24");

      return fetchListings(params);
    },
    retry: 1,
  });

  const items = useMemo(() => (data?.data || []).map(toProduceCard), [data]);

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <header className="mb-5">
        <h1 className="text-4xl font-black">Buy Produce</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Call or WhatsApp farmers</p>
      </header>

      <div className="mb-5 grid gap-3 rounded-3xl border bg-card p-4 shadow-touch md:grid-cols-2">
        <label className="grid gap-2 text-lg font-black">
          Crop
          <select
            value={crop}
            onChange={(event) => setCrop(event.target.value)}
            className="min-h-14 rounded-2xl border bg-background px-4 text-lg font-bold"
          >
            <option value="">All crops</option>
            {cropOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-2 text-lg font-black">
          Data Source
          <div className="min-h-14 rounded-2xl border bg-background px-4 py-4 text-lg font-bold">
            Live API
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid min-h-64 place-items-center rounded-3xl border bg-card p-8 text-center shadow-touch">
          <p className="text-xl font-black">Loading listings...</p>
        </div>
      ) : isError ? (
        <div className="grid min-h-64 place-items-center rounded-3xl border border-destructive bg-card p-8 text-center shadow-touch">
          <p className="text-xl font-black text-destructive">{error instanceof Error ? error.message : "Could not load listings"}</p>
        </div>
      ) : items.length < 1 ? (
        <div className="grid min-h-64 place-items-center rounded-3xl border bg-card p-8 text-center shadow-touch">
          <Search className="mb-3 size-12 text-muted-foreground" />
          <p className="text-2xl font-black">No produce available yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ProduceCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BuyerMarketplace;
