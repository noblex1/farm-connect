import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBasket, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OfflineNotice } from "@/components/OfflineNotice";

const Landing = () => (
  <section className="animate-gentle-rise">
    <OfflineNotice />
    <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border bg-hero-farm p-4 sm:p-5 md:p-10 shadow-soft">
      <div className="field-lines absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative grid gap-6 sm:gap-8 md:grid-cols-[1fr_0.85fr] md:items-center">
        <div>
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-card px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-black text-primary shadow-touch">
            <span aria-hidden="true">📍</span> Tamale • Northern Ghana
          </div>
          <h1 className="max-w-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-normal">Farm Produce Marketplace</h1>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl font-bold text-muted-foreground">Sell and buy farm produce easily</p>
          <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 sm:grid-cols-2">
            <Button asChild variant="farm" size="touch" className="h-14 sm:h-16 text-base sm:text-lg">
              <Link to="/login"><Sprout className="size-6 sm:size-7" />Sign In</Link>
            </Button>
            <Button asChild variant="harvest" size="touch" className="h-14 sm:h-16 text-base sm:text-lg">
              <Link to="/create-account"><ShoppingBasket className="size-6 sm:size-7" />Create Account</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-sm rounded-2xl sm:rounded-[2rem] bg-card/70 p-3 sm:p-4 shadow-touch">
          <div className="absolute left-6 sm:left-8 top-6 sm:top-8 animate-leaf-sway text-4xl sm:text-5xl md:text-6xl" aria-hidden="true">🌽</div>
          <div className="absolute right-6 sm:right-8 top-12 sm:top-16 text-4xl sm:text-5xl md:text-6xl" aria-hidden="true">🍚</div>
          <div className="absolute bottom-12 sm:bottom-16 left-8 sm:left-10 text-4xl sm:text-5xl md:text-6xl" aria-hidden="true">🥔</div>
          <div className="absolute bottom-6 sm:bottom-7 right-6 sm:right-8 text-5xl sm:text-6xl md:text-7xl" aria-hidden="true">🛒</div>
          <div className="grid h-full place-items-center rounded-xl sm:rounded-[1.5rem] bg-surface-leaf text-6xl sm:text-7xl md:text-8xl shadow-inner" aria-label="Farm illustration">👩🏾‍🌾</div>
        </div>
      </div>
    </div>
    <div className="mt-4 sm:mt-5 md:mt-6 grid gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3">
      {["Big buttons", "Works offline", "Call farmers"].map((item) => (
        <div key={item} className="flex items-center gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl border bg-card p-3 sm:p-4 text-base sm:text-lg font-black shadow-touch">
          <ArrowRight className="size-5 sm:size-6 text-primary" aria-hidden="true" />{item}
        </div>
      ))}
    </div>
  </section>
);

export default Landing;
