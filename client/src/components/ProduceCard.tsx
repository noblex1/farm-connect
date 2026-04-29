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
    <article className="group rounded-2xl md:rounded-3xl border bg-card shadow-touch transition hover:-translate-y-1 hover:shadow-soft">
      {/* Image Section */}
      {images.length > 0 && (
        <div className="relative overflow-hidden rounded-t-2xl md:rounded-t-3xl">
          <img
            src={images[0]}
            alt={`${crop} from ${farmer}`}
            className="h-40 sm:h-48 md:h-52 w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
          {status === "sold" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="destructive" className="text-sm sm:text-base md:text-lg font-black px-3 py-1.5 sm:px-4 sm:py-2">
                SOLD OUT
              </Badge>
            </div>
          )}
        </div>
      )}

      <div className="p-3 sm:p-4 md:p-5">
        {/* Header with crop info */}
        <div className="flex items-center gap-3">
          {images.length === 0 && (
            <div className="grid size-16 sm:size-20 shrink-0 place-items-center rounded-2xl md:rounded-3xl bg-surface-leaf text-4xl sm:text-5xl" aria-hidden="true">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-black leading-tight">{crop}</h3>
              {status === "available" && images.length > 0 && (
                <Badge variant="secondary" className="shrink-0 text-xs sm:text-sm">
                  Available
                </Badge>
              )}
            </div>
            <p className="text-base sm:text-lg font-bold text-primary mt-0.5">{price}</p>
            <p className="text-sm sm:text-base font-semibold text-muted-foreground">{quantity}</p>
          </div>
        </div>

        {/* Location and Farmer */}
        <div className="mt-3 sm:mt-4 space-y-1">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-muted-foreground">
            <MapPin className="size-3.5 sm:size-4 shrink-0 text-secondary" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground">
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
          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <Button asChild variant="farm" size="default" className="font-bold h-10 sm:h-11 text-sm sm:text-base">
              <a href={`tel:${phone}`} aria-label={`Call ${farmer}`}>
                <Phone className="size-4 sm:size-5" />
                <span className="hidden xs:inline sm:inline">Call</span>
              </a>
            </Button>
            <Button asChild variant="harvest" size="default" className="font-bold h-10 sm:h-11 text-sm sm:text-base">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${farmer}`}>
                <MessageCircle className="size-4 sm:size-5" />
                <span className="hidden xs:inline sm:inline">WhatsApp</span>
              </a>
            </Button>
          </div>
        )}

        {status === "sold" && (
          <div className="mt-3 sm:mt-4">
            <Button disabled size="default" className="w-full font-bold h-10 sm:h-11 text-sm sm:text-base">
              This listing is no longer available
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};
