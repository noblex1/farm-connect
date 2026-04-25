import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone, Sprout, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type FarmerProfile = {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
};

const fallbackProfile: FarmerProfile = {
  name: "Amina Yakubu",
  email: "amina@example.com",
  phone: "+233 20 123 4567",
  whatsapp: "+233 24 123 4567",
};

const getProfile = () => {
  try {
    const stored = localStorage.getItem("farm-market-farmer-profile");
    return stored ? ({ ...fallbackProfile, ...JSON.parse(stored) } as FarmerProfile) : fallbackProfile;
  } catch {
    return fallbackProfile;
  }
};

const UserProfile = () => {
  const profile = getProfile();
  const whatsappLink = `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello, I want to ask about your farm produce")}`;

  return (
    <section className="animate-gentle-rise">
      <header className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
        <div className="mb-3 grid size-20 place-items-center rounded-3xl bg-card text-5xl shadow-touch" aria-hidden="true">👩🏾‍🌾</div>
        <p className="text-lg font-bold text-muted-foreground">Farmer Profile</p>
        <h1 className="mt-1 text-4xl font-black">{profile.name}</h1>
      </header>

      <div className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <div className="flex items-center gap-4 rounded-3xl bg-surface-leaf p-4">
          <UserRound className="size-8 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-black text-muted-foreground">Name</p>
            <p className="text-xl font-black">{profile.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-3xl bg-surface-warm p-4">
          <Mail className="size-8 text-secondary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-black text-muted-foreground">Email</p>
            <p className="break-words text-xl font-black">{profile.email}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild variant="farm" size="touch">
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}><Phone className="size-7" />Call</a>
          </Button>
          <Button asChild variant="harvest" size="touch">
            <a href={whatsappLink}><MessageCircle className="size-7" />WhatsApp</a>
          </Button>
        </div>
        <Button asChild variant="outline" size="touch">
          <Link to="/create-account"><Sprout className="size-7" />Edit Profile</Link>
        </Button>
      </div>
    </section>
  );
};

export default UserProfile;