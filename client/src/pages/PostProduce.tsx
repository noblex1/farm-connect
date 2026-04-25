import { ChangeEvent, FormEvent, useState } from "react";
import { CheckCircle2, ImagePlus, MapPin, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cropOptions } from "@/constants/crops";
import { OfflineNotice } from "@/components/OfflineNotice";
import { createListing } from "@/services/marketApi";
import { sessionStore } from "@/lib/session";

const PostProduce = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const onImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);
    setError("");

    const token = sessionStore.getToken();
    if (!token) {
      setError("Please login as a farmer before posting produce");
      return;
    }

    const form = new FormData(event.currentTarget);

    try {
      await createListing(token, {
        cropType: String(form.get("cropType")) as "maize" | "rice" | "yam",
        quantity: Number(form.get("quantity")),
        price: Number(form.get("price")),
        location: String(form.get("location")),
        unit: String(form.get("unit") || "bag"),
        images,
      });
      setSuccess(true);
      (event.currentTarget as HTMLFormElement).reset();
      setImages([]);
      setPreview([]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not post produce");
    }
  };

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <header className="mb-5">
        <h1 className="text-4xl font-black">Post Produce</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Simple form. Big buttons.</p>
      </header>

      {success && (
        <div
          className="mb-5 flex items-center gap-3 rounded-3xl border bg-surface-leaf p-4 text-xl font-black text-primary shadow-touch"
          role="status"
        >
          <CheckCircle2 className="size-8" aria-hidden="true" />Produce posted successfully
        </div>
      )}

      {error && <div className="mb-5 rounded-3xl border border-destructive bg-card p-4 font-bold text-destructive">{error}</div>}

      <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          Crop Type
          <select name="cropType" required className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold">
            {cropOptions.map((crop) => (
              <option key={crop.value} value={crop.value}>
                {crop.icon} {crop.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-lg font-black">
          Quantity
          <input
            name="quantity"
            required
            min="1"
            type="number"
            placeholder="Example: 10"
            className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold"
          />
        </label>

        <label className="grid gap-2 text-lg font-black">
          Price (GHS)
          <input
            name="price"
            required
            min="0"
            type="number"
            step="0.01"
            placeholder="Example: 420"
            className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold"
          />
        </label>

        <label className="grid gap-2 text-lg font-black">
          Unit
          <input name="unit" type="text" placeholder="bag" className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <MapPin className="size-6 text-secondary" />Location
          </span>
          <select name="location" className="min-h-16 rounded-2xl border bg-background px-4 text-xl font-bold">
            <option>Tamale</option>
            <option>Savelugu</option>
            <option>Yendi</option>
            <option>Walewale</option>
          </select>
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <ImagePlus className="size-6 text-primary" />Photo
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImage}
            className="min-h-16 rounded-2xl border bg-background p-4 text-base font-bold"
          />
        </label>
        {preview.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {preview.map((src) => (
              <img key={src} src={src} alt="Produce preview" className="h-28 w-full rounded-3xl object-cover" />
            ))}
          </div>
        )}

        <Button type="submit" variant="farm" size="touch" className="mt-2">
          <PackagePlus className="size-7" />Post Now
        </Button>
      </form>
    </section>
  );
};

export default PostProduce;
