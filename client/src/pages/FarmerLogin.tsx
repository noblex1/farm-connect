import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { loginUser } from "@/services/marketApi";
import { sessionStore } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";
import { RoleBasedRedirect } from "@/components/auth/RoleBasedRedirect";
import { getRoleHomePath } from "@/lib/roleHome";

const loginSchema = z.object({
  emailOrPhone: z.string().trim().min(1, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const FarmerLogin = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const nextPath = searchParams.get("next");

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

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.setQueryData(["currentUser", response.token], { user: response.user });

      const targetRoute = nextPath || getRoleHomePath(response.user.role);

      toast({
        title: "Login successful!",
        description: `Welcome back, ${response.user.name.split(" ")[0]}!`,
      });

      window.location.href = targetRoute;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-8 sm:py-12">
      <div className="w-full max-w-md animate-gentle-rise">
        <RoleBasedRedirect />

        <div className="text-center mb-8">
          <div className="inline-flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-surface-leaf text-4xl sm:text-5xl shadow-sm mb-4">
            🌾
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Welcome Back</h1>
          <p className="text-base sm:text-lg text-muted-foreground">Sign in to your Farm Market account</p>
        </div>

        <Card className="rounded-2xl border-2 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="emailOrPhone" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  Email or Phone Number
                </label>
                <Input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  required
                  placeholder="email@example.com or +233201234567"
                  className="h-12 rounded-xl text-base"
                />
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
                    placeholder="Enter your password"
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
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm font-medium text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" variant="farm" size="lg" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="size-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-5" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/create-account" className="font-semibold text-primary hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerLogin;
