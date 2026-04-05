"use client";

import { useState } from "react";
import {
  FileCheck, Plus, Brain, CheckCircle2, XCircle, Clock, Send,
  Building, Euro, CalendarDays, AlertTriangle, ThumbsUp, ThumbsDown,
  ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/* ─── Types ─── */

interface Quote {
  id: string;
  contractor: string;
  amount: number;
  description: string;
  timeline: string;
  receivedAt: string;
  pros: string[];
  cons: string[];
}

interface QuoteRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "draft" | "requested" | "quotes_received" | "under_review" | "approved" | "rejected" | "commissioned";
  createdAt: string;
  deadline: string;
  estimatedBudget: number;
  approvalLevel: "board" | "alv";
  quotes: Quote[];
  selectedQuoteId: string | null;
  aiRecommendation: string | null;
}

/* ─── Config ─── */

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "Concept", color: "bg-gray-50 text-gray-700", icon: Clock },
  requested: { label: "Aangevraagd", color: "bg-blue-50 text-blue-700", icon: Send },
  quotes_received: { label: "Offertes binnen", color: "bg-purple-50 text-purple-700", icon: FileCheck },
  under_review: { label: "In beoordeling", color: "bg-yellow-50 text-yellow-700", icon: Brain },
  approved: { label: "Goedgekeurd", color: "bg-green-50 text-green-700", icon: CheckCircle2 },
  rejected: { label: "Afgewezen", color: "bg-red-50 text-red-700", icon: XCircle },
  commissioned: { label: "Opdracht verleend", color: "bg-emerald-50 text-emerald-700", icon: ThumbsUp },
};

const categoryLabels: Record<string, string> = {
  garagedeuren: "Garagedeuren",
  verlichting: "Verlichting",
  bestrating: "Bestrating",
  schilderwerk: "Schilderwerk",
  dakbedekking: "Dakbedekking",
  installatie: "Installaties",
  overig: "Overig",
};

const BOARD_APPROVAL_LIMIT = 2500; // Under this: board decides. Over: ALV vote needed.

/* ─── Demo data ─── */

