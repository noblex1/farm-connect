import { MessageCircle, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ProduceCardProps {
  id: string;
  crop: string;
  icon: string;
  price: string;
  quantity: string;
  location: string;
  farmer: string;
  phone: string;
  images?: string[];
  status?: "available" | "sold";
  createdAt?: string;
}

export const ProduceCard = ({
  crop,
  icon,
  price,
  quantity,
  location,
  farmer,
  phone,
  images = [],
  status = "available",
  createdAt,
}: ProduceCardProps) => {
  // Enhanced WhatsApp message with more context
  const whatsappMessage = encodeURIComponent(
    `Hello ${farmer}, I'm interested in buying your ${crop} (${quantity}) listed at ${price} in ${location}. Is it still available?`
  );
  const whatsapp = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`;

  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : null;

  return (
    <article className="group rounded-3xl border bg-card shadow-touch transition hover:-translate-y-1 hover:shadow-soft">
      {/* Image Section */}
      {images.length > 0 && (
        <div className="relative overflow-hidden rounded-t-3xl">
          <img
            src={images[0]}
            alt={`${crop} from ${farmer}`}
            className="h-48 w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
          {status === "sold" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="destructive" className="text-lg font-black px-4 py-2">
                SOLD OUT
              </Badge>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Header with crop info */}
        <div className="flex items-center gap-4">
          {images.length === 0 && (
            <div className="grid size-20 shrink-0 place-items-center rounded-3xl bg-surface-leaf text-5xl" aria-hidden="true">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-2xl font-black">{crop}</h3>
              {status === "available" && images.length > 0 && (
                <Badge variant="secondary" className="shrink-0">
                  Available
                </Badge>
              )}
            </div>
            <p className="text-lg font-bold text-primary">{price}</p>
            <p className="text-base font-semibold text-muted-foreground">{quantity}</p>
          </div>
        </div>

        {/* Location and Farmer */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-2 text-base font-bold text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-secondary" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <span className="truncate">Farmer: {farmer}</span>
          </div>
          {timeAgo && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Calendar className="size-3 shrink-0" aria-hidden="true" />
              <span>Posted {timeAgo}</span>
            </div>
          )}
        </div>

        {/* Contact Buttons */}
        {status === "available" && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button asChild variant="farm" size="lg" className="font-bold">
              <a href={`tel:${phone}`} aria-label={`Call ${farmer}`}>
                <Phone className="size-5" />
                Call
              </a>
            </Button>
            <Button asChild variant="harvest" size="lg" className="font-bold">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${farmer}`}>
                <MessageCircle className="size-5" />
                WhatsApp
              </a>
            </Button>
          </div>
        )}

        {status === "sold" && (
          <div className="mt-4">
            <Button disabled size="lg" className="w-full font-bold">
              This listing is no longer available
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};
