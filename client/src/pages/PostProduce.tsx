import { ChangeEvent, FormEvent, useState, DragEvent } from "react";
import { CheckCircle2, ImagePlus, MapPin, PackagePlus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cropOptions } from "@/constants/crops";
import { OfflineNotice } from "@/components/OfflineNotice";
import { createListing } from "@/services/marketApi";
import { sessionStore } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const PostProduce = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format. Use JPG, PNG, or WebP.`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit.`,
          variant: "destructive",
        });
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = validateFiles(fileArray);
    const remainingSlots = MAX_IMAGES - images.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      toast({
        title: "Too many images",
        description: `You can only upload ${MAX_IMAGES} images total. ${validFiles.length - remainingSlots} file(s) were not added.`,
        variant: "destructive",
      });
    }

    const newImages = [...images, ...filesToAdd];
    const newPreviews = [...preview, ...filesToAdd.map((file) => URL.createObjectURL(file))];

    setImages(newImages);
    setPreview(newPreviews);
  };

  const onImage = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = ""; // Reset input to allow re-selecting same file
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(preview[index]); // Clean up memory
    setImages(images.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);
    setError("");
    setIsSubmitting(true);

    const token = sessionStore.getToken();
    if (!token) {
      setError("Please login as a farmer before posting produce");
      setIsSubmitting(false);
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
      
      // Clean up preview URLs
      preview.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setPreview([]);

      toast({
        title: "Success!",
        description: "Your produce has been posted to the marketplace.",
      });
    } catch (requestError) {
      const errorMessage = requestError instanceof Error ? requestError.message : "Could not post produce";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <header className="mb-5">
        <h1 className="text-4xl font-black">Post Produce</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">List your crops for buyers</p>
      </header>

      {success && (
        <div
          className="mb-5 flex items-center gap-3 rounded-3xl border bg-surface-leaf p-4 text-xl font-black text-primary shadow-touch"
          role="status"
        >
          <CheckCircle2 className="size-8" aria-hidden="true" />
          Produce posted successfully
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-3xl border border-destructive bg-card p-4 font-bold text-destructive" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid gap-5 rounded-3xl border bg-card p-5 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          Crop Type *
          <select
            name="cropType"
            required
            className="min-h-14 rounded-2xl border bg-background px-4 text-lg font-bold transition focus:ring-2 focus:ring-primary"
          >
            {cropOptions.map((crop) => (
              <option key={crop.value} value={crop.value}>
                {crop.icon} {crop.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-lg font-black">
            Quantity *
            <input
              name="quantity"
              required
              min="1"
              type="number"
              placeholder="e.g., 10"
              className="min-h-14 rounded-2xl border bg-background px-4 text-lg font-bold transition focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="grid gap-2 text-lg font-black">
            Unit
            <input
              name="unit"
              type="text"
              placeholder="bag, kg, ton"
              defaultValue="bag"
              className="min-h-14 rounded-2xl border bg-background px-4 text-lg font-bold transition focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>

        <label className="grid gap-2 text-lg font-black">
          Price (GH₵) *
          <input
            name="price"
            required
            min="0"
            type="number"
            step="0.01"
            placeholder="e.g., 420"
            className="min-h-14 rounded-2xl border bg-background px-4 text-lg font-bold transition focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <MapPin className="size-6 text-secondary" />
            Location *
          </span>
          <select
            name="location"
            required
            className="min-h-14 rounded-2xl border bg-background px-4 text-lg font-bold transition focus:ring-2 focus:ring-primary"
          >
            <option>Tamale</option>
            <option>Savelugu</option>
            <option>Yendi</option>
            <option>Walewale</option>
            <option>Bolgatanga</option>
            <option>Salaga</option>
          </select>
        </label>

        {/* Image Upload Section */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-lg font-black">
              <ImagePlus className="size-6 text-primary" />
              Photos (Optional)
            </label>
            {images.length > 0 && (
              <Badge variant="secondary">
                {images.length} / {MAX_IMAGES}
              </Badge>
            )}
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative rounded-2xl border-2 border-dashed transition ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/30 bg-background hover:border-primary/50"
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={onImage}
              disabled={images.length >= MAX_IMAGES}
              className="absolute inset-0 cursor-pointer opacity-0"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center"
            >
              <Upload className={`size-10 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-base font-bold text-muted-foreground">
                {images.length >= MAX_IMAGES
                  ? "Maximum images reached"
                  : isDragging
                    ? "Drop images here"
                    : "Click to upload or drag & drop"}
              </p>
              <p className="text-sm font-medium text-muted-foreground/70">
                JPG, PNG, or WebP • Max 5MB • Up to {MAX_IMAGES} images
              </p>
            </label>
          </div>

          {/* Image Previews */}
          {preview.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {preview.map((src, index) => (
                <div key={src} className="group relative">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full rounded-2xl border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 grid size-8 place-items-center rounded-full border-2 border-background bg-destructive text-destructive-foreground opacity-0 shadow-lg transition group-hover:opacity-100"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" variant="farm" size="touch" className="mt-2" disabled={isSubmitting}>
          <PackagePlus className="size-7" />
          {isSubmitting ? "Posting..." : "Post Now"}
        </Button>
      </form>
    </section>
  );
};

export default PostProduce;
