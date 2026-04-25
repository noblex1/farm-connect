import { ChangeEvent, FormEvent, useState } from "react";
import { CheckCircle2, ImagePlus, MapPin, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cropOptions } from "@/data/marketplace";
import { OfflineNotice } from "@/components/OfflineNotice";

const PostProduce = () => {
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSuccess(true);
  };

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <header className="mb-5">
        <h1 className="text-4xl font-black">Post Produce</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Simple form. Big buttons.</p>
      </header>

      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-3xl border bg-surface-leaf p-4 text-xl font-black text-primary shadow-touch" role="status">
          <CheckCircle2 className="size-8" aria-hidden="true" />Produce posted successfully
        </div>
      )}

      <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          🌾 Crop Type
          <select required className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold">
            {cropOptions.map((crop) => (
              <option key={crop.value} value={crop.value}>{crop.icon} {crop.label}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-lg font-black">
          📦 Quantity
          <input required min="1" type="number" placeholder="Example: 10 bags" className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-lg font-black">
          💰 Price
          <input type="text" placeholder="Optional" className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2"><MapPin className="size-6 text-secondary" />Location</span>
          <select className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold">
            <option>Tamale</option>
            <option>Savelugu</option>
            <option>Yendi</option>
            <option>Walewale</option>
          </select>
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2"><ImagePlus className="size-6 text-primary" />Photo</span>
          <input type="file" accept="image/*" onChange={onImage} className="min-h-16 rounded-2xl border bg-background p-4 text-base font-bold" />
        </label>
        {preview && <img src={preview} alt="Produce preview" className="h-48 w-full rounded-3xl object-cover" />}

        <Button type="submit" variant="farm" size="touch" className="mt-2">
          <PackagePlus className="size-7" />Post Now
        </Button>
      </form>
    </section>
  );
};

export default PostProduce;
