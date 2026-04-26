import { useMemo, useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProduceCard } from "@/components/ProduceCard";
import { OfflineNotice } from "@/components/OfflineNotice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cropOptions } from "@/constants/crops";
import { toProduceCard } from "@/lib/marketMappers";
import { fetchListings } from "@/services/marketApi";

const BuyerMarketplace = () => {
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["listings", crop, location, minPrice, maxPrice],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (crop) params.set("cropType", crop);
      if (location) params.set("location", location);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("limit", "24");

      return fetchListings(params);
    },
    retry: 1,
  });

  const items = useMemo(() => (data?.data || []).map(toProduceCard), [data]);

  const activeFiltersCount = [crop, location, minPrice, maxPrice].filter(Boolean).length;

  const clearFilters = () => {
    setCrop("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <header className="mb-5">
        <h1 className="text-4xl font-black">Buy Produce</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Call or WhatsApp farmers</p>
      </header>

      {/* Filters Section */}
      <div className="mb-5 rounded-3xl border bg-card p-5 shadow-touch">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-muted-foreground" />
            <h2 className="text-xl font-black">Filters</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm font-bold"
            >
              <X className="mr-1 size-4" />
              Clear all
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-2 text-base font-bold">
            Crop Type
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="min-h-12 rounded-xl border bg-background px-3 text-base font-semibold transition focus:ring-2 focus:ring-primary"
            >
              <option value="">All crops</option>
              {cropOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-base font-bold">
            Location
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Tamale, Bolgatanga"
              className="min-h-12 rounded-xl border bg-background px-3 text-base font-semibold transition placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="grid gap-2 text-base font-bold">
            Min Price (GH₵)
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="10"
              className="min-h-12 rounded-xl border bg-background px-3 text-base font-semibold transition placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="grid gap-2 text-base font-bold">
            Max Price (GH₵)
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              min="0"
              step="10"
              className="min-h-12 rounded-xl border bg-background px-3 text-base font-semibold transition placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {crop && (
              <Badge variant="default" className="gap-1 px-3 py-1">
                Crop: {cropOptions.find((c) => c.value === crop)?.label}
                <button
                  onClick={() => setCrop("")}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove crop filter"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            {location && (
              <Badge variant="default" className="gap-1 px-3 py-1">
                Location: {location}
                <button
                  onClick={() => setLocation("")}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove location filter"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            {minPrice && (
              <Badge variant="default" className="gap-1 px-3 py-1">
                Min: GH₵{minPrice}
                <button
                  onClick={() => setMinPrice("")}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove min price filter"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            {maxPrice && (
              <Badge variant="default" className="gap-1 px-3 py-1">
                Max: GH₵{maxPrice}
                <button
                  onClick={() => setMaxPrice("")}
                  className="ml-1 hover:text-destructive"
                  aria-label="Remove max price filter"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && !isError && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-bold text-muted-foreground">
            {data?.pagination.total || 0} {data?.pagination.total === 1 ? "listing" : "listings"} found
          </p>
        </div>
      )}

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