const initialRequests: QuoteRequest[] = [
  {
    id: "1",
    title: "Vervanging garagedeuren sectie A (12 stuks)",
    description: "Vervanging van 12 kanteldeuren door geïsoleerde sectionaaldeuren in sectie A. Inclusief elektrische bediening en nieuwe kozijnen waar nodig. Conform besluit ALV december 2025.",
    category: "garagedeuren",
    status: "under_review",
    createdAt: "2026-01-15",
    deadline: "2026-03-01",
    estimatedBudget: 18000,
    approvalLevel: "alv",
    selectedQuoteId: null,
    aiRecommendation: "Aanbeveling: **Van der Berg Deuren** biedt de beste prijs-kwaliteitverhouding. Hun offerte is €1.200 goedkoper dan Garage Solutions terwijl ze vergelijkbare kwaliteit leveren (Hörmann deuren). De langere garantie (7 vs 5 jaar) en snellere levertijd maken dit de sterkste optie. Let op: De Poortspecialist is het goedkoopst maar biedt geen Hörmann/merkkwaliteit en kortere garantie.",
    quotes: [
      {
        id: "q1",
        contractor: "Van der Berg Deuren BV",
        amount: 16800,
        description: "12x Hörmann sectionaaldeur, geïsoleerd (42mm), inclusief elektrische aandrijving ProMatic 4. Kozijnaanpassingen waar nodig. Afwerking: RAL 7016 antraciet.",
        timeline: "4-5 weken na opdracht",
        receivedAt: "2026-02-01",
        pros: ["Hörmann kwaliteit", "7 jaar garantie", "Snelle levertijd", "Lokaal bedrijf"],
        cons: ["Niet de goedkoopste"],
      },
      {
        id: "q2",
        contractor: "Garage Solutions Nederland",
        amount: 18000,
        description: "12x Hörmann LPU 67 sectionaaldeur, 42mm isolatie, met ProMatic aandrijving. Inclusief demontage oude deuren, kozijnaanpassing en afvoer materiaal.",
        timeline: "6-8 weken na opdracht",
        receivedAt: "2026-02-05",
        pros: ["Alles-inclusief prijs", "Hörmann premium lijn", "Landelijke service"],
        cons: ["Duurste optie", "Langere levertijd"],
      },
      {
        id: "q3",
        contractor: "De Poortspecialist",
        amount: 14400,
        description: "12x sectionaaldeur eigen merk, 40mm isolatie, elektrische bediening. Standaard kleuren. Kozijnaanpassingen meerwerk (geschat €800).",
        timeline: "3-4 weken na opdracht",
        receivedAt: "2026-02-10",
        pros: ["Laagste prijs", "Snelste levertijd"],
        cons: ["Eigen merk (geen Hörmann)", "Kozijnaanpassing = meerwerk", "5 jaar garantie", "Minder isolatie"],
      },
    ],
  },
  {
    id: "2",
    title: "Reparatie verlichting sectie B",
    description: "Vervanging van 6 TL-armaturen door LED-verlichting in sectie B van de parkeergarage. Inclusief noodverlichting conform NEN 1010.",
    category: "verlichting",
    status: "requested",
    createdAt: "2026-02-18",
    deadline: "2026-03-15",
    estimatedBudget: 1200,
    approvalLevel: "board",
    selectedQuoteId: null,
    aiRecommendation: null,
    quotes: [],
  },
  {
    id: "3",
    title: "Herstel bestrating binnenterrein",
    description: "Opnieuw bestraten van het binnenterrein bij de inrit. Circa 45m² klinkers opnemen, zandbed egaliseren en herbestraten.",
    category: "bestrating",
    status: "approved",
    createdAt: "2026-01-25",
    deadline: "2026-02-28",
    estimatedBudget: 2500,
    approvalLevel: "board",
    selectedQuoteId: "q4",
    aiRecommendation: "Tuinman Plus biedt de beste aanpak met hergebruik van bestaande klinkers, wat kosten bespaart. 5 jaar garantie op het werk.",
    quotes: [
      {
        id: "q4",
        contractor: "Tuinman Plus",
        amount: 2200,
        description: "Klinkers opnemen, zandbed egaliseren (incl. verdichting), herbestraten met bestaande klinkers. Aanvulling nieuwe klinkers waar nodig.",
        timeline: "1-2 dagen",
        receivedAt: "2026-02-05",
        pros: ["Hergebruik klinkers", "Snelle uitvoering", "5 jaar garantie"],
        cons: [],
      },
      {
        id: "q5",
        contractor: "Bestratingen de Wit",
        amount: 3100,
        description: "Complete nieuwe bestrating inclusief nieuwe klinkers, nieuw zandbed en waterdoorlatende voegen.",
        timeline: "2-3 dagen",
        receivedAt: "2026-02-08",
        pros: ["Volledig nieuw", "Waterdoorlatend"],
        cons: ["Significant duurder", "Nieuwe klinkers wellicht andere kleur"],
      },
    ],
  },
];

/* ─── Component ─── */

