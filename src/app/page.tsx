"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Building2,
  Brain,
  FileText,
  Vote,
  Calculator,
  Wrench,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Euro,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronRight,
  Receipt,
  Users,
  Zap,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Receipt,
    title: "Facturen & Betalingen",
    description: "Genereer facturen in bulk, verstuur per e-mail, ontvang betalingen via iDEAL. Zie in een oogopslag wie heeft betaald.",
  },
  {
    icon: Brain,
    title: "AI Assistent",
    description: "Stel vragen over uw splitsingsakte, huishoudelijk reglement of VvE-wetgeving. Direct antwoord, 24/7.",
  },
  {
    icon: FileText,
    title: "Documenten & Notulen",
    description: "Upload documenten, laat AI notulen genereren en doorzoek alles met natuurlijke taal.",
  },
  {
    icon: Vote,
    title: "Digitaal Stemmen",
    description: "Organiseer stemmingen online. Automatische quorum-berekening en resultaatverwerking.",
  },
  {
    icon: Calculator,
    title: "Financieel Beheer",
    description: "Bijdragen, uitgaven, reservefonds. AI categoriseert automatisch en signaleert afwijkingen.",
  },
  {
    icon: Wrench,
    title: "Onderhoud & MJOP",
    description: "Meld onderhoud, volg de status. AI helpt bij het opstellen van uw meerjarenonderhoudsplan.",
  },
];

const steps = [
  {
    step: "1",
    title: "VvE Aanmaken",
    description: "Vul uw VvE-gegevens in, stel IBAN en bijdragen in. In 5 minuten klaar.",
  },
  {
    step: "2",
    title: "Leden Uitnodigen",
    description: "Voeg eigenaren toe met hun e-mail. Iedereen krijgt direct toegang.",
  },
  {
    step: "3",
    title: "Facturen Versturen",
    description: "Genereer facturen voor alle leden in een klik. Verstuur per e-mail, volg betalingen.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "Gratis",
    period: "",
    description: "Voor kleine VvE's tot 4 eenheden",
    features: [
      "Tot 4 garageboxen/eenheden",
      "Leden- en eenhedenadministratie",
      "Facturen aanmaken en versturen",
      "Betalingsoverzicht",
      "Documentopslag (100 MB)",
      "Basis financieel overzicht",
    ],
    cta: "Gratis starten",
    popular: false,
  },
  {
    name: "Plus",
    price: "\u20ac19",
    period: "/maand",
    description: "Voor actieve VvE's tot 20 eenheden",
    features: [
      "Tot 20 eenheden",
      "Alles van Starter",
      "iDEAL betalingen",
      "Onbeperkt AI-assistent",
      "Digitaal stemmen",
      "AI notulen & jaarverslag",
      "Onderhoud & MJOP",
      "E-mail notificaties",
    ],
    cta: "14 dagen gratis proberen",
    popular: true,
  },
  {
    name: "Professional",
    price: "\u20ac49",
    period: "/maand",
    description: "Voor grotere VvE's en beheerders",
    features: [
      "Onbeperkt eenheden",
      "Alles van Plus",
      "Meerdere VvE's beheren",
      "Automatische herinneringen",
      "Geavanceerde rapportages",
      "API toegang",
      "Prioriteit support",
    ],
    cta: "Contact opnemen",
    popular: false,
  },
];

const socialProof = [
  { value: "135.000+", label: "VvE's in Nederland" },
  { value: "75%", label: "Ontevreden over beheerder" },
  { value: "90%", label: "Goedkoper dan beheerder" },
  { value: "2 min", label: "Om te starten" },
];

const comparisons = [
  { feature: "Facturen versturen", us: true, traditional: "Handmatig" },
  { feature: "Betalingen bijhouden", us: true, traditional: "Excel" },
  { feature: "Digitaal stemmen", us: true, traditional: "Vergadering" },
  { feature: "AI-gegenereerde notulen", us: true, traditional: "Handmatig" },
  { feature: "24/7 beschikbaar", us: true, traditional: "Kantooruren" },
  { feature: "Kosten per jaar (24 eenheden)", us: "\u20ac228", traditional: "\u20ac2.400+" },
];

