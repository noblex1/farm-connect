import { MessageCircle, Trash2, Package } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toProduceCard } from "@/lib/marketMappers";
import { sessionStore } from "@/lib/session";
import { deleteListing, fetchMyListings, markListingSold } from "@/services/marketApi";
import { OfflineNotice } from "@/components/OfflineNotice";
import { useToast } from "@/hooks/use-toast";

const MyListings = () => {
  const token = sessionStore.getToken();
  const { toast } = useToast();

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ["my-listings", token],
    enabled: Boolean(token),
    queryFn: () => fetchMyListings(token, new URLSearchParams({ page: "1", limit: "20" })),
    retry: 1,
  });

  const items = useMemo(
    () =>
      (data?.data || []).map((item) => {
        const mapped = toProduceCard(item);
        return {
          id: item.id,
          crop: mapped.crop,
          icon: mapped.icon,
          price: mapped.price,
          quantity: mapped.quantity,
          location: mapped.location,
          images: mapped.images || [],
          status: item.status,
          createdAt: item.createdAt,
        };
      }),
    [data]
  );

  const onMarkSold = async (id: string) => {
    if (!token) return;

    try {
      await markListingSold(token, id);
      await refetch();
      toast({
        title: "Success!",
        description: "Listing marked as sold.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not mark as sold",
        variant: "destructive",
      });
    }
  };

  const onDelete = async (id: string) => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await deleteListing(token, id);
      await refetch();
      toast({
        title: "Success!",
        description: "Listing deleted successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not delete listing",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <header className="mb-4 sm:mb-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">My Produce</h1>
        <p className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl font-bold text-muted-foreground">Manage your produce quickly</p>
      </header>

      {!token && (
        <div className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl border bg-card p-3 sm:p-4 text-sm sm:text-base font-bold text-muted-foreground">
          Login to manage your listings.
        </div>
      )}

      {token && isLoading ? (
        <div className="rounded-2xl sm:rounded-3xl border bg-card p-6 sm:p-8 text-center shadow-touch">
          <p className="text-lg sm:text-xl md:text-2xl font-black">Loading your listings...</p>
        </div>
      ) : token && isError ? (
        <div className="rounded-2xl sm:rounded-3xl border border-destructive bg-card p-6 sm:p-8 text-center shadow-touch">
          <p className="text-lg sm:text-xl md:text-2xl font-black text-destructive">
            {error instanceof Error ? error.message : "Could not load your listings"}
          </p>
        </div>
      ) : token && items.length < 1 ? (
        <div className="rounded-2xl sm:rounded-3xl border bg-card p-6 sm:p-8 text-center shadow-touch">
          <Package className="mx-auto mb-3 size-12 sm:size-16 text-muted-foreground" />
          <p className="text-lg sm:text-xl md:text-2xl font-black">No produce listed yet</p>
          <p className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-muted-foreground">
            Start by posting your first produce!
          </p>
        </div>
      ) : token ? (
        <div className="grid gap-3 sm:gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl sm:rounded-3xl border bg-card shadow-touch transition hover:shadow-soft"
            >
              <div className="md:flex">
                {/* Image Section */}
                {item.images.length > 0 ? (
                  <div className="relative h-40 sm:h-48 md:h-auto md:w-48 shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.crop}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {item.status === "sold" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <Badge variant="destructive" className="text-sm sm:text-base font-black px-2 sm:px-3 py-0.5 sm:py-1">
                          SOLD
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-32 sm:h-40 items-center justify-center bg-surface-leaf md:h-auto md:w-48">
                    <span className="text-5xl sm:text-6xl" aria-hidden="true">
                      {item.icon}
                    </span>
                  </div>
                )}

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-3 sm:p-4 md:p-5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-black">{item.crop}</h2>
                        <p className="text-base sm:text-lg md:text-xl font-black text-primary">{item.price}</p>
                        <p className="text-sm sm:text-base font-semibold text-muted-foreground">
                          {item.quantity}
                        </p>
                        <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                          📍 {item.location}
                        </p>
                      </div>
                      <Badge
                        variant={item.status === "available" ? "default" : "secondary"}
                        className="shrink-0 text-xs sm:text-sm"
                      >
                        {item.status === "available" ? "Available" : "Sold"}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 sm:mt-4 grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {item.status === "available" ? (
                      <>
                        <Button
                          variant="earth"
                          size="default"
                          onClick={() => onMarkSold(String(item.id))}
                          className="font-bold h-10 sm:h-11 text-sm sm:text-base"
                        >
                          <MessageCircle className="size-4 sm:size-5" />
                          Mark Sold
                        </Button>
                        <Button
                          variant="destructive"
                          size="default"
                          onClick={() => onDelete(String(item.id))}
                          className="font-bold h-10 sm:h-11 text-sm sm:text-base"
                        >
                          <Trash2 className="size-4 sm:size-5" />
                          Delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="destructive"
                        size="default"
                        onClick={() => onDelete(String(item.id))}
                        className="col-span-full font-bold h-10 sm:h-11 text-sm sm:text-base"
                      >
                        <Trash2 className="size-4 sm:size-5" />
                        Delete Listing
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default MyListings;
