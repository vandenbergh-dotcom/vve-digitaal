"use client";

import Link from "next/link";
import { useState } from "react";
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
  TrendingUp,
  AlertCircle,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Rocket,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Totaal eenheden", value: "24", icon: Building2, change: null },
  { label: "Actieve leden", value: "18", icon: Users, change: "+2 deze maand" },
  { label: "Reservefonds", value: "\u20ac12.450", icon: Wallet, change: "+\u20ac850" },
  { label: "Openstaand", value: "\u20ac100", icon: Receipt, change: null },
];

const recentActivity = [
  { type: "invoice", text: "Factuur VVE-2026-0004 betaald door Emma Mulder", time: "1 uur geleden", icon: Receipt },
  { type: "payment", text: "Maandelijkse bijdrage ontvangen van Box 12", time: "2 uur geleden", icon: Wallet },
  { type: "invoice", text: "2 facturen achterstallig: Maria Jansen, Pieter Bakker", time: "3 uur geleden", icon: AlertTriangle },
  { type: "maintenance", text: "Onderhoudsverzoek: Verlichting parkeergarage", time: "5 uur geleden", icon: Wrench },
  { type: "vote", text: "Stemming gestart: Vervanging garagedeuren", time: "1 dag geleden", icon: Vote },
  { type: "document", text: "Notulen ALV 2025 geupload", time: "2 dagen geleden", icon: FileText },
];

const quickActions = [
  { label: "Facturen versturen", href: "/dashboard/facturen", icon: Receipt },
  { label: "Vergadering plannen", href: "/dashboard/vergaderingen", icon: Calendar },
  { label: "Stemming starten", href: "/dashboard/stemmen", icon: Vote },
  { label: "Onderhoud melden", href: "/dashboard/onderhoud", icon: Wrench },
  { label: "Document uploaden", href: "/dashboard/documenten", icon: FileText },
  { label: "AI Assistent", href: "/dashboard/ai-assistent", icon: MessageSquare },
];

const setupChecklist = [
  { id: "vve", label: "VvE gegevens ingevuld", done: true, href: "/dashboard/instellingen" },
  { id: "members", label: "Leden toegevoegd", done: true, href: "/dashboard/leden" },
  { id: "iban", label: "IBAN en financieel ingesteld", done: true, href: "/dashboard/instellingen" },
  { id: "document", label: "Splitsingsakte geupload", done: false, href: "/dashboard/documenten" },
  { id: "invoice", label: "Eerste facturen verstuurd", done: false, href: "/dashboard/facturen" },
];

export default function DashboardPage() {
  const { user, currentVvE } = useVvE();
  const [showChecklist, setShowChecklist] = useState(true);
  const completedCount = setupChecklist.filter((s) => s.done).length;
  const displayName = user?.full_name || user?.email?.split("@")[0] || "Gebruiker";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welkom terug, {displayName}</h1>
        <p className="text-muted-foreground">{currentVvE?.name || "Laden..."} - Overzicht</p>
      </div>

      {/* Getting Started Checklist */}
      {showChecklist && completedCount < setupChecklist.length && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Aan de slag met VvE Digitaal</p>
                  <p className="text-xs text-blue-600">{completedCount} van {setupChecklist.length} stappen voltooid</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-400 hover:text-blue-600" onClick={() => setShowChecklist(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${(completedCount / setupChecklist.length) * 100}%` }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {setupChecklist.map((item) => (
                <Link key={item.id} href={item.href}>
                  <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${item.done ? "opacity-60" : "hover:bg-white/60"}`}>
                    {item.done ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-blue-400 shrink-0" />
                    )}
                    <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-blue-900"}`}>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      <div className="space-y-2">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                2 facturen zijn achterstallig (totaal &euro;100) - Maria Jansen, Pieter Bakker
              </p>
            </div>
            <Link href="/dashboard/facturen">
              <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                Bekijken
              </Button>
            </Link>
          </CardContent>
        </Card>
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
      </div>

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
