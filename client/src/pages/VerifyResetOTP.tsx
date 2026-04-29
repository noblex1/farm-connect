import { FormEvent, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyPasswordResetOTP, requestPasswordReset } from "@/services/marketApi";
import { useToast } from "@/hooks/use-toast";

const VerifyResetOTP = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const email = searchParams.get("email") || "";

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const response = await verifyPasswordResetOTP({ email, otp });

      toast({
        title: "OTP verified!",
        description: "You can now reset your password.",
      });

      // Navigate to reset password page with reset token
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${response.resetToken}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Verification failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      await requestPasswordReset({ email });

      toast({
        title: "OTP sent!",
        description: "A new OTP has been sent to your email.",
      });

      setCountdown(60);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <header className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
        <div className="mb-3 grid size-16 place-items-center rounded-2xl bg-card text-4xl shadow-touch" aria-hidden="true">
          📧
        </div>
        <h1 className="text-4xl font-black">Verify Reset Code</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">
          We sent a 6-digit code to <span className="text-primary">{email}</span>
        </p>
      </header>

      <form onSubmit={handleVerify} className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <Mail className="size-6 text-primary" />Enter OTP
          </span>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            placeholder="000000"
            className="min-h-16 rounded-2xl text-center text-2xl font-bold tracking-widest"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </label>

        {error && <span className="text-base font-bold text-destructive">{error}</span>}

        <Button type="submit" variant="farm" size="touch" disabled={isLoading || otp.length !== 6}>
          <CheckCircle2 className="size-7" />
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </Button>

        <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
          <span className="text-sm font-bold text-muted-foreground">Didn't receive the code?</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={isResending || countdown > 0}
            className="font-bold"
          >
            <RefreshCw className={`size-4 ${isResending ? "animate-spin" : ""}`} />
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </Button>
        </div>

        <p className="text-center text-sm font-semibold text-muted-foreground">
          The OTP will expire in 10 minutes
        </p>
      </form>
    </section>
  );
};

export default VerifyResetOTP;
