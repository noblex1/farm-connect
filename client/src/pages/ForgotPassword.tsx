import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/services/marketApi";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const parsed = emailSchema.safeParse({
      email: String(form.get("email") || ""),
    });

    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.email?.[0] || "Please enter a valid email");
      setIsLoading(false);
      return;
    }

    try {
      await requestPasswordReset({ email: parsed.data.email });

      toast({
        title: "OTP sent!",
        description: "Check your email for the password reset code.",
      });

      // Navigate to verify reset OTP page
      navigate(`/verify-reset-otp?email=${encodeURIComponent(parsed.data.email)}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to send reset code. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <header className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-surface-leaf p-4 sm:p-5 shadow-touch">
        <div className="mb-3 grid size-14 sm:size-16 place-items-center rounded-2xl bg-card text-3xl sm:text-4xl shadow-touch" aria-hidden="true">
          🔐
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Forgot Password</h1>
        <p className="mt-1.5 sm:mt-2 text-base sm:text-xl font-bold text-muted-foreground">
          Enter your email to receive a reset code
        </p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 shadow-touch">
        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <Mail className="size-6 text-secondary" />Email Address
          </span>
          <Input
            name="email"
            type="email"
            required
            placeholder="your-email@example.com"
            className="min-h-14 sm:min-h-16 rounded-2xl text-base sm:text-xl font-bold"
          />
        </label>

        {error && <span className="text-base font-bold text-destructive">{error}</span>}

        <Button type="submit" variant="farm" size="touch" disabled={isLoading}>
          <Mail className="size-7" />
          {isLoading ? "Sending..." : "Send Reset Code"}
        </Button>

        <Button asChild variant="outline" size="touch">
          <Link to="/login">
            <ArrowLeft className="size-7" />
            Back to Login
          </Link>
        </Button>
      </form>
    </section>
  );
};

export default ForgotPassword;
