"use client";

import Link from "next/link";
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
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Totaal eenheden", value: "24", icon: Building2, change: null },
  { label: "Actieve leden", value: "18", icon: Users, change: "+2 deze maand" },
  { label: "Reservefonds", value: "\u20ac12.450", icon: Wallet, change: "+\u20ac850" },
  { label: "Open verzoeken", value: "3", icon: Wrench, change: null },
];

const recentActivity = [
  { type: "payment", text: "Maandelijkse bijdrage ontvangen van Box 12", time: "2 uur geleden", icon: Wallet },
  { type: "maintenance", text: "Onderhoudsverzoek: Verlichting parkeergarage", time: "5 uur geleden", icon: Wrench },
  { type: "vote", text: "Stemming gestart: Vervanging garagedeuren", time: "1 dag geleden", icon: Vote },
  { type: "document", text: "Notulen ALV 2025 geupload", time: "2 dagen geleden", icon: FileText },
  { type: "member", text: "Nieuw lid: Jan de Vries (Box 7)", time: "3 dagen geleden", icon: Users },
];

const quickActions = [
  { label: "Vergadering plannen", href: "/dashboard/vergaderingen", icon: Calendar },
  { label: "Stemming starten", href: "/dashboard/stemmen", icon: Vote },
  { label: "Onderhoud melden", href: "/dashboard/onderhoud", icon: Wrench },
  { label: "Document uploaden", href: "/dashboard/documenten", icon: FileText },
  { label: "AI Assistent", href: "/dashboard/ai-assistent", icon: MessageSquare },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welkom terug, Hidde</h1>
        <p className="text-muted-foreground">Garagepark De Linden - Overzicht</p>
      </div>

      {/* Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="flex items-center gap-3 py-3">
          <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-800">
              Er staat een stemming open: &quot;Vervanging garagedeuren&quot; - nog 5 dagen
            </p>
          </div>
          <Link href="/dashboard/stemmen">
            <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
              Bekijken
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-blue-600" />
                {stat.change && (
                  <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recente activiteit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Snelle acties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Button variant="ghost" className="w-full justify-between h-auto py-3">
                    <span className="flex items-center gap-3">
                      <action.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{action.label}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
