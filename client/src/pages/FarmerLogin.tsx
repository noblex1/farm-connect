import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, Phone, Sprout } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/marketApi";
import { sessionStore } from "@/lib/session";
import type { UserRole } from "@/types/api";

const loginSchema = z.object({
  phoneNumber: z.string().trim().regex(/^\+?[0-9]{9,15}$/, "Enter a valid phone number"),
});

const FarmerLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const requestedRole = (searchParams.get("role") as UserRole | null) || "farmer";
  const nextPath = searchParams.get("next");
  const roleLabel = requestedRole === "buyer" ? "Buyer" : "Farmer";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({ phoneNumber: String(form.get("phoneNumber") || "") });

    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.phoneNumber?.[0] || "Enter phone number");
      return;
    }

    try {
      const response = await loginUser({ phoneNumber: parsed.data.phoneNumber });

      if (requestedRole && response.user.role !== requestedRole) {
        setError(`This number is registered as ${response.user.role}. Please use a ${roleLabel.toLowerCase()} account.`);
        return;
      }

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

      setError("");
      const homeByRole: Record<string, string> = {
        farmer: "/farmer",
        buyer: "/buyer",
        admin: "/prices",
      };
      navigate(nextPath || homeByRole[response.user.role] || "/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Login failed");
    }
  };

  return (
    <section className="animate-gentle-rise">
      <header className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
        <div className="mb-3 grid size-16 place-items-center rounded-2xl bg-card text-4xl shadow-touch" aria-hidden="true">
          ???????
        </div>
        <h1 className="text-4xl font-black">{roleLabel} Login</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Use your phone number</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2">
            <Phone className="size-6 text-secondary" />Phone Number
          </span>
          <Input name="phoneNumber" required placeholder="+233201234567" className="min-h-16 rounded-2xl text-xl font-bold" />
          {error && <span className="text-base font-bold text-destructive">{error}</span>}
        </label>

        <Button type="submit" variant="farm" size="touch">
          <LogIn className="size-7" />Login
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
