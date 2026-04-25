import { MessageCircle, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProduceCardProps {
  crop: string;
  icon: string;
  price: string;
  quantity: string;
  location: string;
  farmer: string;
  phone: string;
}

export const ProduceCard = ({ crop, icon, price, quantity, location, farmer, phone }: ProduceCardProps) => {
  const whatsapp = `https://wa.me/${phone.replace("+", "")}?text=I%20want%20to%20buy%20${crop}`;

  return (
    <article className="rounded-3xl border bg-card p-4 shadow-touch transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-center gap-4">
        <div className="grid size-20 place-items-center rounded-3xl bg-surface-leaf text-5xl" aria-hidden="true">{icon}</div>
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-black">{crop}</h3>
          <p className="text-lg font-bold text-primary">{price}</p>
          <p className="text-base font-semibold text-muted-foreground">{quantity}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-base font-bold text-muted-foreground">
        <MapPin className="size-5 text-secondary" aria-hidden="true" />
        <span>{location} • {farmer}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button asChild variant="farm" size="lg">
          <a href={`tel:${phone}`}><Phone className="size-5" />Call</a>
        </Button>
        <Button asChild variant="harvest" size="lg">
          <a href={whatsapp}><MessageCircle className="size-5" />WhatsApp</a>
        </Button>
      </div>
    </article>
  );
};
