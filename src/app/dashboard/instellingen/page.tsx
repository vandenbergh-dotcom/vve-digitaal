"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  CreditCard,
  Mail,
  Save,
  Bell,
  Loader2,
} from "lucide-react";
import { useVvE } from "@/lib/vve-context";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function InstellingenPage() {
  const { currentVvE, isConnected, refreshVvE } = useVvE();
  const [saving, setSaving] = useState(false);

  // VvE details
  const [vveName, setVveName] = useState("");
  const [vveAddress, setVveAddress] = useState("");
  const [vvePostal, setVvePostal] = useState("");
  const [vveCity, setVveCity] = useState("");
  const [vveKvk, setVveKvk] = useState("");
  const [vveType, setVveType] = useState("garage");

  // Financial
  const [vveIban, setVveIban] = useState("");
  const [vveTenName, setVveTenName] = useState("");
  const [defaultContribution, setDefaultContribution] = useState("50");
  const [paymentTermDays, setPaymentTermDays] = useState("30");

  // Email
  const [emailFrom, setEmailFrom] = useState("");
  const [emailReplyTo, setEmailReplyTo] = useState("");
  const [invoiceFooter, setInvoiceFooter] = useState("");

  // Notifications
  const [notifyInvoice, setNotifyInvoice] = useState(true);
  const [notifyOverdue, setNotifyOverdue] = useState(true);
  const [notifyMeeting, setNotifyMeeting] = useState(true);
  const [notifyVote, setNotifyVote] = useState(true);
  const [notifyMaintenance, setNotifyMaintenance] = useState(true);
  const [autoOverdueDays, setAutoOverdueDays] = useState("7");

  // Load current VvE data into form
  useEffect(() => {
    if (currentVvE) {
      setVveName(currentVvE.name || "");
      setVveAddress(currentVvE.address || "");
      setVvePostal(currentVvE.postal_code || "");
      setVveCity(currentVvE.city || "");
      setVveKvk(currentVvE.kvk_number || "");
      setVveType(currentVvE.type || "garage");
      setVveIban(currentVvE.iban || "");
      setVveTenName(currentVvE.iban_name || `VvE ${currentVvE.name}`);
      setDefaultContribution(String(currentVvE.default_contribution || "50"));
      setPaymentTermDays(String(currentVvE.payment_term_days || "30"));
      setEmailFrom(currentVvE.email_from || "");
      setEmailReplyTo(currentVvE.email_reply_to || "");
      setInvoiceFooter(currentVvE.invoice_footer || "");
    } else {
      // Demo defaults
      setVveName("Garagepark De Linden");
      setVveAddress("Lindenlaan 15");
      setVvePostal("1234 AB");
      setVveCity("Amsterdam");
      setVveKvk("12345678");
      setVveIban("NL91ABNA0417164300");
      setVveTenName("VvE Garagepark De Linden");
      setEmailFrom("bestuur@garageparkdelinden.nl");
      setEmailReplyTo("bestuur@garageparkdelinden.nl");
      setInvoiceFooter("Bij vragen over deze factuur kunt u contact opnemen met het bestuur.");
    }
  }, [currentVvE]);

  async function handleSave() {
    setSaving(true);
    try {
      if (isConnected && currentVvE) {
        const supabase = createClient();
        const { error } = await supabase
          .from("vves")
          .update({
            name: vveName,
            address: vveAddress,
            postal_code: vvePostal,
            city: vveCity,
            kvk_number: vveKvk,
            type: vveType,
            iban: vveIban,
            iban_name: vveTenName,
            default_contribution: parseFloat(defaultContribution) || 50,
            payment_term_days: parseInt(paymentTermDays) || 30,
            email_from: emailFrom,
            email_reply_to: emailReplyTo,
            invoice_footer: invoiceFooter,
          })
          .eq("id", currentVvE.id);

        if (error) throw new Error(error.message);
        await refreshVvE();
      }
      toast.success("Instellingen opgeslagen.");
    } catch (err) {
      toast.error(`Fout bij opslaan: ${err instanceof Error ? err.message : "Onbekende fout"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Instellingen</h1>
          <p className="text-sm text-muted-foreground">Beheer VvE-gegevens, betaalinstellingen en notificaties</p>
        </div>
      </div>

      {/* VvE Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            VvE Gegevens
          </CardTitle>
          <CardDescription>Basisinformatie over de VvE</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Naam VvE</Label>
              <Input value={vveName} onChange={(e) => setVveName(e.target.value)} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={vveType} onValueChange={setVveType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="garage">Garageboxen</SelectItem>
                  <SelectItem value="storage">Opslagruimte</SelectItem>
                  <SelectItem value="apartment">Appartementen</SelectItem>
                  <SelectItem value="mixed">Gemengd</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Adres</Label>
              <Input value={vveAddress} onChange={(e) => setVveAddress(e.target.value)} />
            </div>
            <div>
              <Label>Postcode</Label>
              <Input value={vvePostal} onChange={(e) => setVvePostal(e.target.value)} />
            </div>
            <div>
              <Label>Plaats</Label>
              <Input value={vveCity} onChange={(e) => setVveCity(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>KvK-nummer</Label>
            <Input value={vveKvk} onChange={(e) => setVveKvk(e.target.value)} className="max-w-xs" />
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Financiele instellingen
          </CardTitle>
          <CardDescription>Bankgegevens en standaardbedragen voor facturen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>IBAN</Label>
              <Input value={vveIban} onChange={(e) => setVveIban(e.target.value)} placeholder="NL00BANK0000000000" />
            </div>
            <div>
              <Label>Ten name van</Label>
              <Input value={vveTenName} onChange={(e) => setVveTenName(e.target.value)} />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Standaard bijdrage per eenheid (&euro;/maand)</Label>
              <Input type="number" min="0" step="0.01" value={defaultContribution} onChange={(e) => setDefaultContribution(e.target.value)} className="max-w-xs" />
              <p className="text-xs text-muted-foreground mt-1">Dit bedrag wordt als standaard ingevuld bij het aanmaken van facturen</p>
            </div>
            <div>
              <Label>Standaard betalingstermijn (dagen)</Label>
              <Input type="number" min="1" value={paymentTermDays} onChange={(e) => setPaymentTermDays(e.target.value)} className="max-w-xs" />
              <p className="text-xs text-muted-foreground mt-1">Vervaldatum wordt automatisch berekend bij nieuwe facturen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            E-mailinstellingen
          </CardTitle>
          <CardDescription>Configureer afzender en factuursjabloon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Afzender e-mail</Label>
              <Input type="email" value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)} />
            </div>
            <div>
              <Label>Antwoord-naar e-mail</Label>
              <Input type="email" value={emailReplyTo} onChange={(e) => setEmailReplyTo(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Factuurtekst (voettekst)</Label>
            <Textarea value={invoiceFooter} onChange={(e) => setInvoiceFooter(e.target.value)} rows={3} />
            <p className="text-xs text-muted-foreground mt-1">Wordt onderaan elke factuur-e-mail geplaatst</p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notificaties
          </CardTitle>
          <CardDescription>Bepaal wanneer leden automatisch e-mails ontvangen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Factuur verzonden</p>
              <p className="text-xs text-muted-foreground">Lid ontvangt e-mail bij nieuwe factuur</p>
            </div>
            <Switch checked={notifyInvoice} onCheckedChange={setNotifyInvoice} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Betalingsherinnering</p>
              <p className="text-xs text-muted-foreground">Automatische herinnering bij achterstallige facturen</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Na</Label>
                <Input type="number" min="1" value={autoOverdueDays} onChange={(e) => setAutoOverdueDays(e.target.value)} className="w-16 h-8" />
                <Label className="text-xs text-muted-foreground whitespace-nowrap">dagen</Label>
              </div>
              <Switch checked={notifyOverdue} onCheckedChange={setNotifyOverdue} />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Vergadering gepland</p>
              <p className="text-xs text-muted-foreground">Leden ontvangen uitnodiging en herinnering</p>
            </div>
            <Switch checked={notifyMeeting} onCheckedChange={setNotifyMeeting} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Stemming geopend</p>
              <p className="text-xs text-muted-foreground">Leden worden gevraagd hun stem uit te brengen</p>
            </div>
            <Switch checked={notifyVote} onCheckedChange={setNotifyVote} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Onderhoudsupdate</p>
              <p className="text-xs text-muted-foreground">Melder ontvangt statusupdates</p>
            </div>
            <Switch checked={notifyMaintenance} onCheckedChange={setNotifyMaintenance} />
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Instellingen opslaan
        </Button>
      </div>
    </div>
  );
}
