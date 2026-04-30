import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Favorites = () => {
  return (
    <section className="animate-gentle-rise">
      <header className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-surface-leaf p-4 sm:p-5 shadow-touch">
        <div className="mb-3 grid size-14 sm:size-16 place-items-center rounded-2xl bg-card text-3xl sm:text-4xl shadow-touch" aria-hidden="true">
          ❤️
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">Saved Items</h1>
        <p className="mt-1.5 sm:mt-2 text-base sm:text-lg md:text-xl font-bold text-muted-foreground">
          Your favorite produce listings
        </p>
      </header>

      <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="mx-auto mb-4 grid size-20 sm:size-24 place-items-center rounded-2xl sm:rounded-3xl bg-surface-leaf">
            <Heart className="size-10 sm:size-12 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black mb-2">No Saved Items Yet</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
            Start browsing the marketplace and save your favorite produce listings here for quick access later.
          </p>
        </CardContent>
      </Card>

      <div className="mt-4 sm:mt-5 rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 shadow-touch">
        <h3 className="text-lg sm:text-xl font-black mb-3">How to Save Items</h3>
        <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">1.</span>
            <span>Browse produce listings in the marketplace</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">2.</span>
            <span>Tap the heart icon on any listing you like</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">3.</span>
            <span>Find all your saved items here for easy access</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Favorites;
