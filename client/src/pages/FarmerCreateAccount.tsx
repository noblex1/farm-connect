import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Mail, MessageCircle, Phone, Sprout, UserRound } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const farmerAccountSchema = z.object({
  name: z.string().trim().min(2, "Enter farmer name").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a good email").max(120, "Email is too long"),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{9,18}$/, "Enter a good phone number"),
  whatsapp: z.string().trim().regex(/^\+?[0-9\s-]{9,18}$/, "Enter a good WhatsApp number"),
});

type FarmerAccount = z.infer<typeof farmerAccountSchema>;

const FarmerCreateAccount = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<Record<keyof FarmerAccount, string>>>({});
  const [success, setSuccess] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      whatsapp: String(form.get("whatsapp") || ""),
    };
    const parsed = farmerAccountSchema.safeParse(values);

    if (!parsed.success) {
      setSuccess(false);
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        whatsapp: fieldErrors.whatsapp?.[0],
      });
      return;
    }

    localStorage.setItem("farm-market-farmer-profile", JSON.stringify(parsed.data));
    setErrors({});
    setSuccess(true);
    window.setTimeout(() => navigate("/profile"), 650);
  };

  return (
    <section className="animate-gentle-rise">
      <header className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
        <div className="mb-3 grid size-16 place-items-center rounded-2xl bg-card text-4xl shadow-touch" aria-hidden="true">🌾</div>
        <h1 className="text-4xl font-black">Create Account</h1>
        <p className="mt-2 text-xl font-bold text-muted-foreground">Farmer contact details</p>
      </header>

      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-3xl border bg-surface-leaf p-4 text-xl font-black text-primary shadow-touch" role="status">
          <CheckCircle2 className="size-8" aria-hidden="true" />Account saved
        </div>
      )}

      <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border bg-card p-4 shadow-touch md:p-6">
        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2"><UserRound className="size-6 text-primary" />Full Name</span>
          <Input name="name" required placeholder="Amina Yakubu" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.name && <span className="text-base font-bold text-destructive">{errors.name}</span>}
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2"><Mail className="size-6 text-secondary" />Email</span>
          <Input name="email" required type="email" placeholder="amina@example.com" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.email && <span className="text-base font-bold text-destructive">{errors.email}</span>}
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2"><Phone className="size-6 text-primary" />Phone Number</span>
          <Input name="phone" required inputMode="tel" placeholder="+233 20 123 4567" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.phone && <span className="text-base font-bold text-destructive">{errors.phone}</span>}
        </label>

        <label className="grid gap-2 text-lg font-black">
          <span className="flex items-center gap-2"><MessageCircle className="size-6 text-primary" />WhatsApp Number</span>
          <Input name="whatsapp" required inputMode="tel" placeholder="+233 24 123 4567" className="min-h-16 rounded-2xl text-xl font-bold" />
          {errors.whatsapp && <span className="text-base font-bold text-destructive">{errors.whatsapp}</span>}
        </label>

        <Button type="submit" variant="farm" size="touch" className="mt-2">
          <Sprout className="size-7" />Create Account
        </Button>
        <Button asChild variant="outline" size="touch">
          <Link to="/login">Login instead</Link>
        </Button>
      </form>
    </section>
  );
};

export default FarmerCreateAccount;