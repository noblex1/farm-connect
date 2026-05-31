import { FormEvent, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyRegistrationOTP, resendRegistrationOTP } from "@/services/marketApi";
import { sessionStore } from "@/lib/session";
import { getRoleHomePath } from "@/lib/roleHome";
import { useToast } from "@/hooks/use-toast";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  // Get registration data from URL params
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const password = searchParams.get("password") || "";
  const role = searchParams.get("role") || "farmer";
  const location = searchParams.get("location") || "";

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/create-account");
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
      const response = await verifyRegistrationOTP({
        email,
        otp,
        name,
        phoneNumber: phone,
        password,
        role,
        location,
      });

      // Store authentication data
      sessionStore.setToken(response.token);
      sessionStore.setUser(response.user);

      localStorage.setItem(
        "farm-market-farmer-profile",
        JSON.stringify({
          name: response.user.name,
          phone: response.user.phoneNumber,
          whatsapp: response.user.phoneNumber,
          email: response.user.email,
        })
      );

      // Invalidate and refetch user query to update UI immediately
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.setQueryData(["currentUser", response.token], { user: response.user });

      toast({
        title: "Account verified!",
        description: `Welcome to Farm Market, ${response.user.name.split(" ")[0]}!`,
      });

      window.location.href = getRoleHomePath(response.user.role);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Verification failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      await resendRegistrationOTP({ email, name });
      
      toast({
        title: "OTP sent!",
        description: "A new OTP has been sent to your email.",
      });

      setCountdown(60); // 60 second cooldown
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <header className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-surface-leaf p-4 sm:p-5 shadow-touch">
        <div className="mb-3 grid size-14 sm:size-16 place-items-center rounded-2xl bg-card text-3xl sm:text-4xl shadow-touch" aria-hidden="true">
          📧
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Verify Your Email</h1>
        <p className="mt-1.5 sm:mt-2 text-sm sm:text-xl font-bold text-muted-foreground break-all">
          We sent a 6-digit code to <span className="text-primary">{email}</span>
        </p>
      </header>

      <form onSubmit={handleVerify} className="grid gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 shadow-touch">
        <label className="grid gap-2 text-base sm:text-lg font-black">
          <span className="flex items-center gap-2">
            <Mail className="size-6 text-primary" />Enter OTP
          </span>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            placeholder="000000"
            className="min-h-14 sm:min-h-16 rounded-2xl text-center text-xl sm:text-2xl font-bold tracking-widest"
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

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-muted p-3 sm:p-4">
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

export default VerifyOTP;
