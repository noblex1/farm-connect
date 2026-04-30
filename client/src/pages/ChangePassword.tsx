import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/services/apiClient";

type Step = "verify-identity" | "verify-otp" | "new-password";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { data } = useCurrentUser();
  const { toast } = useToast();
  const user = data?.user;

  const [step, setStep] = useState<Step>("verify-identity");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiClient.post("/api/otp/forgot-password", { email });
      
      toast({
        title: "OTP Sent!",
        description: "Check your email for the verification code.",
      });

      setStep("verify-otp");
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setStep("new-password");
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/api/otp/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast({
        title: "Password Changed!",
        description: "Your password has been updated successfully.",
      });

      navigate("/settings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setIsLoading(true);

    try {
      await apiClient.post("/api/otp/forgot-password", { email });
      
      toast({
        title: "OTP Resent!",
        description: "A new verification code has been sent to your email.",
      });

      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="animate-gentle-rise">
      <Button
        variant="ghost"
        onClick={() => step === "verify-identity" ? navigate("/settings") : setStep("verify-identity")}
        className="mb-4"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back
      </Button>

      <header className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-surface-leaf p-4 sm:p-5 shadow-touch">
        <div className="mb-3 grid size-14 sm:size-16 place-items-center rounded-2xl bg-card text-3xl sm:text-4xl shadow-touch">
          🔒
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">Change Password</h1>
        <p className="mt-1.5 sm:mt-2 text-base sm:text-lg md:text-xl font-bold text-muted-foreground">
          {step === "verify-identity" && "Verify your identity"}
          {step === "verify-otp" && "Enter verification code"}
          {step === "new-password" && "Set your new password"}
        </p>
      </header>

      {error && (
        <Card className="mb-4 rounded-2xl sm:rounded-3xl border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-sm font-bold text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Verify Identity */}
      {step === "verify-identity" && (
        <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="text-lg sm:text-xl">Verify Your Email</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              We'll send a verification code to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Mail className="size-5 text-primary" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  disabled={!!user?.email}
                  className="min-h-12 sm:min-h-14 rounded-xl text-base"
                />
              </div>

              <Button
                type="submit"
                variant="farm"
                size="touch"
                disabled={isLoading}
                className="w-full"
              >
                <Mail className="size-5" />
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Verify OTP */}
      {step === "verify-otp" && (
        <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="text-lg sm:text-xl">Enter Verification Code</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              We sent a 6-digit code to <span className="font-bold text-primary">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold">Verification Code</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  required
                  className="min-h-12 sm:min-h-14 rounded-xl text-center text-xl font-bold tracking-widest"
                />
              </div>

              <Button
                type="submit"
                variant="farm"
                size="touch"
                disabled={otp.length !== 6}
                className="w-full"
              >
                Verify Code
              </Button>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
                <span className="text-sm text-muted-foreground">Didn't receive the code?</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOTP}
                  disabled={isLoading || countdown > 0}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: New Password */}
      {step === "new-password" && (
        <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="text-lg sm:text-xl">Set New Password</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Lock className="size-5 text-primary" />
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="min-h-12 sm:min-h-14 rounded-xl text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Lock className="size-5 text-primary" />
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="min-h-12 sm:min-h-14 rounded-xl text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-leaf">
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>

              <Button
                type="submit"
                variant="farm"
                size="touch"
                disabled={isLoading}
                className="w-full"
              >
                <Lock className="size-5" />
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default ChangePassword;
