import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBasket, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OfflineNotice } from "@/components/OfflineNotice";
import { RoleBasedRedirect } from "@/components/auth/RoleBasedRedirect";

const Landing = () => (
  <section className="animate-gentle-rise">
    <RoleBasedRedirect />
    <OfflineNotice />
    <div className="relative overflow-hidden rounded-[2rem] border bg-hero-farm p-5 shadow-soft md:p-10">
      <div className="field-lines absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative grid gap-8 md:grid-cols-[1fr_0.85fr] md:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-black text-primary shadow-touch">
            <span aria-hidden="true">📍</span> Tamale • Northern Ghana
          </div>
          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-normal md:text-6xl">Farm Produce Marketplace</h1>
          <p className="mt-4 text-2xl font-bold text-muted-foreground">Sell and buy farm produce easily</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Button asChild variant="farm" size="touch">
              <Link to="/login?role=farmer"><Sprout className="size-7" />I am a Farmer 🌾</Link>
            </Button>
            <Button asChild variant="harvest" size="touch">
              <Link to="/login?role=buyer"><ShoppingBasket className="size-7" />I am a Buyer 🛒</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-sm rounded-[2rem] bg-card/70 p-4 shadow-touch">
          <div className="absolute left-8 top-8 animate-leaf-sway text-6xl" aria-hidden="true">🌽</div>
          <div className="absolute right-8 top-16 text-6xl" aria-hidden="true">🍚</div>
          <div className="absolute bottom-16 left-10 text-6xl" aria-hidden="true">🥔</div>
          <div className="absolute bottom-7 right-8 text-7xl" aria-hidden="true">🛒</div>
          <div className="grid h-full place-items-center rounded-[1.5rem] bg-surface-leaf text-8xl shadow-inner" aria-label="Farm illustration">👩🏾‍🌾</div>
        </div>
      </div>
    </div>
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      {["Big buttons", "Works offline", "Call farmers"].map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-3xl border bg-card p-4 text-lg font-black shadow-touch">
          <ArrowRight className="size-6 text-primary" aria-hidden="true" />{item}
        </div>
      ))}
    </div>
  </section>
);

export default Landing;
