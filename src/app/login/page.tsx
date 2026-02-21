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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message === "Invalid login credentials"
          ? "Ongeldige inloggegevens. Controleer uw e-mail en wachtwoord."
          : error.message
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-2 text-white">
          <Building2 className="h-8 w-8" />
          <span className="text-xl font-bold">VvE Digitaal</span>
        </div>
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-4">
            De slimste VvE beheerder is geen persoon
          </h2>
          <p className="text-blue-100 text-lg">
            AI-gestuurd VvE beheer dat het werk voor u doet. Van notulen tot jaarverslag, van stemmen tot onderhoud.
          </p>
        </div>
        <p className="text-blue-200 text-sm">
          &copy; {new Date().getFullYear()} VvE Digitaal
        </p>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">VvE Digitaal</span>
            </div>
            <CardTitle className="text-2xl">Welkom terug</CardTitle>
            <CardDescription>Log in op uw VvE Digitaal account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Uw wachtwoord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Inloggen
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Nog geen account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                Registreer gratis
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
