"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Vul alle velden in.");
      return;
    }
    if (password.length < 8) {
      toast.error("Wachtwoord moet minimaal 8 tekens zijn.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Dit e-mailadres is al in gebruik. Probeer in te loggen.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      // If email confirmation is required, user gets a session but needs to confirm
      if (data?.user && !data.session) {
        toast.success("Account aangemaakt! Controleer uw e-mail om te bevestigen.");
        router.push("/login");
        return;
      }

      // Auto-confirmed: go straight to onboarding
      toast.success("Welkom bij VvE App!");
      router.push("/dashboard/onboarding");
      router.refresh();
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-2 text-white">
          <Building2 className="h-8 w-8" />
          <span className="text-xl font-bold">VvE App</span>
        </div>
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-4">
            Begin vandaag met slim VvE beheer
          </h2>
          <p className="text-emerald-100 text-lg">
            Gratis voor kleine VvE&apos;s. Geen creditcard nodig. In 5 minuten actief.
          </p>
        </div>
        <p className="text-emerald-200 text-sm">
          &copy; {new Date().getFullYear()} VvE App
        </p>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <Building2 className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold">VvE App</span>
            </div>
            <CardTitle className="text-2xl">Account aanmaken</CardTitle>
            <CardDescription>Start met het digitaliseren van uw VvE</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Volledige naam</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Uw naam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="uw@email.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimaal 8 tekens"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gratis registreren
              </Button>
            </form>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Door te registreren gaat u akkoord met onze voorwaarden.
            </p>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Al een account?{" "}
              <Link href="/login" className="text-emerald-600 hover:underline font-medium">
                Inloggen
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
