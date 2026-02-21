"use client";

import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
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
  {
    icon: BarChart3,
    title: "Jaarverslag",
    description: "AI genereert automatisch uw jaarverslag op basis van alle transacties en besluiten.",
  },
];

const steps = [
  {
    step: "1",
    title: "VvE Aanmaken",
    description: "Maak uw VvE aan in 2 minuten. Upload uw splitsingsakte en AI doet de rest.",
  },
  {
    step: "2",
    title: "Leden Uitnodigen",
    description: "Nodig eigenaren uit via e-mail. Iedereen krijgt direct toegang tot het platform.",
  },
  {
    step: "3",
    title: "AI Neemt Over",
    description: "AI beheert documenten, beantwoordt vragen, genereert notulen en houdt de financiën bij.",
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
      "Documentopslag (100 MB)",
      "Basis financieel overzicht",
      "1 AI-vraag per dag",
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
      "Onbeperkt AI-assistent",
      "Digitaal stemmen",
      "AI notulen",
      "Financieel dashboard",
      "Onderhoud & MJOP",
      "Jaarverslag generator",
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
      "Geavanceerde rapportages",
      "API toegang",
      "Prioriteit support",
      "Eigen branding",
    ],
    cta: "Contact opnemen",
    popular: false,
  },
];

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
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">Hoe het werkt</a>
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <Star className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
              Nu beschikbaar voor garageboxen & opslagruimtes
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              De slimste VvE beheerder is{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                geen persoon
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              AI-gestuurd VvE beheer dat het werk voor u doet. Van notulen tot jaarverslag,
              van stemmen tot onderhoud. Bespaar tijd, geld en frustratie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-base px-8 h-12">
                  Gratis starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="text-base px-8 h-12">
                  Bekijk functies
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
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
                In 2 minuten actief
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <Euro className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Te duur</h3>
              <p className="text-muted-foreground">
                Professioneel VvE beheer kost &euro;100-210 per eenheid per jaar.
                Wij doen het voor een fractie van de prijs.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Te tijdrovend</h3>
              <p className="text-muted-foreground">
                Vrijwillige bestuurders besteden uren aan administratie.
                AI neemt 80% van het werk over.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">75% ontevreden</h3>
              <p className="text-muted-foreground">
                Driekwart van alle VvE&apos;s is ontevreden over hun beheerder.
                Tijd voor een betere oplossing.
              </p>
            </div>
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
              Van garageboxen tot grote appartementscomplexen. AI-gestuurde tools
              die het beheer eenvoudig maken.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 mb-4">
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

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              In 3 stappen aan de slag
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold mb-6">
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
      <section className="py-20">
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
            <div className="bg-gray-50 rounded-2xl p-6 border">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-white rounded-xl p-3 border text-sm">
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
      <section id="pricing" className="py-20 bg-gray-50">
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
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-600 border-2 shadow-lg' : ''}`}>
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
                    <Button className="w-full mb-6" variant={plan.popular ? "default" : "outline"}>
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
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Klaar om uw VvE slim te beheren?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Begin vandaag nog. Gratis voor kleine VvE&apos;s, geen creditcard nodig.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base px-8 h-12">
              Gratis starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">VvE Digitaal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VvE Digitaal. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
