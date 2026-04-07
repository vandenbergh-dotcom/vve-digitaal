"use client";

import Link from "next/link";
import { useVvE } from "@/lib/vve-context";
import {
  Building2,
  Users,
  Wallet,
  Wrench,
  Calendar,
  Vote,
  FileText,
  MessageSquare,
  ArrowRight,
  Receipt,
  Circle,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const setupChecklist = [
  { id: "vve", label: "VvE aanmaken via onboarding", href: "/dashboard/onboarding" },
  { id: "members", label: "Leden toevoegen", href: "/dashboard/leden" },
  { id: "iban", label: "IBAN en financieel instellen", href: "/dashboard/instellingen" },
  { id: "document", label: "Splitsingsakte uploaden", href: "/dashboard/documenten" },
  { id: "invoice", label: "Eerste facturen versturen", href: "/dashboard/facturen" },
];

export default function DashboardPage() {
  const { user, currentVvE } = useVvE();
  const displayName = user?.full_name || user?.email?.split("@")[0] || "Gebruiker";
  const hasVvE = !!currentVvE;

  const quickActions = [
    { label: "Facturen versturen", href: "/dashboard/facturen", icon: Receipt },
    { label: "Vergadering plannen", href: "/dashboard/vergaderingen", icon: Calendar },
    { label: "Stemming starten", href: "/dashboard/stemmen", icon: Vote },
    { label: "Onderhoud melden", href: "/dashboard/onderhoud", icon: Wrench },
    { label: "Document uploaden", href: "/dashboard/documenten", icon: FileText },
    { label: "AI Assistent", href: "/dashboard/ai-assistent", icon: MessageSquare },
  ];

  // No VvE yet - show onboarding prompt
  if (!hasVvE) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welkom, {displayName}</h1>
          <p className="text-muted-foreground">Laten we uw VvE instellen</p>
        </div>

        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-900">Aan de slag met VvE App</p>
                <p className="text-sm text-emerald-600">Volg deze stappen om uw VvE in te richten</p>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              {setupChecklist.map((item) => (
                <Link key={item.id} href={item.href}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/60 transition-colors">
                    <Circle className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">{item.label}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/dashboard/onboarding">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Rocket className="mr-2 h-4 w-4" />
                Start de onboarding
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Has VvE - show real dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welkom terug, {displayName}</h1>
        <p className="text-muted-foreground">{currentVvE.name} - Overzicht</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold">{currentVvE.total_units}</p>
            <p className="text-sm text-muted-foreground">Totaal eenheden</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-muted-foreground">Actieve leden</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-muted-foreground">Reservefonds</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-muted-foreground">Openstaand</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Snelle acties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Button variant="outline" className="w-full justify-start h-auto py-3">
                  <action.icon className="h-4 w-4 text-emerald-600 mr-2" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
