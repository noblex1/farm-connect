import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, MapPin, Phone, Sprout, UserRound } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/services/marketApi";
import { sessionStore } from "@/lib/session";
import type { UserRole } from "@/types/api";

const farmerAccountSchema = z.object({
  name: z.string().trim().min(2, "Enter farmer name").max(80, "Name is too long"),
  phone: z.string().trim().regex(/^\+?[0-9]{9,15}$/, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Enter a location").max(80, "Location is too long"),
});

type FarmerAccount = z.infer<typeof farmerAccountSchema>;

const FarmerCreateAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState<Partial<Record<keyof FarmerAccount, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const requestedRole = (searchParams.get("role") as UserRole | null) || "farmer";
  const roleLabel = requestedRole === "buyer" ? "Buyer" : "Farmer";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      location: String(form.get("location") || ""),
    };

    const parsed = farmerAccountSchema.safeParse(values);

    if (!parsed.success) {
      setSuccess(false);
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        phone: fieldErrors.phone?.[0],
        location: fieldErrors.location?.[0],
      });
      return;
    }

    try {
      const response = await registerUser({
        name: parsed.data.name,
        phoneNumber: parsed.data.phone,
        location: parsed.data.location,
        role: requestedRole === "buyer" ? "buyer" : "farmer",
      });

      sessionStore.setToken(response.token);
      sessionStore.setUser(response.user);
      localStorage.setItem(
        "farm-market-farmer-profile",
        JSON.stringify({
          name: response.user.name,
          phone: response.user.phoneNumber,
          whatsapp: response.user.phoneNumber,
          email: "",
        })
      );

      setErrors({});
      setSuccess(true);
      const homeByRole: Record<string, string> = {
        farmer: "/farmer",
        buyer: "/buyer",
        admin: "/prices",
      };
      window.setTimeout(() => navigate(homeByRole[response.user.role] || "/"), 650);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create account");
      setSuccess(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <header className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
        <div className="mb-3 grid size-16 place-items-center rounded-2xl bg-card text-4xl shadow-touch" aria-hidden="true">
          ??
        </div>
        <h1 className="text-4xl font-black">Create {roleLabel} Account</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">{roleLabel} onboarding</p>
      </header>

      {success && (
        <div
          className="mb-5 flex items-center gap-3 rounded-3xl border bg-surface-leaf p-4 text-xl font-black text-primary shadow-touch"
          role="status"
        >
          <CheckCircle2 className="size-8" aria-hidden="true" />Account created
        </div>
      )}

      {submitError && <div className="mb-5 rounded-3xl border border-destructive bg-card p-4 font-bold text-destructive">{submitError}</div>}

      <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <UserRound className="size-6 text-primary" />Full Name
          </span>
          <Input name="name" required placeholder="Amina Yakubu" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.name && <span className="text-base font-bold text-destructive">{errors.name}</span>}
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <Phone className="size-6 text-primary" />Phone Number
          </span>
          <Input name="phone" required inputMode="tel" placeholder="+233201234567" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.phone && <span className="text-base font-bold text-destructive">{errors.phone}</span>}
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <MapPin className="size-6 text-secondary" />Location
          </span>
          <Input name="location" required placeholder="Tamale" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.location && <span className="text-base font-bold text-destructive">{errors.location}</span>}
        </label>

        <Button type="submit" variant="farm" size="touch" className="mt-2">
          <Sprout className="size-7" />Create Account
        </Button>
        <Button asChild variant="outline" size="touch">
          <Link to={`/login?role=${requestedRole}`}>Login instead</Link>
        </Button>
      </form>
    </section>
  );
};

export default FarmerCreateAccount;
