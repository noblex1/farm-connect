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
      <header className="mb-4 sm:mb-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">Marketplace</h1>
        <p className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl font-bold text-muted-foreground">Fresh farm produce available now — call or WhatsApp farmers</p>
      </header>

      {/* Filters Section */}
      <div className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl border bg-card p-3 sm:p-4 md:p-5 shadow-touch">
        <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="size-4 sm:size-5 text-muted-foreground" />
            <h2 className="text-base sm:text-lg md:text-xl font-black">Filters</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs sm:text-sm font-bold h-8 sm:h-9"
            >
              <X className="mr-1 size-3 sm:size-4" />
              <span className="hidden xs:inline">Clear all</span>
              <span className="xs:hidden">Clear</span>
            </Button>
          )}
        </div>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1.5 sm:gap-2 text-sm sm:text-base font-bold">
            Crop Type
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="min-h-11 sm:min-h-12 rounded-xl border bg-background px-3 text-sm sm:text-base font-semibold transition focus:ring-2 focus:ring-primary"
            >
              <option value="">All crops</option>
              {cropOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5 sm:gap-2 text-sm sm:text-base font-bold">
            Location
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Tamale"
              className="min-h-11 sm:min-h-12 rounded-xl border bg-background px-3 text-sm sm:text-base font-semibold transition placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="grid gap-1.5 sm:gap-2 text-sm sm:text-base font-bold">
            Min Price (GH₵)
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="10"
              className="min-h-11 sm:min-h-12 rounded-xl border bg-background px-3 text-sm sm:text-base font-semibold transition placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="grid gap-1.5 sm:gap-2 text-sm sm:text-base font-bold">
            Max Price (GH₵)
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              min="0"
              step="10"
              className="min-h-11 sm:min-h-12 rounded-xl border bg-background px-3 text-sm sm:text-base font-semibold transition placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            {crop && (
              <Badge variant="default" className="gap-1 px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
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
              <Badge variant="default" className="gap-1 px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
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
              <Badge variant="default" className="gap-1 px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
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
              <Badge variant="default" className="gap-1 px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
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
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <p className="text-sm sm:text-base md:text-lg font-bold text-muted-foreground">
            {data?.pagination.total || 0} {data?.pagination.total === 1 ? "listing" : "listings"} found
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid min-h-48 sm:min-h-64 place-items-center rounded-2xl sm:rounded-3xl border bg-card p-6 sm:p-8 text-center shadow-touch">
          <p className="text-lg sm:text-xl font-black">Loading listings...</p>
        </div>
      ) : isError ? (
        <div className="grid min-h-48 sm:min-h-64 place-items-center rounded-2xl sm:rounded-3xl border border-destructive bg-card p-6 sm:p-8 text-center shadow-touch">
          <p className="text-base sm:text-lg md:text-xl font-black text-destructive">{error instanceof Error ? error.message : "Could not load listings"}</p>
        </div>
      ) : items.length < 1 ? (
        <div className="grid min-h-48 sm:min-h-64 place-items-center rounded-2xl sm:rounded-3xl border bg-card p-6 sm:p-8 text-center shadow-touch">
          <Search className="mb-3 size-10 sm:size-12 text-muted-foreground" />
          <p className="text-lg sm:text-xl md:text-2xl font-black">No produce available yet</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ProduceCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BuyerMarketplace;
