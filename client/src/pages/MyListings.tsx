import { Edit, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { myListings } from "@/data/marketplace";
import { OfflineNotice } from "@/components/OfflineNotice";

const MyListings = () => (
  <section className="animate-gentle-rise">
    <OfflineNotice />
    <header className="mb-5">
      <h1 className="text-4xl font-black">My Listings</h1>
      <p className="mt-2 text-xl font-bold text-muted-foreground">Edit, delete, or contact buyers</p>
    </header>

    {myListings.length < 1 ? (
      <div className="rounded-3xl border bg-card p-8 text-center shadow-touch">
        <p className="text-6xl" aria-hidden="true">📦</p>
        <p className="mt-3 text-2xl font-black">No produce available yet</p>
      </div>
    ) : (
      <div className="grid gap-4">
        {myListings.map((item) => (
          <article key={item.id} className="rounded-3xl border bg-card p-4 shadow-touch md:flex md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-20 place-items-center rounded-3xl bg-surface-leaf text-5xl" aria-hidden="true">{item.icon}</span>
              <div>
                <h2 className="text-2xl font-black">{item.crop}</h2>
                <p className="text-xl font-black text-primary">{item.price}</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-black ${item.status === "Available" ? "bg-surface-leaf text-success" : "bg-earth-soft text-secondary"}`}>{item.status}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 md:mt-0">
              <Button variant="earth" size="lg"><Edit className="size-5" />Edit</Button>
              <Button variant="destructive" size="lg"><Trash2 className="size-5" />Delete</Button>
              <Button variant="harvest" size="lg"><MessageCircle className="size-5" />Chat</Button>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
);

export default MyListings;
