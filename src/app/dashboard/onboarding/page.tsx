"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  CreditCard,
  Rocket,
  Plus,
  Trash2,
  Mail,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const TOTAL_STEPS = 6;

const stepMeta = [
  { num: 1, label: "VvE Gegevens", icon: Building2 },
  { num: 2, label: "Eenheden", icon: FileText },
  { num: 3, label: "Financieel", icon: CreditCard },
  { num: 4, label: "Leden", icon: Users },
  { num: 5, label: "Documenten", icon: Upload },
  { num: 6, label: "Klaar!", icon: Rocket },
];

interface NewMember {
  name: string;
  email: string;
  unit: string;
  role: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Step 1: VvE info
  const [vveName, setVveName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [kvk, setKvk] = useState("");

  // Step 2: Units
  const [totalUnits, setTotalUnits] = useState("");
  const [unitPrefix, setUnitPrefix] = useState("Box");
  const [breukdeelType, setBreukdeelType] = useState("equal");

  // Step 3: Financial
  const [iban, setIban] = useState("");
  const [ibanName, setIbanName] = useState("");
  const [contribution, setContribution] = useState("50");
  const [paymentTermDays, setPaymentTermDays] = useState("30");

  // Step 4: Members
  const [members, setMembers] = useState<NewMember[]>([
    { name: "", email: "", unit: "", role: "board_chair" },
  ]);

  // Step 5: Uploaded files
  const [splitsingsakte, setSplitsingsakte] = useState<string | null>(null);
  const [reglement, setReglement] = useState<string | null>(null);

  const progress = (step / TOTAL_STEPS) * 100;
  const units = parseInt(totalUnits) || 0;

  function addMember() {
    setMembers([...members, { name: "", email: "", unit: "", role: "owner" }]);
  }

  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index));
  }

  function updateMember(index: number, field: keyof NewMember, value: string) {
    setMembers(members.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  function canProceed(): boolean {
    switch (step) {
      case 1: return !!(vveName && address && postalCode && city && type);
      case 2: return units > 0;
      case 3: return !!(iban && ibanName);
      case 4: return members.some((m) => m.name && m.email);
      default: return true;
    }
  }

  function handleNext() {
    if (!canProceed()) {
      toast.error("Vul alle verplichte velden in.");
      return;
    }
    if (step === 3 && !ibanName) setIbanName(`VvE ${vveName}`);
    setStep(Math.min(step + 1, TOTAL_STEPS));
  }

  function handleComplete() {
    toast.success("VvE succesvol aangemaakt! Welkom bij VvE Digitaal.");
    router.push("/dashboard");
  }

  const roleLabels: Record<string, string> = {
    board_chair: "Voorzitter",
    board_secretary: "Secretaris",
    board_treasurer: "Penningmeester",
    board_member: "Bestuurslid",
    owner: "Eigenaar",
  };

  const unitOptions = Array.from({ length: units }, (_, i) => unitPrefix !== "none" ? `${unitPrefix} ${i + 1}` : String(i + 1));

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Step indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepMeta.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isDone
                        ? "bg-green-100 text-green-600"
                        : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs hidden sm:block ${isActive ? "font-medium text-blue-600" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: VvE Gegevens */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                VvE Gegevens
              </CardTitle>
              <CardDescription>De basisgegevens van uw Vereniging van Eigenaren</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Naam VvE *</Label>
                <Input placeholder="bijv. VvE Garagepark De Linden" value={vveName} onChange={(e) => setVveName(e.target.value)} />
              </div>
              <div>
                <Label>Adres *</Label>
                <Input placeholder="Straatnaam en huisnummer" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Postcode *</Label>
                  <Input placeholder="1234 AB" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div>
                  <Label>Plaats *</Label>
                  <Input placeholder="Amsterdam" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type VvE *</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="garage">Garageboxen</SelectItem>
                      <SelectItem value="storage">Opslagruimtes</SelectItem>
                      <SelectItem value="apartment">Appartementen</SelectItem>
                      <SelectItem value="mixed">Gemengd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>KvK-nummer (optioneel)</Label>
                  <Input placeholder="12345678" value={kvk} onChange={(e) => setKvk(e.target.value)} />
                </div>
              </div>
              <Button className="w-full" onClick={handleNext} disabled={!canProceed()}>
                Volgende <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Eenheden */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Eenheden configureren
              </CardTitle>
              <CardDescription>Hoeveel eenheden heeft de VvE en hoe zijn ze genummerd?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Aantal eenheden *</Label>
                  <Input type="number" min="1" placeholder="bijv. 24" value={totalUnits} onChange={(e) => setTotalUnits(e.target.value)} />
                </div>
                <div>
                  <Label>Nummering</Label>
                  <Select value={unitPrefix} onValueChange={setUnitPrefix}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Box">Box 1, Box 2, ...</SelectItem>
                      <SelectItem value="Unit">Unit 1, Unit 2, ...</SelectItem>
                      <SelectItem value="Apt">Apt 1, Apt 2, ...</SelectItem>
                      <SelectItem value="none">1, 2, 3, ...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Breukdelen</Label>
                <Select value={breukdeelType} onValueChange={setBreukdeelType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Gelijke breukdelen (1/{units || "N"} per eenheid)</SelectItem>
                    <SelectItem value="custom">Aangepaste breukdelen (later instellen)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {units > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Er worden <strong>{units} eenheden</strong> aangemaakt: {unitPrefix !== "none" ? `${unitPrefix} 1` : "1"} t/m {unitPrefix !== "none" ? `${unitPrefix} ${units}` : String(units)},
                    elk met breukdeel <strong>1/{units}</strong>.
                    {breukdeelType === "custom" && " U kunt de breukdelen later per eenheid aanpassen."}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Terug
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
                  Volgende <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Financieel */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Financiele instellingen
              </CardTitle>
              <CardDescription>Bankgegevens en bijdrage-instellingen voor facturen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>IBAN van de VvE *</Label>
                <Input placeholder="NL00BANK0000000000" value={iban} onChange={(e) => setIban(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Dit IBAN wordt vermeld op alle facturen</p>
              </div>
              <div>
                <Label>Ten name van *</Label>
                <Input placeholder={`VvE ${vveName || "..."}`} value={ibanName} onChange={(e) => setIbanName(e.target.value)} />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Maandelijkse bijdrage per eenheid</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">&euro;</span>
                    <Input type="number" min="0" step="0.01" className="pl-7" value={contribution} onChange={(e) => setContribution(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Betalingstermijn</Label>
                  <Select value={paymentTermDays} onValueChange={setPaymentTermDays}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14 dagen</SelectItem>
                      <SelectItem value="30">30 dagen</SelectItem>
                      <SelectItem value="60">60 dagen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {units > 0 && contribution && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    Maandelijkse inkomsten: <strong>&euro;{(units * parseFloat(contribution || "0")).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</strong> ({units} eenheden x &euro;{parseFloat(contribution || "0").toFixed(2)})
                  </p>
                  <p className="text-sm text-green-800 mt-1">
                    Jaarlijkse inkomsten: <strong>&euro;{(units * parseFloat(contribution || "0") * 12).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</strong>
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Terug
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
                  Volgende <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Leden toevoegen */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Leden toevoegen
              </CardTitle>
              <CardDescription>
                Voeg het bestuur en eigenaren toe. Ze ontvangen een uitnodigingsmail.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {members.map((member, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={member.role.startsWith("board") ? "default" : "secondary"}>
                        {roleLabels[member.role] || "Eigenaar"}
                      </Badge>
                      {members.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeMember(i)}>
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Naam *</Label>
                        <Input placeholder="Volledige naam" value={member.name} onChange={(e) => updateMember(i, "name", e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs">E-mail *</Label>
                        <Input type="email" placeholder="naam@email.nl" value={member.email} onChange={(e) => updateMember(i, "email", e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Eenheid</Label>
                        <Select value={member.unit} onValueChange={(v) => updateMember(i, "unit", v)}>
                          <SelectTrigger><SelectValue placeholder="Selecteer" /></SelectTrigger>
                          <SelectContent>
                            {unitOptions.map((u) => (
                              <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Rol</Label>
                        <Select value={member.role} onValueChange={(v) => updateMember(i, "role", v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="board_chair">Voorzitter</SelectItem>
                            <SelectItem value="board_secretary">Secretaris</SelectItem>
                            <SelectItem value="board_treasurer">Penningmeester</SelectItem>
                            <SelectItem value="board_member">Bestuurslid</SelectItem>
                            <SelectItem value="owner">Eigenaar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={addMember}>
                <Plus className="mr-2 h-4 w-4" /> Nog een lid toevoegen
              </Button>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <Mail className="h-3.5 w-3.5 inline mr-1" />
                  Leden ontvangen een uitnodigingsmail zodra de VvE is aangemaakt. Ze kunnen dan inloggen en hun eigen gegevens beheren.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Terug
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
                  Volgende <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Documenten */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Documenten uploaden
              </CardTitle>
              <CardDescription>
                Upload uw splitsingsakte zodat AI uw VvE leert kennen. Dit kan ook later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  splitsingsakte ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-blue-400"
                }`}
                onClick={() => setSplitsingsakte(splitsingsakte ? null : "splitsingsakte.pdf")}
              >
                {splitsingsakte ? (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-800">Splitsingsakte geupload</p>
                    <p className="text-xs text-green-600">{splitsingsakte}</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Splitsingsakte uploaden *</p>
                    <p className="text-xs text-muted-foreground">PDF, max 25 MB</p>
                  </>
                )}
              </div>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  reglement ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-blue-400"
                }`}
                onClick={() => setReglement(reglement ? null : "huishoudelijk-reglement.pdf")}
              >
                {reglement ? (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-800">Reglement geupload</p>
                    <p className="text-xs text-green-600">{reglement}</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Huishoudelijk reglement (optioneel)</p>
                    <p className="text-xs text-muted-foreground">PDF, max 25 MB</p>
                  </>
                )}
              </div>
              <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">AI analyseert uw documenten</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Onze AI leest de splitsingsakte en haalt automatisch eigendomsverhoudingen, regels en beperkingen eruit. Daarna kunt u vragen stellen in natuurlijke taal.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Terug
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Volgende <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <button onClick={handleNext} className="w-full text-sm text-muted-foreground hover:text-foreground transition">
                Overslaan, ik upload later
              </button>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Samenvatting & Klaar */}
        {step === 6 && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Alles klaar!</CardTitle>
              <CardDescription>Hier is een overzicht van uw VvE-configuratie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">VvE</p>
                  <p className="font-medium">{vveName}</p>
                  <p className="text-sm text-muted-foreground">{address}, {postalCode} {city}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Eenheden</p>
                  <p className="font-medium">{units} {type === "garage" ? "garageboxen" : type === "apartment" ? "appartementen" : "eenheden"}</p>
                  <p className="text-sm text-muted-foreground">Breukdeel: 1/{units} per eenheid</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Financieel</p>
                  <p className="font-medium">&euro;{parseFloat(contribution || "0").toFixed(2)} /eenheid/maand</p>
                  <p className="text-sm text-muted-foreground">IBAN: {iban || "Niet ingesteld"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Leden</p>
                  <p className="font-medium">{members.filter((m) => m.name).length} leden toegevoegd</p>
                  <p className="text-sm text-muted-foreground">{members.filter((m) => m.role.startsWith("board")).length} bestuursleden</p>
                </div>
              </div>

              <Separator />

              {/* What's next checklist */}
              <div>
                <p className="font-medium mb-3">Wat kunt u nu doen?</p>
                <div className="space-y-2">
                  {[
                    { label: "Eerste facturen aanmaken en versturen", href: "/dashboard/facturen" },
                    { label: "Vergadering (ALV) plannen", href: "/dashboard/vergaderingen" },
                    { label: "Onderhoudsverzoek indienen", href: "/dashboard/onderhoud" },
                    { label: "AI-assistent vragen stellen over uw VvE", href: "/dashboard/ai-assistent" },
                    { label: "Meer documenten uploaden", href: "/dashboard/documenten" },
                  ].map((item) => (
                    <div key={item.href} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push(item.href)}>
                      <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                      </div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleComplete}>
                <Rocket className="mr-2 h-4 w-4" />
                Naar het dashboard
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setStep(5)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar vorige stap
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
