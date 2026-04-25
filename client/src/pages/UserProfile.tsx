import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageCircle, Phone, Sprout, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sessionStore } from "@/lib/session";
import { fetchCurrentUser, updateCurrentUser } from "@/services/marketApi";

type EditableProfile = {
  name: string;
  location: string;
  email: string;
  whatsappNumber: string;
};

const UserProfile = () => {
  const token = sessionStore.getToken();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["profile", token],
    enabled: Boolean(token),
    queryFn: () => fetchCurrentUser(token),
    retry: 1,
  });

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
    setPhotoFile(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
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

    try {
      const response = await updateCurrentUser(token, {
        name: String(form.get("name") || ""),
        location: String(form.get("location") || ""),
        email: String(form.get("email") || ""),
        whatsappNumber: String(form.get("whatsappNumber") || ""),
        profilePicture: photoFile,
      });

      sessionStore.setUser(response.user);
      setPhotoFile(null);
      setSaveSuccess("Profile updated successfully");
      await refetch();
    } catch (requestError) {
      setSaveError(requestError instanceof Error ? requestError.message : "Could not update profile");
    }
  };

  if (!token) {
    return (
      <section className="animate-gentle-rise rounded-3xl border bg-card p-6 text-center">
        <p className="text-xl font-black">Please login to view your profile.</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="animate-gentle-rise rounded-3xl border bg-card p-6 text-center">
        <p className="text-xl font-black">Loading profile...</p>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="animate-gentle-rise rounded-3xl border border-destructive bg-card p-6 text-center">
        <p className="text-xl font-black text-destructive">{error instanceof Error ? error.message : "Could not load profile"}</p>
      </section>
    );
  }

  const whatsappLink = `https://wa.me/${(profile.whatsappNumber || profile.phoneNumber).replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hello, I want to ask about your farm produce"
  )}`;
  const avatarSrc = photoPreview || profile.profilePicture;

  return (
    <section className="animate-gentle-rise">
      <header className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
        <div className="mb-3 grid size-24 place-items-center overflow-hidden rounded-3xl bg-card text-5xl shadow-touch" aria-hidden="true">
          {avatarSrc ? <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" /> : "???????"}
        </div>
        <p className="text-lg font-bold text-muted-foreground">{profile.role} Profile</p>
        <h1 className="mt-1 text-4xl font-black">{profile.name}</h1>
      </header>

      {saveError && <div className="mb-4 rounded-2xl border border-destructive bg-card p-3 font-bold text-destructive">{saveError}</div>}
      {saveSuccess && <div className="mb-4 rounded-2xl border bg-surface-leaf p-3 font-bold text-primary">{saveSuccess}</div>}

      <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <UserRound className="size-8 text-primary" aria-hidden="true" />Name
          </span>
          <Input name="name" defaultValue={initial.name} required className="min-h-14 rounded-2xl text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-lg font-black">
          Location
          <Input name="location" defaultValue={initial.location} required className="min-h-14 rounded-2xl text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <Mail className="size-8 text-secondary" aria-hidden="true" />Email
          </span>
          <Input name="email" type="email" defaultValue={initial.email} className="min-h-14 rounded-2xl text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-lg font-black">
          WhatsApp Number
          <Input name="whatsappNumber" defaultValue={initial.whatsappNumber} className="min-h-14 rounded-2xl text-xl font-bold" />
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <Upload className="size-6 text-primary" />Profile Photo
          </span>
          <input type="file" accept="image/*" onChange={onPhoto} className="min-h-14 rounded-2xl border bg-background p-3" />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild variant="farm" size="touch">
            <a href={`tel:${profile.phoneNumber.replace(/\s/g, "")}`}>
              <Phone className="size-7" />Call
            </a>
          </Button>
          <Button asChild variant="harvest" size="touch">
            <a href={whatsappLink}>
              <MessageCircle className="size-7" />WhatsApp
            </a>
          </Button>
        </div>

        <Button type="submit" variant="farm" size="touch">
          Save Profile
        </Button>

        <Button asChild variant="outline" size="touch">
          <Link to="/create-account">
            <Sprout className="size-7" />Create Another Account
          </Link>
        </Button>
      </form>
    </section>
  );
};

export default UserProfile;
