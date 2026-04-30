import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sessionStore } from "@/lib/session";
import { updateCurrentUser } from "@/services/marketApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type EditableProfile = {
  name: string;
  location: string;
  email: string;
  whatsappNumber: string;
};

const UserProfile = () => {
  const queryClient = useQueryClient();
  const token = sessionStore.getToken();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, isError, error } = useCurrentUser();

  const profile = data?.user;

  const initial = useMemo<EditableProfile>(
    () => ({
      name: profile?.name || "",
      location: profile?.location || "",
      email: profile?.email || "",
      whatsappNumber: profile?.whatsappNumber || profile?.phoneNumber || "",
    }),
    [profile]
  );

  const onPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    console.log("File selected:", file);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSaveError("Please select an image file (JPG, PNG, WebP)");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveError("Image must be less than 5MB");
        return;
      }
      
      console.log("File is valid, creating preview");
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setSaveError(""); // Clear any previous errors
      console.log("Preview URL created:", previewUrl);
    } else {
      setPhotoFile(null);
      setPhotoPreview("");
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setSaveError("Please login first");
      return;
    }

    const form = new FormData(event.currentTarget);
    setSaveError("");
    setSaveSuccess("");
    setIsSaving(true);

    console.log("=== Profile Update Submission ===");
    console.log("Photo file:", photoFile);
    console.log("Photo file details:", {
      name: photoFile?.name,
      size: photoFile?.size,
      type: photoFile?.type,
    });

    try {
      console.log("Calling updateCurrentUser API...");
      const response = await updateCurrentUser(token, {
        name: String(form.get("name") || ""),
        location: String(form.get("location") || ""),
        email: String(form.get("email") || ""),
        whatsappNumber: String(form.get("whatsappNumber") || ""),
        profilePicture: photoFile,
      });

      console.log("=== API Response ===");
      console.log("Full response:", response);
      console.log("response.user:", response.user);
      console.log("response.user.profilePicture:", response.user.profilePicture);
      console.log("Is profilePicture empty?", !response.user.profilePicture);

      if (!response.user.profilePicture) {
        console.error("❌ API returned empty profilePicture!");
        setSaveError("Image upload failed - no URL returned from server");
        setIsSaving(false);
        return;
      }

      console.log("✅ profilePicture URL received:", response.user.profilePicture);

      // Update localStorage immediately
      sessionStore.setUser(response.user);
      console.log("Saved to localStorage");
      
      // Verify localStorage
      const savedUser = sessionStore.getUser<ApiUser>();
      console.log("Verified localStorage user:", savedUser);
      console.log("Verified localStorage profilePicture:", savedUser?.profilePicture);
      
      // Invalidate and refetch the current user query to update all components
      console.log("Invalidating queries...");
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      
      // Wait for the query to refetch so the new image is loaded
      console.log("Refetching queries...");
      await queryClient.refetchQueries({ queryKey: ["currentUser"] });
      
      console.log("Query refetched, clearing preview");
      
      // Now it's safe to clear the preview since the real image should be loaded
      setPhotoFile(null);
      setPhotoPreview("");
      setSaveSuccess("Profile updated successfully");
    } catch (requestError) {
      console.error("Profile update error:", requestError);
      setSaveError(requestError instanceof Error ? requestError.message : "Could not update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!token) {
    return (
      <section className="animate-gentle-rise rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-6 text-center">
        <p className="text-xl font-black">Please login to view your profile.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="animate-gentle-rise rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-6 text-center">
        <p className="text-xl font-black">Loading profile...</p>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="animate-gentle-rise rounded-2xl sm:rounded-3xl border border-destructive bg-card p-4 sm:p-6 text-center">
        <p className="text-xl font-black text-destructive">{error instanceof Error ? error.message : "Could not load profile"}</p>
      </section>
    );
  }

  const avatarSrc = photoPreview || profile.profilePicture;

  console.log("=== Avatar Display ===");
  console.log("photoPreview:", photoPreview);
  console.log("profile.profilePicture:", profile.profilePicture);
  console.log("avatarSrc (final):", avatarSrc);

  return (
    <section className="animate-gentle-rise">
      <header className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-surface-leaf p-4 sm:p-5 shadow-touch">
        {/* Mobile: Show only profile picture */}
        <div className="flex flex-col items-center md:items-start">
          <div className="grid size-20 sm:size-24 place-items-center overflow-hidden rounded-2xl sm:rounded-3xl bg-card text-4xl sm:text-5xl shadow-touch" aria-hidden="true">
            {avatarSrc ? <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" /> : "👤"}
          </div>
          {/* Desktop: Show role and name */}
          <div className="hidden md:block mt-3">
            <p className="text-base sm:text-lg font-bold text-muted-foreground">{profile.role} Profile</p>
            <h1 className="mt-1 text-2xl sm:text-4xl font-black">{profile.name}</h1>
          </div>
        </div>
      </header>

      {saveError && <div className="mb-4 rounded-2xl border border-destructive bg-card p-3 font-bold text-destructive">{saveError}</div>}
      {saveSuccess && <div className="mb-4 rounded-2xl border bg-surface-leaf p-3 font-bold text-primary">{saveSuccess}</div>}

      <form onSubmit={onSubmit} className="grid gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 shadow-touch">
        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <UserRound className="size-6 sm:size-8 text-primary" aria-hidden="true" />Name
          </span>
          <Input name="name" defaultValue={initial.name} required className="min-h-14 rounded-2xl text-base sm:text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-base sm:text-lg font-black">
          Location
          <Input name="location" defaultValue={initial.location} required className="min-h-14 rounded-2xl text-base sm:text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <Mail className="size-6 sm:size-8 text-secondary" aria-hidden="true" />Email
          </span>
          <Input name="email" type="email" defaultValue={initial.email} className="min-h-14 rounded-2xl text-base sm:text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-base sm:text-lg font-black">
          WhatsApp Number
          <Input name="whatsappNumber" defaultValue={initial.whatsappNumber} className="min-h-14 rounded-2xl text-base sm:text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <Upload className="size-6 text-primary" />Profile Photo
          </span>
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/webp" 
            onChange={onPhoto} 
            className="min-h-14 rounded-2xl border bg-background p-3" 
          />
          {photoPreview && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-primary mb-2">New photo preview:</p>
              <img 
                src={photoPreview} 
                alt="New profile preview" 
                className="h-32 w-32 rounded-2xl object-cover border-2 border-primary" 
              />
            </div>
          )}
        </label>

        <Button type="submit" variant="farm" size="touch" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </section>
  );
};

export default UserProfile;
