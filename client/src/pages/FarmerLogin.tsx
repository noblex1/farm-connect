import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, Mail, Lock, Sprout, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/marketApi";
import { sessionStore } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";
import { RoleBasedRedirect } from "@/components/auth/RoleBasedRedirect";
import type { UserRole } from "@/types/api";

const loginSchema = z.object({
  emailOrPhone: z.string().trim().min(1, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const FarmerLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const requestedRole = (searchParams.get("role") as UserRole | null) || "farmer";
  const nextPath = searchParams.get("next");
  const roleLabel = requestedRole === "buyer" ? "Buyer" : "Farmer";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({ 
      emailOrPhone: String(form.get("emailOrPhone") || ""),
      password: String(form.get("password") || ""),
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setError(errors.emailOrPhone?.[0] || errors.password?.[0] || "Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser({ 
        emailOrPhone: parsed.data.emailOrPhone,
        password: parsed.data.password,
      });

      // Allow admin to login regardless of requested role
      if (requestedRole && response.user.role !== requestedRole && response.user.role !== 'admin') {
        setError(`This account is registered as ${response.user.role}. Please use a ${roleLabel.toLowerCase()} account.`);
        setIsLoading(false);
        return;
      }

      // Store authentication data
      sessionStore.setToken(response.token);
      sessionStore.setUser(response.user);

      localStorage.setItem(
        "farm-market-farmer-profile",
        JSON.stringify({
          name: response.user.name,
          phone: response.user.phoneNumber,
          whatsapp: response.user.phoneNumber,
          email: response.user.email || "",
        })
      );

      // Invalidate and refetch user query to update UI immediately
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.setQueryData(["currentUser", response.token], { user: response.user });

      // Role-based redirect
      const roleRoutes: Record<string, string> = {
        farmer: "/farmer",
        buyer: "/buyer",
        admin: "/admin",
      };

      // If there's a next path and user has permission, go there
      // Otherwise, redirect to role-specific dashboard
      const targetRoute = nextPath || roleRoutes[response.user.role] || "/farmer";
      
      // Show success toast
      toast({
        title: "Login successful!",
        description: `Welcome back, ${response.user.name.split(" ")[0]}!`,
      });

      // Use replace to prevent back button issues
      navigate(targetRoute, { replace: true });
      
      // Force a page reload to ensure all components re-render with new auth state
      window.location.href = targetRoute;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <RoleBasedRedirect />
      <header className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-surface-leaf p-4 sm:p-5 shadow-touch">
        <div className="mb-3 grid size-14 sm:size-16 place-items-center rounded-2xl bg-card text-3xl sm:text-4xl shadow-touch" aria-hidden="true">
          🌾
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">{roleLabel} Login</h1>
        <p className="mt-1.5 sm:mt-2 text-base sm:text-xl font-bold text-muted-foreground">Sign in to your account</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 shadow-touch">
        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <Mail className="size-6 text-secondary" />Email or Phone Number
          </span>
          <Input 
            name="emailOrPhone" 
            required 
            placeholder="email@example.com or +233201234567" 
            className="min-h-14 sm:min-h-16 rounded-2xl text-base sm:text-xl font-bold"
          />
        </label>

        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <Lock className="size-6 text-secondary" />Password
          </span>
          <div className="relative">
            <Input 
              name="password" 
              type={showPassword ? "text" : "password"}
              required 
              placeholder="Enter your password" 
              className="min-h-14 sm:min-h-16 rounded-2xl pr-14 text-base sm:text-xl font-bold"
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
        </label>

        <div className="flex justify-end">
          <Link 
            to="/forgot-password" 
            className="text-sm font-bold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && <span className="text-base font-bold text-destructive">{error}</span>}

        <Button type="submit" variant="farm" size="touch" disabled={isLoading}>
          <LogIn className="size-7" />{isLoading ? "Logging in..." : "Login"}
        </Button>
        <Button asChild variant="harvest" size="touch">
          <Link to={`/create-account?role=${requestedRole}`}>
            <Sprout className="size-7" />Create Account
          </Link>
        </Button>
      </form>
    </section>
  );
};

export default FarmerLogin;
