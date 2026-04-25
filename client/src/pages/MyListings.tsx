import { MessageCircle, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toProduceCard } from "@/lib/marketMappers";
import { sessionStore } from "@/lib/session";
import { deleteListing, fetchMyListings, markListingSold } from "@/services/marketApi";
import { OfflineNotice } from "@/components/OfflineNotice";

const MyListings = () => {
  const token = sessionStore.getToken();

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
          status: item.status === "available" ? "Available" : "Sold",
        };
      }),
    [data]
  );

  const onMarkSold = async (id: string) => {
    if (!token) {
      return;
    }

    await markListingSold(token, id);
    await refetch();
  };

  const onDelete = async (id: string) => {
    if (!token) {
      return;
    }

    await deleteListing(token, id);
    await refetch();
  };

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <header className="mb-5">
        <h1 className="text-4xl font-black">My Listings</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Manage your produce quickly</p>
      </header>

      {!token && (
        <div className="mb-5 rounded-3xl border bg-card p-4 font-bold text-muted-foreground">Login to manage your listings.</div>
      )}

      {token && isLoading ? (
        <div className="rounded-3xl border bg-card p-8 text-center shadow-touch">
          <p className="text-2xl font-black">Loading your listings...</p>
        </div>
      ) : token && isError ? (
        <div className="rounded-3xl border border-destructive bg-card p-8 text-center shadow-touch">
          <p className="text-2xl font-black text-destructive">{error instanceof Error ? error.message : "Could not load your listings"}</p>
        </div>
      ) : token && items.length < 1 ? (
        <div className="rounded-3xl border bg-card p-8 text-center shadow-touch">
          <p className="text-6xl" aria-hidden="true">
            Listings
          </p>
          <p className="mt-3 text-2xl font-black">No produce available yet</p>
        </div>
      ) : token ? (
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-3xl border bg-card p-4 shadow-touch md:flex md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid size-20 place-items-center rounded-3xl bg-surface-leaf text-5xl" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-black">{item.crop}</h2>
                  <p className="text-xl font-black text-primary">{item.price}</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-black ${
                      item.status === "Available" ? "bg-surface-leaf text-success" : "bg-earth-soft text-secondary"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 md:mt-0">
                <Button variant="earth" size="lg" onClick={() => onMarkSold(String(item.id))}>
                  <MessageCircle className="size-5" />Mark Sold
                </Button>
                <Button variant="destructive" size="lg" onClick={() => onDelete(String(item.id))}>
                  <Trash2 className="size-5" />Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default MyListings;
