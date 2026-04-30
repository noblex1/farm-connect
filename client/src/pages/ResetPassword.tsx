import { FormEvent, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/services/marketApi";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const email = searchParams.get("email") || "";
  const resetToken = searchParams.get("token") || "";

  // Redirect if no email or token
  useEffect(() => {
    if (!email || !resetToken) {
      navigate("/forgot-password");
    }
  }, [email, resetToken, navigate]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const parsed = passwordSchema.safeParse({
      newPassword: String(form.get("newPassword") || ""),
      confirmPassword: String(form.get("confirmPassword") || ""),
    });

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setError(errors.newPassword?.[0] || errors.confirmPassword?.[0] || "Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword({
        email,
        resetToken,
        newPassword: parsed.data.newPassword,
      });

      toast({
        title: "Password reset successful!",
        description: "You can now login with your new password.",
      });

      // Navigate to login page
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to reset password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <header className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-surface-leaf p-4 sm:p-5 shadow-touch">
        <div className="mb-3 grid size-14 sm:size-16 place-items-center rounded-2xl bg-card text-3xl sm:text-4xl shadow-touch" aria-hidden="true">
          🔑
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Reset Password</h1>
        <p className="mt-1.5 sm:mt-2 text-base sm:text-xl font-bold text-muted-foreground">
          Create a new password for your account
        </p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 shadow-touch">
        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <Lock className="size-6 text-primary" />New Password
          </span>
          <div className="relative">
            <Input
              name="newPassword"
              type={showPassword ? "text" : "password"}
              required
              placeholder="At least 6 characters"
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

        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <Lock className="size-6 text-primary" />Confirm Password
          </span>
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Re-enter your password"
              className="min-h-14 sm:min-h-16 rounded-2xl pr-14 text-base sm:text-xl font-bold"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
            </button>
          </div>
        </label>

        {error && <span className="text-base font-bold text-destructive">{error}</span>}

        <Button type="submit" variant="farm" size="touch" disabled={isLoading}>
          <CheckCircle2 className="size-7" />
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </section>
  );
};

export default ResetPassword;
