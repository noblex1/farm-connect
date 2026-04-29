import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, MapPin, Phone, Sprout, Lock, Eye, EyeOff, UserRound } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWithOTP } from "@/services/marketApi";
import { useToast } from "@/hooks/use-toast";
import { RoleBasedRedirect } from "@/components/auth/RoleBasedRedirect";
import type { UserRole } from "@/types/api";

const farmerAccountSchema = z.object({
  name: z.string().trim().min(2, "Enter farmer name").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(/^\+?[0-9]{9,15}$/, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().trim().min(2, "Enter a location").max(80, "Location is too long"),
});

type FarmerAccount = z.infer<typeof farmerAccountSchema>;

const FarmerCreateAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState<Partial<Record<keyof FarmerAccount, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const requestedRole = (searchParams.get("role") as UserRole | null) || "farmer";
  const roleLabel = requestedRole === "buyer" ? "Buyer" : "Farmer";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      password: String(form.get("password") || ""),
      location: String(form.get("location") || ""),
    };

    const parsed = farmerAccountSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
        location: fieldErrors.location?.[0],
      });
      setIsLoading(false);
      return;
    }

    try {
      await registerWithOTP({
        name: parsed.data.name,
        email: parsed.data.email,
        phoneNumber: parsed.data.phone,
        password: parsed.data.password,
        location: parsed.data.location,
        role: requestedRole === "buyer" ? "buyer" : "farmer",
      });

      setErrors({});

      toast({
        title: "OTP sent!",
        description: "Check your email for the verification code.",
      });

      // Navigate to OTP verification page with registration data
      const params = new URLSearchParams({
        email: parsed.data.email,
        name: parsed.data.name,
        phone: parsed.data.phone,
        password: parsed.data.password,
        location: parsed.data.location,
        role: requestedRole === "buyer" ? "buyer" : "farmer",
      });
      
      navigate(`/verify-otp?${params.toString()}`, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create account. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <RoleBasedRedirect />
      <header className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
        <div className="mb-3 grid size-16 place-items-center rounded-2xl bg-card text-4xl shadow-touch" aria-hidden="true">
          🌱
        </div>
        <h1 className="text-4xl font-black">Create {roleLabel} Account</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">{roleLabel} onboarding</p>
      </header>

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
            <Mail className="size-6 text-primary" />Email Address
          </span>
          <Input name="email" type="email" required placeholder="amina@example.com" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.email && <span className="text-base font-bold text-destructive">{errors.email}</span>}
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
            <Lock className="size-6 text-primary" />Password
          </span>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="At least 6 characters"
              className="min-h-16 rounded-2xl pr-14 text-xl font-bold"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
            </button>
          </div>
          {errors.password && <span className="text-base font-bold text-destructive">{errors.password}</span>}
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <MapPin className="size-6 text-secondary" />Location
          </span>
          <Input name="location" required placeholder="Tamale" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.location && <span className="text-base font-bold text-destructive">{errors.location}</span>}
        </label>

        <Button type="submit" variant="farm" size="touch" className="mt-2" disabled={isLoading}>
          <Sprout className="size-7" />{isLoading ? "Creating Account..." : "Create Account"}
        </Button>
        <Button asChild variant="outline" size="touch">
          <Link to={`/login?role=${requestedRole}`}>Login instead</Link>
        </Button>
      </form>
    </section>
  );
};

export default FarmerCreateAccount;