export default function OffertesPage() {
  const [requests, setRequests] = useState<QuoteRequest[]>(initialRequests);
  const [expandedId, setExpandedId] = useState<string | null>("1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [quoteForRequestId, setQuoteForRequestId] = useState<string | null>(null);

  // New request form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  // New quote form
  const [qContractor, setQContractor] = useState("");
  const [qAmount, setQAmount] = useState("");
  const [qDesc, setQDesc] = useState("");
  const [qTimeline, setQTimeline] = useState("");

  function createRequest() {
    if (!newTitle || !newCategory || !newBudget || !newDeadline) {
      toast.error("Vul alle verplichte velden in.");
      return;
    }
    const budget = parseFloat(newBudget);
    const req: QuoteRequest = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      category: newCategory,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      deadline: newDeadline,
      estimatedBudget: budget,
      approvalLevel: budget > BOARD_APPROVAL_LIMIT ? "alv" : "board",
      quotes: [],
      selectedQuoteId: null,
      aiRecommendation: null,
    };
    setRequests((prev) => [req, ...prev]);
    setNewTitle(""); setNewDesc(""); setNewCategory(""); setNewBudget(""); setNewDeadline("");
    setDialogOpen(false);
    toast.success("Offerteaanvraag aangemaakt!");
  }

  function sendRequests(requestId: string) {
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: "requested" as const } : r)
    );
    toast.success("Offerteaanvragen verstuurd naar aannemers!");
  }

  function addQuote() {
    if (!qContractor || !qAmount || !qDesc || !qTimeline || !quoteForRequestId) {
      toast.error("Vul alle velden in.");
      return;
    }
    const quote: Quote = {
      id: Date.now().toString(),
      contractor: qContractor,
      amount: parseFloat(qAmount),
      description: qDesc,
      timeline: qTimeline,
      receivedAt: new Date().toISOString().split("T")[0],
      pros: [],
      cons: [],
    };
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== quoteForRequestId) return r;
        const newQuotes = [...r.quotes, quote];
        return {
          ...r,
          quotes: newQuotes,
          status: newQuotes.length >= 1 ? "quotes_received" as const : r.status,
        };
      })
    );
    setQContractor(""); setQAmount(""); setQDesc(""); setQTimeline("");
    setQuoteDialogOpen(false);
    toast.success("Offerte toegevoegd!");
  }

  function generateAIComparison(requestId: string) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId || r.quotes.length === 0) return r;
        const sorted = [...r.quotes].sort((a, b) => a.amount - b.amount);
        const cheapest = sorted[0];
        const expensive = sorted[sorted.length - 1];
        const avg = r.quotes.reduce((s, q) => s + q.amount, 0) / r.quotes.length;

        const recommendation = `AI-analyse van ${r.quotes.length} offertes:\n\n` +
          `Prijsrange: €${cheapest.amount.toLocaleString("nl-NL")} - €${expensive.amount.toLocaleString("nl-NL")} (gem. €${Math.round(avg).toLocaleString("nl-NL")})\n\n` +
          `Aanbeveling: **${cheapest.contractor}** biedt met €${cheapest.amount.toLocaleString("nl-NL")} de scherpste prijs. ` +
          `Dit is ${Math.round(((expensive.amount - cheapest.amount) / expensive.amount) * 100)}% goedkoper dan de duurste offerte. ` +
          (r.estimatedBudget > 0
            ? `Het geschatte budget was €${r.estimatedBudget.toLocaleString("nl-NL")} — de goedkoopste offerte zit ${cheapest.amount <= r.estimatedBudget ? "binnen" : "boven"} het budget.`
            : "") +
          `\n\n${r.approvalLevel === "alv" ? "Let op: Dit bedrag vereist goedkeuring door de ALV (>€2.500)." : "Dit bedrag kan door het bestuur worden goedgekeurd (<€2.500)."}`;

        return { ...r, aiRecommendation: recommendation, status: "under_review" as const };
      })
    );
    toast.success("AI-vergelijking gegenereerd!");
  }

  function selectQuote(requestId: string, quoteId: string) {
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, selectedQuoteId: quoteId } : r)
    );
  }

  function approveRequest(requestId: string) {
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: "approved" as const } : r)
    );
    toast.success("Offerte goedgekeurd!");
  }

  function commissionWork(requestId: string) {
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: "commissioned" as const } : r)
    );
    toast.success("Opdracht verleend! Aannemer wordt op de hoogte gesteld.");
  }

  function rejectRequest(requestId: string) {
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, status: "rejected" as const } : r)
    );
    toast.info("Offerteaanvraag afgewezen.");
  }

  // Stats
  const activeCount = requests.filter((r) => !["approved", "rejected", "commissioned"].includes(r.status)).length;
  const approvedCount = requests.filter((r) => r.status === "approved" || r.status === "commissioned").length;
  const totalQuotes = requests.reduce((s, r) => s + r.quotes.length, 0);
  const totalBudget = requests.filter((r) => r.status === "approved" || r.status === "commissioned")
    .reduce((s, r) => {
      const selected = r.quotes.find((q) => q.id === r.selectedQuoteId);
      return s + (selected ? selected.amount : r.estimatedBudget);
    }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-blue-600" />
            Offertes
          </h1>
          <p className="text-muted-foreground">Vraag offertes aan, vergelijk met AI en keur goed</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe aanvraag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Offerteaanvraag maken</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Titel *</Label>
                <Input placeholder="bijv. Vervanging garagedeuren" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Omschrijving</Label>
                <Textarea placeholder="Beschrijf de gewenste werkzaamheden in detail" rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Categorie *</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger><SelectValue placeholder="Selecteer categorie" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Geschat budget *</Label>
                  <Input type="number" placeholder="0.00" step="100" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Deadline *</Label>
                  <Input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
                </div>
              </div>
              {newBudget && parseFloat(newBudget) > BOARD_APPROVAL_LIMIT && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-orange-800">
                    Budget boven &euro;{BOARD_APPROVAL_LIMIT.toLocaleString()} &mdash; goedkeuring door de ALV is vereist conform de splitsingsakte.
                  </p>
                </div>
              )}
              <Button className="w-full" onClick={createRequest}>Aanvraag maken</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Lopende aanvragen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-purple-600">{totalQuotes}</p>
            <p className="text-sm text-muted-foreground">Offertes ontvangen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            <p className="text-sm text-muted-foreground">Goedgekeurd</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">&euro;{totalBudget.toLocaleString("nl-NL")}</p>
            <p className="text-sm text-muted-foreground">Totaal goedgekeurd</p>
          </CardContent>
        </Card>
      </div>

      {/* Approval threshold info */}
      <Card className="border-blue-100 bg-blue-50/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Goedkeuringsdrempel</p>
              <p className="text-xs text-muted-foreground">
                Tot &euro;{BOARD_APPROVAL_LIMIT.toLocaleString()}: bestuursbesluit &bull; Boven &euro;{BOARD_APPROVAL_LIMIT.toLocaleString()}: ALV-stemming vereist
              </p>
            </div>
            <Badge variant="outline" className="text-blue-700">Conform splitsingsakte art. 41</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quote dialog (for adding quotes to a request) */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offerte toevoegen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Aannemer / bedrijf *</Label>
              <Input placeholder="Bedrijfsnaam" value={qContractor} onChange={(e) => setQContractor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bedrag (excl. BTW) *</Label>
              <Input type="number" placeholder="0.00" step="100" value={qAmount} onChange={(e) => setQAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Omschrijving werkzaamheden *</Label>
              <Textarea placeholder="Wat is er precies geoffreerd?" rows={3} value={qDesc} onChange={(e) => setQDesc(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Doorlooptijd *</Label>
              <Input placeholder="bijv. 2-3 weken" value={qTimeline} onChange={(e) => setQTimeline(e.target.value)} />
            </div>
            <Button className="w-full" onClick={addQuote}>Offerte toevoegen</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Requests list */}
      <div className="space-y-4">
        {requests.map((req) => {
          const expanded = expandedId === req.id;
          const sc = statusConfig[req.status];
          const selectedQuote = req.quotes.find((q) => q.id === req.selectedQuoteId);
          const cheapest = req.quotes.length > 0 ? Math.min(...req.quotes.map((q) => q.amount)) : 0;
          const expensive = req.quotes.length > 0 ? Math.max(...req.quotes.map((q) => q.amount)) : 0;

          return (
            <Card key={req.id} className={req.status === "under_review" ? "border-yellow-200" : req.status === "approved" ? "border-green-200" : ""}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : req.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className={sc.color} variant="secondary">{sc.label}</Badge>
                      <Badge variant="outline">{categoryLabels[req.category] || req.category}</Badge>
                      <Badge variant={req.approvalLevel === "alv" ? "default" : "secondary"} className="text-xs">
                        {req.approvalLevel === "alv" ? "ALV-goedkeuring" : "Bestuursbesluit"}
                      </Badge>
                      {req.quotes.length > 0 && (
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">
                          {req.quotes.length} offerte{req.quotes.length !== 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">{req.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Euro className="h-3.5 w-3.5" />
                        Budget: &euro;{req.estimatedBudget.toLocaleString("nl-NL")}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Deadline: {new Date(req.deadline).toLocaleDateString("nl-NL")}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedQuote && (
                      <span className="text-sm font-semibold text-green-600">
                        &euro;{selectedQuote.amount.toLocaleString("nl-NL")}
                      </span>
                    )}
                    {expanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </div>
              </CardHeader>

              {expanded && (
                <CardContent className="space-y-4 border-t pt-4">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{req.description}</p>

                  {/* Action buttons based on status */}
                  {req.status === "draft" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => sendRequests(req.id)}>
                        <Send className="mr-1.5 h-3.5 w-3.5" />
                        Verstuur naar aannemers
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setQuoteForRequestId(req.id); setQuoteDialogOpen(true); }}>
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Offerte handmatig toevoegen
                      </Button>
                    </div>
                  )}

                  {req.status === "requested" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setQuoteForRequestId(req.id); setQuoteDialogOpen(true); }}>
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Offerte toevoegen
                      </Button>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Wachtend op offertes van aannemers...
                      </p>
                    </div>
                  )}

                  {/* Quotes comparison */}
                  {req.quotes.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Ontvangen offertes</h4>
                        {req.quotes.length >= 2 && !req.aiRecommendation && (
                          <Button size="sm" variant="outline" onClick={() => generateAIComparison(req.id)}>
                            <Brain className="mr-1.5 h-3.5 w-3.5 text-purple-600" />
                            AI-vergelijking
                          </Button>
                        )}
                        {(req.status === "quotes_received" || req.status === "requested") && (
                          <Button size="sm" variant="outline" onClick={() => { setQuoteForRequestId(req.id); setQuoteDialogOpen(true); }}>
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            Nog een offerte
                          </Button>
                        )}
                      </div>

                      {/* Price range bar */}
                      {req.quotes.length >= 2 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>&euro;{cheapest.toLocaleString("nl-NL")}</span>
                            <span>Budget: &euro;{req.estimatedBudget.toLocaleString("nl-NL")}</span>
                            <span>&euro;{expensive.toLocaleString("nl-NL")}</span>
                          </div>
                          <div className="relative h-2 bg-gray-200 rounded-full">
                            {req.quotes.map((q) => {
                              const pct = expensive > cheapest ? ((q.amount - cheapest) / (expensive - cheapest)) * 100 : 50;
                              return (
                                <div
                                  key={q.id}
                                  className={`absolute top-0 w-3 h-3 -mt-0.5 rounded-full border-2 border-white ${
                                    q.id === req.selectedQuoteId ? "bg-green-500 ring-2 ring-green-200" :
                                    q.amount === cheapest ? "bg-blue-500" : "bg-gray-400"
                                  }`}
                                  style={{ left: `calc(${pct}% - 6px)` }}
                                  title={`${q.contractor}: €${q.amount.toLocaleString("nl-NL")}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Quote cards */}
                      <div className="grid gap-3">
                        {req.quotes.map((q) => (
                          <div
                            key={q.id}
                            className={`border rounded-lg p-4 transition-colors ${
                              req.selectedQuoteId === q.id
                                ? "border-green-300 bg-green-50/50 ring-1 ring-green-200"
                                : "hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-sm">{q.contractor}</span>
                                  {q.amount === cheapest && req.quotes.length > 1 && (
                                    <Badge className="bg-blue-50 text-blue-700 text-xs" variant="secondary">Goedkoopst</Badge>
                                  )}
                                  {req.selectedQuoteId === q.id && (
                                    <Badge className="bg-green-50 text-green-700 text-xs" variant="secondary">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />Geselecteerd
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Ontvangen: {new Date(q.receivedAt).toLocaleDateString("nl-NL")} &bull; Levertijd: {q.timeline}
                                </p>
                              </div>
                              <p className="text-lg font-bold">&euro;{q.amount.toLocaleString("nl-NL")}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{q.description}</p>

                            {(q.pros.length > 0 || q.cons.length > 0) && (
                              <div className="flex gap-4 mb-2">
                                {q.pros.length > 0 && (
                                  <div className="flex-1">
                                    {q.pros.map((p, i) => (
                                      <span key={i} className="inline-flex items-center gap-1 text-xs text-green-700 mr-2">
                                        <ThumbsUp className="h-3 w-3" />{p}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {q.cons.length > 0 && (
                                  <div className="flex-1">
                                    {q.cons.map((c, i) => (
                                      <span key={i} className="inline-flex items-center gap-1 text-xs text-red-700 mr-2">
                                        <ThumbsDown className="h-3 w-3" />{c}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {!req.selectedQuoteId && req.status !== "approved" && req.status !== "commissioned" && req.status !== "rejected" && (
                              <Button size="sm" variant="outline" onClick={() => selectQuote(req.id, q.id)} className="mt-1">
                                Selecteer deze offerte
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Recommendation */}
                  {req.aiRecommendation && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">AI Advies</span>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {req.aiRecommendation.split("**").map((part, i) =>
                          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Approval actions */}
                  {req.selectedQuoteId && req.status !== "approved" && req.status !== "commissioned" && req.status !== "rejected" && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">
                        {req.approvalLevel === "alv"
                          ? "ALV-goedkeuring vereist"
                          : "Bestuursbesluit"
                        }
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Geselecteerd: {req.quotes.find((q) => q.id === req.selectedQuoteId)?.contractor} voor
                        &euro;{req.quotes.find((q) => q.id === req.selectedQuoteId)?.amount.toLocaleString("nl-NL")}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approveRequest(req.id)}>
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          {req.approvalLevel === "alv" ? "Goedkeuren (na ALV-stemming)" : "Goedkeuren"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => rejectRequest(req.id)}>
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Afwijzen
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Commission action */}
                  {req.status === "approved" && (
                    <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Offerte goedgekeurd</p>
                        <p className="text-xs text-green-700">
                          {selectedQuote?.contractor} &mdash; &euro;{selectedQuote?.amount.toLocaleString("nl-NL")}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => commissionWork(req.id)}>
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Opdracht verlenen
                      </Button>
                    </div>
                  )}

                  {req.status === "commissioned" && (
                    <div className="bg-emerald-50 rounded-lg p-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium text-emerald-800">Opdracht verleend</p>
                        <p className="text-xs text-emerald-700">
                          {selectedQuote?.contractor} is op de hoogte gesteld. Verwachte doorlooptijd: {selectedQuote?.timeline}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
