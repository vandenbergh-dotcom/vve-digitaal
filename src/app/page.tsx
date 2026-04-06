"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Brain,
  FileText,
  Vote,
  Calculator,
  Wrench,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Receipt,
  Users,
  Zap,
  TrendingDown,
  Shield,
  Clock,
  Euro,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Receipt,
    title: "Facturen & Betalingen",
    description: "Genereer facturen in bulk, verstuur per e-mail. Zie in een oogopslag wie heeft betaald.",
  },
  {
    icon: Brain,
    title: "AI Assistent",
    description: "Stel vragen over uw splitsingsakte of VvE-wetgeving. Direct antwoord, 24/7.",
  },
  {
    icon: FileText,
    title: "Documenten & Notulen",
    description: "Upload documenten, laat AI notulen genereren en doorzoek alles in natuurlijke taal.",
  },
  {
    icon: Vote,
    title: "Digitaal Stemmen",
    description: "Organiseer stemmingen online. Automatische quorum-berekening en resultaten.",
  },
  {
    icon: Calculator,
    title: "Financieel Beheer",
    description: "Bijdragen, uitgaven, reservefonds. Automatisch gecategoriseerd en overzichtelijk.",
  },
  {
    icon: Wrench,
    title: "Onderhoud & MJOP",
    description: "Meld onderhoud, volg de status en beheer uw meerjarenonderhoudsplan.",
  },
];

const testimonials = [
  {
    name: "Robert de Jong",
    role: "Voorzitter VvE Parkeergarage Centrum",
    text: "Eindelijk geen Excel meer voor de administratie. Facturen versturen kost me nu 2 minuten in plaats van een hele avond.",
    avatar: "R",
  },
  {
    name: "Marieke van Dijk",
    role: "Penningmeester VvE De Linden",
    text: "Het betalingsoverzicht is fantastisch. Ik zie direct wie heeft betaald en wie niet. Scheelt mij enorm veel tijd.",
    avatar: "M",
  },
  {
    name: "Peter Hendriks",
    role: "Bestuurslid VvE Garagebox Zuid",
    text: "De AI assistent beantwoordt vragen die ik normaal een jurist voor zou bellen. Dat scheelt honderden euro's per jaar.",
    avatar: "P",
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
      "Prioriteit support",
    ],
    cta: "Contact opnemen",
    popular: false,
  },
];

