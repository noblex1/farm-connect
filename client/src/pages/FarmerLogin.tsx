import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Phone, Sprout } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  contact: z.string().trim().min(6, "Enter email or phone").max(120, "Too long"),
});

const FarmerLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({ contact: String(form.get("contact") || "") });

    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.contact?.[0] || "Enter email or phone");
      return;
    }

    setError("");
    navigate("/profile");
  };

  return (
    <section className="animate-gentle-rise">
      <header className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
        <div className="mb-3 grid size-16 place-items-center rounded-2xl bg-card text-4xl shadow-touch" aria-hidden="true">👩🏾‍🌾</div>
        <h1 className="text-4xl font-black">Farmer Login</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Use email or phone</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2"><Mail className="size-6 text-primary" /><Phone className="size-6 text-secondary" />Email or Phone</span>
          <Input name="contact" required placeholder="amina@example.com" className="min-h-16 rounded-2xl text-xl font-bold" />
          {error && <span className="text-base font-bold text-destructive">{error}</span>}
        </label>

        <Button type="submit" variant="farm" size="touch">
          <LogIn className="size-7" />Login
        </Button>
        <Button asChild variant="harvest" size="touch">
          <Link to="/create-account"><Sprout className="size-7" />Create Account</Link>
        </Button>
      </form>
    </section>
  );
};

export default FarmerLogin;