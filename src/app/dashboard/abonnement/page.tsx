"use client";

import { useState } from "react";
import {
  CreditCard,
  Check,
  Zap,
  Building2,
  Crown,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useVvE } from "@/lib/vve-context";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "Gratis",
    period: "",
    icon: Building2,
    description: "Voor kleine VvE's tot 4 eenheden",
    features: [
      "Tot 4 eenheden",
      "Leden- en eenhedenadministratie",
      "Facturen aanmaken en versturen",
      "Betalingsoverzicht",
      "Documentopslag (100 MB)",
      "Basis financieel overzicht",
    ],
    maxUnits: 4,
  },
  {
    id: "plus",
    name: "Plus",
    price: "\u20ac19",
    period: "/maand",
    icon: Zap,
    description: "Voor actieve VvE's tot 20 eenheden",
    features: [
      "Tot 20 eenheden",
      "Alles van Starter",
      "Onbeperkt AI-assistent",
      "Digitaal stemmen",
      "AI notulen & jaarverslag",
      "Onderhoud & MJOP",
      "E-mail notificaties",
    ],
    maxUnits: 20,
  },
  {
    id: "professional",
    name: "Professional",
    price: "\u20ac49",
    period: "/maand",
    icon: Crown,
    description: "Voor grotere VvE's en beheerders",
    features: [
      "Onbeperkt eenheden",
      "Alles van Plus",
      "Meerdere VvE's beheren",
      "Automatische herinneringen",
      "Geavanceerde rapportages",
      "Prioriteit support",
    ],
    maxUnits: Infinity,
  },
];

export default function AbonnementPage() {
  const { currentVvE, user } = useVvE();
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const currentPlan = currentVvE?.subscription_plan || "starter";
  const status = currentVvE?.subscription_status || "active";

  async function handleSubscribe(planId: string) {
    if (planId === "starter") return;
    setSubscribing(planId);
    try {
      const res = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          vve_id: currentVvE?.id,
          vve_name: currentVvE?.name,
          customer_email: user?.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.simulated) {
          toast.success(`Abonnement ${planId} zou geactiveerd worden (demo modus).`);
        } else if (data.checkout_url) {
          window.location.href = data.checkout_url;
        }
      } else {
        toast.error(data.error || "Er is een fout opgetreden.");
      }
    } catch {
      toast.error("Er is een fout opgetreden.");
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <CreditCard className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Abonnement</h1>
          <p className="text-sm text-muted-foreground">Beheer uw VvE App abonnement</p>
        </div>
      </div>

      {/* Current Plan */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-sm px-3 py-1">
                {plans.find((p) => p.id === currentPlan)?.name || "Starter"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {status === "active" ? "Actief" : status === "trial" ? "Proefperiode" : "Inactief"}
              </span>
            </div>
            <p className="text-sm font-medium">
              {plans.find((p) => p.id === currentPlan)?.price || "Gratis"}
              {plans.find((p) => p.id === currentPlan)?.period || ""}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isPopular = plan.id === "plus";
          const Icon = plan.icon;

          return (
            <Card key={plan.id} className={`relative ${isPopular ? "border-blue-600 border-2 shadow-lg" : ""} ${isCurrent ? "ring-2 ring-green-500" : ""}`}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600">Meest gekozen</Badge>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-600">Huidig plan</Badge>
                </div>
              )}
              <CardHeader className="pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    <Check className="mr-2 h-4 w-4" />
                    Huidig plan
                  </Button>
                ) : plan.id === "starter" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Gratis
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing === plan.id}
                  >
                    {subscribing === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Upgraden naar {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Betaalinformatie</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Betalingen worden maandelijks via iDEAL geincasseerd via Mollie.</p>
          <p>U kunt op elk moment opzeggen. Na opzegging blijft uw account actief tot het einde van de betaalperiode.</p>
          <p>Het Starter plan is altijd gratis voor VvE's tot 4 eenheden.</p>
        </CardContent>
      </Card>
    </div>
  );
}
