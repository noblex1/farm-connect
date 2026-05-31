import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, MapPin, Phone, Sprout, Lock, Eye, EyeOff, UserRound } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-8 sm:py-12">
      <div className="w-full max-w-md animate-gentle-rise">
        <RoleBasedRedirect />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-surface-leaf text-4xl sm:text-5xl shadow-sm mb-4">
            {requestedRole === "buyer" ? "🛒" : "🌱"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Create Account</h1>
          <p className="text-base sm:text-lg text-muted-foreground">Join as a {roleLabel.toLowerCase()}</p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm font-medium text-destructive">
            {submitError}
          </div>
        )}

        {/* Form Card */}
        <Card className="rounded-2xl border-2 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                  <UserRound className="size-4 text-primary" />
                  Full Name
                </label>
                <Input 
                  id="name"
                  name="name" 
                  required 
                  placeholder="Amina Yakubu" 
                  className="h-12 rounded-xl text-base"
                />
                {errors.name && <p className="text-sm font-medium text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  Email Address
                </label>
                <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  required 
                  placeholder="amina@example.com" 
                  className="h-12 rounded-xl text-base"
                />
                {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  Phone Number
                </label>
                <Input 
                  id="phone"
                  name="phone" 
                  required 
                  inputMode="tel" 
                  placeholder="+233201234567" 
                  className="h-12 rounded-xl text-base"
                />
                {errors.phone && <p className="text-sm font-medium text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    className="h-12 rounded-xl pr-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm font-medium text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  Location
                </label>
                <Input 
                  id="location"
                  name="location" 
                  required 
                  placeholder="Tamale" 
                  className="h-12 rounded-xl text-base"
                />
                {errors.location && <p className="text-sm font-medium text-destructive">{errors.location}</p>}
              </div>

              <Button type="submit" variant="farm" size="lg" className="w-full h-12 text-base font-semibold mt-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="size-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sprout className="size-5" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              to={`/login?role=${requestedRole}`}
              className="font-semibold text-primary hover:underline"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerCreateAccount;