// Animated counter
function AnimatedNumber({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState(target);
  const numericPart = target.replace(/[^0-9]/g, "");

  useEffect(() => {
    if (!numericPart) { setDisplay(target); return; }
    const targetNum = parseInt(numericPart);
    const duration = 1500;
    const steps = 30;
    const increment = targetNum / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), targetNum);
      const formatted = target.replace(numericPart, current.toLocaleString("nl-NL"));
      setDisplay(formatted);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, numericPart]);

  return <>{display}{suffix}</>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">VvE Digitaal</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Functies</a>
              <a href="#vergelijk" className="text-sm text-muted-foreground hover:text-foreground transition">Vergelijk</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">Prijzen</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Inloggen</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Gratis starten
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
                <Zap className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
                Nu live - direct aan de slag
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Uw VvE beheren{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  zonder gedoe
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Facturen versturen, betalingen bijhouden, digitaal stemmen, AI-notulen.
                Alles wat uw VvE nodig heeft in een platform. 90% goedkoper dan een beheerder.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/signup">
                  <Button size="lg" className="text-base px-8 h-12 w-full sm:w-auto">
                    Gratis starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#vergelijk">
                  <Button variant="outline" size="lg" className="text-base px-8 h-12 w-full sm:w-auto">
                    Vergelijk met beheerder
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Geen creditcard nodig
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Gratis tot 4 eenheden
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  In 5 minuten actief
                </span>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl border p-4 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gray-100 rounded-lg p-1 mb-3 flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                {/* Mini dashboard mockup */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1 bg-blue-50 rounded-lg p-3">
                      <p className="text-[10px] text-blue-600 font-medium">Openstaand</p>
                      <p className="text-lg font-bold text-blue-700">&euro;450</p>
                    </div>
                    <div className="flex-1 bg-green-50 rounded-lg p-3">
                      <p className="text-[10px] text-green-600 font-medium">Betaald</p>
                      <p className="text-lg font-bold text-green-700">&euro;2.850</p>
                    </div>
                    <div className="flex-1 bg-red-50 rounded-lg p-3">
                      <p className="text-[10px] text-red-600 font-medium">Achterstallig</p>
                      <p className="text-lg font-bold text-red-700">2</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-medium">Recente facturen</p>
                      <Badge variant="secondary" className="text-[10px] h-5">8 leden</Badge>
                    </div>
                    {["J. de Vries - Box 2", "M. Jansen - Box 3", "P. Bakker - Box 4"].map((name, i) => (
                      <div key={name} className="flex justify-between items-center py-1.5 border-b last:border-0">
                        <span className="text-xs text-muted-foreground">{name}</span>
                        <Badge variant={i === 2 ? "destructive" : "outline"} className="text-[10px] h-5">
                          {i === 2 ? "Achterstallig" : "Betaald"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium">AI Assistent</p>
                      <p className="text-blue-600">Mag ik mijn garagebox verhuren? Ja, mits u het bestuur informeert (Art. 24.3)</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-100 rounded-2xl -z-10 rotate-6" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-100 rounded-xl -z-10 -rotate-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="py-12 border-y bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {socialProof.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  <AnimatedNumber target={item.value} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Waarom 75% van de VvE's ontevreden is</h2>
            <p className="text-muted-foreground">En hoe VvE Digitaal dat oplost</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-100 bg-white">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                  <Euro className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Te duur</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Professioneel VvE beheer kost &euro;100-210 per eenheid per jaar.
                </p>
                <div className="flex items-center justify-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingDown className="h-4 w-4" />
                  VvE Digitaal: vanaf &euro;0
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-100 bg-white">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Te tijdrovend</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Vrijwillige bestuurders besteden uren aan administratie.
                </p>
                <div className="flex items-center justify-center gap-1 text-green-600 text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  AI neemt 80% over
                </div>
              </CardContent>
            </Card>
            <Card className="border-yellow-100 bg-white">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Niet transparant</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Geen inzicht in financien, besluitvorming of onderhoud.
                </p>
                <div className="flex items-center justify-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Alles online, altijd inzicht
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Alles wat uw VvE nodig heeft
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Van garageboxen tot grote appartementscomplexen. Slimme tools
              die het beheer eenvoudig maken.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="vergelijk" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              VvE Digitaal vs. traditionele beheerder
            </h2>
            <p className="text-lg text-muted-foreground">
              Dezelfde kwaliteit, een fractie van de kosten
            </p>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium">Functie</th>
                    <th className="text-center p-4 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        VvE Digitaal
                      </div>
                    </th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Traditionele beheerder</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row) => (
                    <tr key={row.feature} className="border-b">
                      <td className="p-4 text-sm">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.us === true ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-sm font-bold text-green-600">{row.us}</span>
                        )}
                      </td>
                      <td className="p-4 text-center text-sm text-muted-foreground">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              In 3 stappen aan de slag
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] border-t-2 border-dashed border-blue-200" />
                )}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold mb-6 relative z-10">
                  {step.step}
                </div>
                <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Brain className="h-3.5 w-3.5 mr-1.5" />
                AI-Assistent
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Stel elke vraag over uw VvE
              </h2>
              <p className="text-muted-foreground mb-6">
                Upload uw splitsingsakte en huishoudelijk reglement.
                Onze AI leest en begrijpt elk document en beantwoordt uw vragen
                met verwijzingen naar de juiste artikelen.
              </p>
              <div className="space-y-3">
                {[
                  "Mag ik mijn garagebox verhuren aan derden?",
                  "Wat is het quorum voor de ALV?",
                  "Wie is verantwoordelijk voor de garagedeuren?",
                  "Hoe worden de servicekosten berekend?",
                ].map((q) => (
                  <div key={q} className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-muted-foreground">{q}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border shadow-lg">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border text-sm">
                    Mag ik mijn garagebox verhuren?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Brain className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-sm">
                    <p className="mb-2">
                      Volgens uw splitsingsakte (Artikel 24, lid 3) is verhuur van uw garagebox
                      aan derden <strong>toegestaan</strong>, mits:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>U het bestuur schriftelijk informeert</li>
                      <li>De huurder zich houdt aan het huishoudelijk reglement</li>
                      <li>Gebruik conform de bestemming &quot;berging/stalling&quot; blijft</li>
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Bron: Splitsingsakte art. 24.3, HR art. 8.1
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Eerlijke prijzen, geen verrassingen
            </h2>
            <p className="text-lg text-muted-foreground">
              Bespaar tot 90% vergeleken met een professionele VvE beheerder
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <Card key={plan.name} className={`relative hover:shadow-lg transition-shadow ${plan.popular ? 'border-blue-600 border-2 shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600">Meest gekozen</Badge>
                  </div>
                )}
                <CardContent className="pt-8 pb-6">
                  <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <Link href="/signup">
                    <Button className="w-full mb-6" variant={plan.popular ? "default" : "outline"} size="lg">
                      {plan.cta}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Klaar om uw VvE slim te beheren?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Begin vandaag nog. Gratis voor kleine VvE's, geen creditcard nodig.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-base px-8 h-12 font-semibold">
              Gratis starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="font-semibold">VvE Digitaal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-gestuurd VvE beheer. Van garageboxen tot appartementen.
              </p>
            </div>
            <div>
              <p className="font-medium mb-3 text-sm">Product</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#features" className="block hover:text-foreground transition">Functies</a>
                <a href="#pricing" className="block hover:text-foreground transition">Prijzen</a>
                <a href="#vergelijk" className="block hover:text-foreground transition">Vergelijk</a>
              </div>
            </div>
            <div>
              <p className="font-medium mb-3 text-sm">Contact</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>info@vvedigitaal.nl</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VvE Digitaal. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
