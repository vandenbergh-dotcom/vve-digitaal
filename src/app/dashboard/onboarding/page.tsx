"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Upload, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [vveName, setVveName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const router = useRouter();

  const progress = (step / 3) * 100;

  function handleComplete() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Stap {step} van 3</p>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: VvE Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Uw VvE aanmaken</CardTitle>
              <CardDescription>
                Voer de basisgegevens van uw Vereniging van Eigenaren in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Naam VvE</Label>
                <Input
                  placeholder="bijv. VvE Garagepark De Linden"
                  value={vveName}
                  onChange={(e) => setVveName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Adres</Label>
                <Input
                  placeholder="Straatnaam en huisnummer"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Postcode</Label>
                  <Input
                    placeholder="1234 AB"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plaats</Label>
                  <Input
                    placeholder="Amsterdam"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type VvE</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="garage">Garageboxen</SelectItem>
                    <SelectItem value="storage">Opslagruimtes</SelectItem>
                    <SelectItem value="apartment">Appartementen</SelectItem>
                    <SelectItem value="mixed">Gemengd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>
                Volgende
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Units */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Eenheden configureren</CardTitle>
              <CardDescription>
                Hoeveel eenheden heeft uw VvE?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Aantal eenheden</Label>
                <Input
                  type="number"
                  placeholder="bijv. 24"
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nummering</Label>
                <Select defaultValue="box">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="box">Box 1, Box 2, ...</SelectItem>
                    <SelectItem value="number">1, 2, 3, ...</SelectItem>
                    <SelectItem value="letter">A, B, C, ...</SelectItem>
                    <SelectItem value="custom">Aangepast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {totalUnits && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Er worden <strong>{totalUnits} eenheden</strong> aangemaakt met gelijke breukdelen (1/{totalUnits}).
                    U kunt dit later aanpassen.
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Volgende
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Documenten uploaden</CardTitle>
              <CardDescription>
                Upload uw splitsingsakte zodat AI uw VvE kan leren kennen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Splitsingsakte uploaden</p>
                <p className="text-xs text-muted-foreground">
                  PDF, max 25 MB. AI analyseert het document automatisch.
                </p>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Huishoudelijk reglement (optioneel)</p>
                <p className="text-xs text-muted-foreground">
                  PDF, max 25 MB
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">AI analyseert uw documenten</p>
                  <p className="text-xs text-green-700 mt-1">
                    Onze AI leest uw splitsingsakte en haalt automatisch de eigendomsverhoudingen,
                    regels en beperkingen eruit. U kunt daarna vragen stellen in natuurlijke taal.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  VvE aanmaken
                </Button>
              </div>
              <button
                onClick={handleComplete}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition"
              >
                Overslaan, ik upload later
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