const comparisons = [
  { feature: "Facturen versturen", us: true, traditional: "Handmatig" },
  { feature: "Betalingen bijhouden", us: true, traditional: "Excel" },
  { feature: "Digitaal stemmen", us: true, traditional: "Vergadering" },
  { feature: "AI-gegenereerde notulen", us: true, traditional: "Handmatig" },
  { feature: "24/7 beschikbaar", us: true, traditional: "Kantooruren" },
  { feature: "Kosten per jaar (24 eenheden)", us: "\u20ac228", traditional: "\u20ac2.400+" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-7 w-7 text-emerald-600" />
              <span className="text-xl font-bold tracking-tight">VvE App</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#functies" className="text-sm text-gray-500 hover:text-gray-900 transition">Functies</a>
              <a href="#vergelijk" className="text-sm text-gray-500 hover:text-gray-900 transition">Vergelijk</a>
              <a href="#prijzen" className="text-sm text-gray-500 hover:text-gray-900 transition">Prijzen</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Inloggen</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Gratis starten
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-600 font-medium text-sm mb-4 tracking-wide uppercase">VvE beheer, maar dan simpel</p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                Uw VvE beheren zonder gedoe
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Facturen versturen, betalingen bijhouden, digitaal stemmen.
                Alles wat uw VvE nodig heeft. 90% goedkoper dan een professionele beheerder.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/signup">
                  <Button size="lg" className="text-base px-8 h-12 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
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
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Geen creditcard nodig
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Gratis tot 4 eenheden
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  In 5 minuten actief
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                  alt="Appartementencomplex"
                  width={800}
                  height={533}
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border p-4 max-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Factuur betaald</p>
                    <p className="text-[10px] text-gray-400">J. de Vries - Box 2</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-emerald-600">&euro;50,00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-10 border-y bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">135.000+</p>
              <p className="text-sm text-gray-500 mt-1">VvE's in Nederland</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">75%</p>
              <p className="text-sm text-gray-500 mt-1">Ontevreden over beheerder</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">90%</p>
              <p className="text-sm text-gray-500 mt-1">Goedkoper dan beheerder</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">5 min</p>
              <p className="text-sm text-gray-500 mt-1">Om te starten</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem + Photo */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                alt="Appartementen beheer"
                width={800}
                height={533}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Waarom VvE's overstappen</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <Euro className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Professioneel beheer is te duur</h3>
                    <p className="text-gray-500 text-sm">&euro;100-210 per eenheid per jaar. Wij doen het vanaf &euro;0.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Administratie kost te veel tijd</h3>
                    <p className="text-gray-500 text-sm">Vrijwillige bestuurders besteden avonden aan Excel. AI neemt 80% over.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Geen inzicht in de stand van zaken</h3>
                    <p className="text-gray-500 text-sm">Eigenaren willen weten hoe het ervoor staat. Met VvE App kan dat altijd.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="functies" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Alles in een platform</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Van garageboxen tot appartementen. Slimme tools die het beheer simpel maken.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-white border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works with photo */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-10 text-gray-900">In 3 stappen aan de slag</h2>
              <div className="space-y-8">
                {[
                  { num: "1", title: "VvE aanmaken", desc: "Vul uw gegevens in, stel IBAN en bijdragen in. Klaar in 5 minuten." },
                  { num: "2", title: "Leden uitnodigen", desc: "Voeg eigenaren toe met hun e-mail. Iedereen krijgt direct toegang." },
                  { num: "3", title: "Facturen versturen", desc: "Genereer facturen voor alle leden in een klik. Verstuur per e-mail." },
                ].map((step, i) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                      <p className="text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Samenwerken aan VvE beheer"
                width={800}
                height={533}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Wat bestuurders zeggen</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-emerald-700">{t.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="vergelijk" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">VvE App vs. traditionele beheerder</h2>
            <p className="text-gray-500">Dezelfde kwaliteit, een fractie van de kosten</p>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium text-sm">Functie</th>
                  <th className="text-center p-4 font-medium text-sm">
                    <span className="text-emerald-600">VvE App</span>
                  </th>
                  <th className="text-center p-4 font-medium text-sm text-gray-400">Beheerder</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.feature} className="border-b last:border-0">
                    <td className="p-4 text-sm">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.us === true ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-sm font-bold text-emerald-600">{row.us}</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-sm text-gray-400">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="prijzen" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Eerlijke prijzen</h2>
            <p className="text-gray-500">Bespaar tot 90% vergeleken met een professionele beheerder</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan) => (
              <Card key={plan.name} className={`relative bg-white ${plan.popular ? 'border-emerald-600 border-2 shadow-lg scale-[1.03]' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">Meest gekozen</Badge>
                  </div>
                )}
                <CardContent className="pt-8 pb-6">
                  <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <Link href="/signup">
                    <Button className={`w-full mb-6 ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`} variant={plan.popular ? "default" : "outline"} size="lg">
                      {plan.cta}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
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

      {/* CTA with photo background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
            alt="Gebouw"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/75" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Klaar om uw VvE slim te beheren?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Begin vandaag nog. Gratis voor kleine VvE's, geen creditcard nodig.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base px-8 h-12 bg-emerald-600 hover:bg-emerald-700">
              Gratis starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-6 w-6 text-emerald-600" />
                <span className="font-semibold">VvE App</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Slim VvE beheer voor garageboxen, opslagruimtes en appartementen.
              </p>
            </div>
            <div>
              <p className="font-medium mb-3 text-sm">Product</p>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#functies" className="block hover:text-gray-900 transition">Functies</a>
                <a href="#prijzen" className="block hover:text-gray-900 transition">Prijzen</a>
                <a href="#vergelijk" className="block hover:text-gray-900 transition">Vergelijk</a>
              </div>
            </div>
            <div>
              <p className="font-medium mb-3 text-sm">Contact</p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>info@vveapp.com</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-8">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} VvE App. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
