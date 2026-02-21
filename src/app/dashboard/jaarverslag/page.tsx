"use client";

import { BarChart3, Brain, Download, Printer, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const demoReport = {
  year: 2025,
  status: "draft" as const,
  totalIncome: 14400,
  totalExpenses: 11200,
  reserveBalance: 11950,
  contributions: 14400,
  expenses: {
    onderhoud: 4350,
    energie: 1740,
    verzekering: 3560,
    schoonmaak: 1200,
    overig: 350,
  },
  keyDecisions: [
    "Begroting 2026 goedgekeurd (15 voor, 1 tegen)",
    "Vervanging garagedeuren sectie A goedgekeurd (\u20ac18.000)",
    "Maandelijkse storting reservefonds verhoogd naar \u20ac500",
    "Nieuw huishoudelijk reglement vastgesteld",
  ],
  maintenanceCompleted: [
    "Reparatie garagedeur box 12 (\u20ac375)",
    "Vervanging TL-verlichting sectie A (\u20ac280)",
    "Graffiti verwijdering buitenmuur (\u20ac175)",
    "Jaarlijkse schoorsteenreiniging riolering (\u20ac450)",
  ],
  aiSummary: "Het boekjaar 2025 is positief afgesloten met een overschot van \u20ac3.200. De totale inkomsten bedroegen \u20ac14.400, voornamelijk uit maandelijkse bijdragen van de 24 eigenaren (\u20ac50/maand/eenheid). De uitgaven (\u20ac11.200) bleven binnen de begroting. De grootste kostenposten waren onderhoud (\u20ac4.350) en verzekering (\u20ac3.560).\n\nHet reservefonds is gegroeid naar \u20ac11.950. Met de besloten verhoging van de maandelijkse storting naar \u20ac500 zal het fonds in 2026 sneller groeien ter voorbereiding op de vervanging van de garagedeuren in sectie A.\n\nBelangrijkste besluit: goedkeuring van het plan om de garagedeuren in sectie A te vervangen voor \u20ac18.000. Dit project start in Q2 2026.\n\nAanbeveling: overweeg een periodieke beoordeling van de energiekosten. Met de overstap naar LED-verlichting (gepland in MJOP voor 2027) kan tot 60% op energiekosten worden bespaard.",
};

export default function JaarverslagPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Jaarverslag
          </h1>
          <p className="text-muted-foreground">Jaarlijks overzicht van uw VvE</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="2025">
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Brain className="mr-2 h-4 w-4" />
            Genereer met AI
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporteer PDF
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Status */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-orange-300 text-orange-700">Concept</Badge>
            <span className="text-sm">Dit jaarverslag is nog niet goedgekeurd door de ALV</span>
          </div>
          <Button size="sm">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            Goedkeuren
          </Button>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Totale inkomsten</p>
            <p className="text-2xl font-bold text-green-600">&euro;{demoReport.totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Totale uitgaven</p>
            <p className="text-2xl font-bold text-red-600">&euro;{demoReport.totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Resultaat</p>
            <p className="text-2xl font-bold text-blue-600">&euro;{(demoReport.totalIncome - demoReport.totalExpenses).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Reservefonds (31-12)</p>
            <p className="text-2xl font-bold text-purple-600">&euro;{demoReport.reserveBalance.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Uitgaven per categorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(demoReport.expenses).map(([cat, amount]) => {
              const maxAmount = Math.max(...Object.values(demoReport.expenses));
              const pct = (amount / maxAmount) * 100;
              const catLabels: Record<string, string> = {
                onderhoud: "Onderhoud", energie: "Energie", verzekering: "Verzekering",
                schoonmaak: "Schoonmaak", overig: "Overig",
              };
              return (
                <div key={cat} className="flex items-center gap-4">
                  <span className="text-sm w-28">{catLabels[cat]}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full flex items-center pl-3" style={{ width: `${pct}%` }}>
                      <span className="text-xs text-white font-medium">&euro;{amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Key Decisions */}
        <Card>
          <CardHeader>
            <CardTitle>Belangrijkste besluiten</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {demoReport.keyDecisions.map((decision, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  {decision}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Maintenance Completed */}
        <Card>
          <CardHeader>
            <CardTitle>Uitgevoerd onderhoud</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {demoReport.maintenanceCompleted.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle>AI Samenvatting</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50/50 rounded-lg p-4">
            {demoReport.aiSummary.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-sm text-muted-foreground mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-center text-sm text-muted-foreground">
        Jaarverslag {demoReport.year} - VvE Garagepark De Linden - Gegenereerd door VvE Digitaal
      </p>
    </div>
  );
}
