"use client";

import { useState } from "react";
import {
  Receipt,
  Search,
  Plus,
  Users,
  Mail,
  Check,
  Eye,
  AlertTriangle,
  Clock,
  CircleDot,
  X,
  Send,
  FileText,
  Euro,
  CreditCard,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useSupabaseData } from "@/lib/use-supabase-data";
import { useVvE } from "@/lib/vve-context";

// --- Types ---

type InvoiceStatus = "draft" | "sent" | "open" | "paid" | "overdue" | "cancelled";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  member_id: string;
  member_name: string;
  member_email: string;
  unit: string;
  breukdeel: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  status: InvoiceStatus;
  period: string;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  sent_date?: string;
  notes?: string;
  created_at: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  unit: string;
  breukdeel: string;
  active: boolean;
}

// --- Config ---

const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Concept", variant: "secondary" },
  sent: { label: "Verzonden", variant: "default" },
  open: { label: "Openstaand", variant: "default" },
  paid: { label: "Betaald", variant: "outline" },
  overdue: { label: "Achterstallig", variant: "destructive" },
  cancelled: { label: "Geannuleerd", variant: "secondary" },
};

// --- Demo Data ---

const initialMembers: Member[] = [
  { id: "m1", name: "Hidde van den Bergh", email: "hidde@example.nl", unit: "Box 1", breukdeel: "1/24", active: true },
  { id: "m2", name: "Jan de Vries", email: "jan@example.nl", unit: "Box 2", breukdeel: "1/24", active: true },
  { id: "m3", name: "Maria Jansen", email: "maria@example.nl", unit: "Box 3", breukdeel: "1/24", active: true },
  { id: "m4", name: "Pieter Bakker", email: "pieter@example.nl", unit: "Box 4", breukdeel: "1/24", active: true },
  { id: "m5", name: "Sophie Visser", email: "sophie@example.nl", unit: "Box 5", breukdeel: "1/24", active: true },
  { id: "m6", name: "Thomas Smit", email: "thomas@example.nl", unit: "Box 6", breukdeel: "1/24", active: true },
  { id: "m7", name: "Emma Mulder", email: "emma@example.nl", unit: "Box 7-8", breukdeel: "2/24", active: true },
  { id: "m8", name: "Lucas Bos", email: "lucas@example.nl", unit: "Box 9", breukdeel: "1/24", active: true },
];

const initialInvoices: Invoice[] = [
  {
    id: "inv-1", invoice_number: "VVE-2026-0001", member_id: "m1", member_name: "Hidde van den Bergh",
    member_email: "hidde@example.nl", unit: "Box 1", breukdeel: "1/24",
    items: [{ id: "i1", description: "Maandelijkse bijdrage januari 2026", quantity: 1, unit_price: 50, total: 50 }],
    subtotal: 50, total: 50, status: "paid", period: "Januari 2026",
    issue_date: "2026-01-01", due_date: "2026-01-31", paid_date: "2026-01-15", sent_date: "2026-01-01", created_at: "2026-01-01",
  },
  {
    id: "inv-2", invoice_number: "VVE-2026-0002", member_id: "m2", member_name: "Jan de Vries",
    member_email: "jan@example.nl", unit: "Box 2", breukdeel: "1/24",
    items: [{ id: "i2", description: "Maandelijkse bijdrage januari 2026", quantity: 1, unit_price: 50, total: 50 }],
    subtotal: 50, total: 50, status: "paid", period: "Januari 2026",
    issue_date: "2026-01-01", due_date: "2026-01-31", paid_date: "2026-01-20", sent_date: "2026-01-01", created_at: "2026-01-01",
  },
  {
    id: "inv-3", invoice_number: "VVE-2026-0003", member_id: "m3", member_name: "Maria Jansen",
    member_email: "maria@example.nl", unit: "Box 3", breukdeel: "1/24",
    items: [{ id: "i3", description: "Maandelijkse bijdrage januari 2026", quantity: 1, unit_price: 50, total: 50 }],
    subtotal: 50, total: 50, status: "paid", period: "Januari 2026",
    issue_date: "2026-01-01", due_date: "2026-01-31", paid_date: "2026-01-28", sent_date: "2026-01-01", created_at: "2026-01-01",
  },
  {
    id: "inv-4", invoice_number: "VVE-2026-0004", member_id: "m7", member_name: "Emma Mulder",
    member_email: "emma@example.nl", unit: "Box 7-8", breukdeel: "2/24",
    items: [{ id: "i4", description: "Maandelijkse bijdrage januari 2026", quantity: 1, unit_price: 100, total: 100 }],
    subtotal: 100, total: 100, status: "paid", period: "Januari 2026",
    issue_date: "2026-01-01", due_date: "2026-01-31", paid_date: "2026-01-10", sent_date: "2026-01-01", created_at: "2026-01-01",
  },
  {
    id: "inv-5", invoice_number: "VVE-2026-0009", member_id: "m3", member_name: "Maria Jansen",
    member_email: "maria@example.nl", unit: "Box 3", breukdeel: "1/24",
    items: [{ id: "i5", description: "Maandelijkse bijdrage februari 2026", quantity: 1, unit_price: 50, total: 50 }],
    subtotal: 50, total: 50, status: "overdue", period: "Februari 2026",
    issue_date: "2026-02-01", due_date: "2026-02-28", sent_date: "2026-02-01", created_at: "2026-02-01",
  },
  {
    id: "inv-6", invoice_number: "VVE-2026-0010", member_id: "m4", member_name: "Pieter Bakker",
    member_email: "pieter@example.nl", unit: "Box 4", breukdeel: "1/24",
    items: [{ id: "i6", description: "Maandelijkse bijdrage februari 2026", quantity: 1, unit_price: 50, total: 50 }],
    subtotal: 50, total: 50, status: "overdue", period: "Februari 2026",
    issue_date: "2026-02-01", due_date: "2026-02-28", sent_date: "2026-02-01", created_at: "2026-02-01",
  },
  {
    id: "inv-7", invoice_number: "VVE-2026-0015", member_id: "m5", member_name: "Sophie Visser",
    member_email: "sophie@example.nl", unit: "Box 5", breukdeel: "1/24",
    items: [{ id: "i7", description: "Maandelijkse bijdrage maart 2026", quantity: 1, unit_price: 50, total: 50 }],
    subtotal: 50, total: 50, status: "sent", period: "Maart 2026",
    issue_date: "2026-03-01", due_date: "2026-03-31", sent_date: "2026-03-01", created_at: "2026-03-01",
  },
  {
    id: "inv-8", invoice_number: "VVE-2026-0016", member_id: "m6", member_name: "Thomas Smit",
    member_email: "thomas@example.nl", unit: "Box 6", breukdeel: "1/24",
    items: [{ id: "i8", description: "Maandelijkse bijdrage maart 2026", quantity: 1, unit_price: 50, total: 50 }],
    subtotal: 50, total: 50, status: "open", period: "Maart 2026",
    issue_date: "2026-03-01", due_date: "2026-03-31", created_at: "2026-03-01",
  },
  {
    id: "inv-9", invoice_number: "VVE-2026-0017", member_id: "m7", member_name: "Emma Mulder",
    member_email: "emma@example.nl", unit: "Box 7-8", breukdeel: "2/24",
    items: [{ id: "i9", description: "Maandelijkse bijdrage maart 2026", quantity: 1, unit_price: 100, total: 100 }],
    subtotal: 100, total: 100, status: "draft", period: "Maart 2026",
    issue_date: "2026-03-01", due_date: "2026-03-31", created_at: "2026-03-01",
  },
  {
    id: "inv-10", invoice_number: "VVE-2026-0018", member_id: "m8", member_name: "Lucas Bos",
    member_email: "lucas@example.nl", unit: "Box 9", breukdeel: "1/24",
    items: [{ id: "i10", description: "Maandelijkse bijdrage april 2026", quantity: 1, unit_price: 50, total: 50 }],
    subtotal: 50, total: 50, status: "draft", period: "April 2026",
    issue_date: "2026-04-01", due_date: "2026-04-30", created_at: "2026-04-01",
  },
];

// --- Helpers ---

function parseBreukdeel(str: string): { numerator: number; denominator: number } {
  const parts = str.split("/");
  return { numerator: parseInt(parts[0], 10), denominator: parseInt(parts[1], 10) };
}

function calculateContribution(breukdeel: string, baseAmountPerUnit: number): number {
  const { numerator } = parseBreukdeel(breukdeel);
  return baseAmountPerUnit * numerator;
}

function generateInvoiceNumber(invoices: Invoice[], year: number): string {
  const yearInvoices = invoices.filter((inv) => inv.invoice_number.includes(`-${year}-`));
  const maxNum = yearInvoices.reduce((max, inv) => {
    const num = parseInt(inv.invoice_number.split("-")[2], 10);
    return num > max ? num : max;
  }, 0);
  return `VVE-${year}-${String(maxNum + 1).padStart(4, "0")}`;
}

function formatCurrency(amount: number): string {
  return `\u20AC${amount.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

// --- Component ---

export default function FacturenPage() {
  const { currentVvE } = useVvE();
  const { data: invoices, setData: setInvoices, loading: invoicesLoading, insert: insertInvoice, update: updateInvoice } = useSupabaseData<Invoice>("invoices", initialInvoices, {
    orderBy: "created_at",
    orderAsc: false,
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Create form state
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [newPeriod, setNewPeriod] = useState("");
  const [newBaseAmount, setNewBaseAmount] = useState("50");
  const [newDueDate, setNewDueDate] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Bulk form state
  const [bulkPeriod, setBulkPeriod] = useState("");
  const [bulkBaseAmount, setBulkBaseAmount] = useState("50");
  const [bulkDueDate, setBulkDueDate] = useState("");

  // --- Filters ---

  const filteredInvoices = invoices
    .filter((inv) => {
      if (activeTab === "open") return inv.status === "open" || inv.status === "sent";
      if (activeTab === "paid") return inv.status === "paid";
      if (activeTab === "overdue") return inv.status === "overdue";
      if (activeTab === "draft") return inv.status === "draft";
      return true;
    })
    .filter(
      (inv) =>
        inv.member_name.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        inv.period.toLowerCase().includes(search.toLowerCase())
    );

  // --- Stats ---

  const totalOpen = invoices
    .filter((inv) => ["open", "sent"].includes(inv.status))
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalOverdue = invoices.filter((inv) => inv.status === "overdue");
  const totalOverdueAmount = totalOverdue.reduce((sum, inv) => sum + inv.total, 0);
  const paidThisMonth = invoices.filter(
    (inv) => inv.status === "paid" && inv.paid_date && inv.paid_date.startsWith("2026")
  );
  const paidThisMonthAmount = paidThisMonth.reduce((sum, inv) => sum + inv.total, 0);
  const totalInvoiced = invoices
    .filter((inv) => inv.status !== "cancelled")
    .reduce((sum, inv) => sum + inv.total, 0);

  // --- Actions ---

  function handleCreateInvoices() {
    if (selectedMemberIds.length === 0 || !newPeriod || !newDueDate) {
      toast.error("Selecteer minimaal een lid, vul een periode en vervaldatum in.");
      return;
    }
    const base = parseFloat(newBaseAmount) || 50;
    const newInvoices: Invoice[] = selectedMemberIds.map((memberId) => {
      const member = initialMembers.find((m) => m.id === memberId)!;
      const amount = calculateContribution(member.breukdeel, base);
      const invNumber = generateInvoiceNumber([...invoices, ...newInvoices], 2026);
      return {
        id: `inv-${Date.now()}-${memberId}`,
        invoice_number: invNumber,
        member_id: member.id,
        member_name: member.name,
        member_email: member.email,
        unit: member.unit,
        breukdeel: member.breukdeel,
        items: [{ id: `item-${Date.now()}`, description: `Maandelijkse bijdrage ${newPeriod}`, quantity: 1, unit_price: amount, total: amount }],
        subtotal: amount,
        total: amount,
        status: "draft" as InvoiceStatus,
        period: newPeriod,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: newDueDate,
        notes: newNotes || undefined,
        created_at: new Date().toISOString(),
      };
    });
    setInvoices((prev) => [...prev, ...newInvoices]);
    setCreateDialogOpen(false);
    setSelectedMemberIds([]);
    setNewPeriod("");
    setNewDueDate("");
    setNewNotes("");
    toast.success(`${newInvoices.length} factuur/facturen aangemaakt.`);
  }

  function handleBulkCreate() {
    if (!bulkPeriod || !bulkDueDate) {
      toast.error("Vul een periode en vervaldatum in.");
      return;
    }
    const base = parseFloat(bulkBaseAmount) || 50;
    const activeMembers = initialMembers.filter((m) => m.active);
    const newInvoices: Invoice[] = [];
    for (const member of activeMembers) {
      const amount = calculateContribution(member.breukdeel, base);
      const invNumber = generateInvoiceNumber([...invoices, ...newInvoices], 2026);
      newInvoices.push({
        id: `inv-${Date.now()}-${member.id}`,
        invoice_number: invNumber,
        member_id: member.id,
        member_name: member.name,
        member_email: member.email,
        unit: member.unit,
        breukdeel: member.breukdeel,
        items: [{ id: `item-${Date.now()}-${member.id}`, description: `Maandelijkse bijdrage ${bulkPeriod}`, quantity: 1, unit_price: amount, total: amount }],
        subtotal: amount,
        total: amount,
        status: "draft" as InvoiceStatus,
        period: bulkPeriod,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: bulkDueDate,
        created_at: new Date().toISOString(),
      });
    }
    setInvoices((prev) => [...prev, ...newInvoices]);
    setBulkDialogOpen(false);
    setBulkPeriod("");
    setBulkDueDate("");
    toast.success(`${newInvoices.length} facturen aangemaakt voor alle leden.`);
  }

  async function markAsPaid(invoiceId: string) {
    const paid_date = new Date().toISOString().split("T")[0];
    try {
      await updateInvoice(invoiceId, { status: "paid" as InvoiceStatus, paid_date });
      if (detailInvoice?.id === invoiceId) {
        setDetailInvoice((prev) => prev ? { ...prev, status: "paid", paid_date } : null);
      }
      toast.success("Factuur gemarkeerd als betaald.");
    } catch { toast.error("Fout bij bijwerken."); }
  }

  async function markAsOverdue(invoiceId: string) {
    try {
      await updateInvoice(invoiceId, { status: "overdue" as InvoiceStatus });
      if (detailInvoice?.id === invoiceId) {
        setDetailInvoice((prev) => prev ? { ...prev, status: "overdue" } : null);
      }
      toast.success("Factuur gemarkeerd als achterstallig.");
    } catch { toast.error("Fout bij bijwerken."); }
  }

  async function cancelInvoice(invoiceId: string) {
    try {
      await updateInvoice(invoiceId, { status: "cancelled" as InvoiceStatus });
      if (detailInvoice?.id === invoiceId) {
        setDetailInvoice((prev) => prev ? { ...prev, status: "cancelled" } : null);
      }
      toast.success("Factuur geannuleerd.");
    } catch { toast.error("Fout bij bijwerken."); }
  }

  async function sendInvoice(invoice: Invoice) {
    setSendingId(invoice.id);
    try {
      const res = await fetch("/api/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice: {
            invoice_number: invoice.invoice_number,
            member_name: invoice.member_name,
            period: invoice.period,
            items: invoice.items,
            total: invoice.total,
            issue_date: invoice.issue_date,
            due_date: invoice.due_date,
          },
          to_email: invoice.member_email,
          vve_name: currentVvE?.name || "Garagepark De Linden",
          vve_iban: currentVvE?.iban || "NL91ABNA0417164300",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoice.id
              ? { ...inv, status: "sent" as InvoiceStatus, sent_date: new Date().toISOString().split("T")[0] }
              : inv
          )
        );
        if (detailInvoice?.id === invoice.id) {
          setDetailInvoice((prev) => prev ? { ...prev, status: "sent", sent_date: new Date().toISOString().split("T")[0] } : null);
        }
        toast.success(
          data.simulated
            ? `Factuur ${invoice.invoice_number} (demo): e-mail naar ${invoice.member_email}`
            : `Factuur ${invoice.invoice_number} verzonden naar ${invoice.member_email}`
        );
      } else {
        toast.error(data.error || "Verzenden mislukt.");
      }
    } catch {
      toast.error("Er is een fout opgetreden bij het verzenden.");
    } finally {
      setSendingId(null);
    }
  }

  async function createPaymentLink(invoice: Invoice) {
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          amount: invoice.total,
          description: `Bijdrage ${invoice.period}`,
          member_name: invoice.member_name,
          redirect_url: `${window.location.origin}/dashboard/facturen`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.simulated) {
          toast.success(`iDEAL betaallink aangemaakt (demo). Configureer MOLLIE_API_KEY voor echte betalingen.`);
        } else {
          window.open(data.checkout_url, "_blank");
          toast.success("Betaalpagina geopend in nieuw tabblad.");
        }
      } else {
        toast.error(data.error || "Betaallink aanmaken mislukt.");
      }
    } catch {
      toast.error("Er is een fout opgetreden.");
    }
  }

  function toggleMemberSelection(memberId: string) {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  }

  // --- Render ---

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Receipt className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Facturen</h1>
            <p className="text-sm text-muted-foreground">Beheer en verstuur facturen aan leden</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Bulk Create Dialog */}
          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Bulk aanmaken
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Facturen voor alle leden</DialogTitle>
                <DialogDescription>
                  Maak in een keer facturen aan voor alle actieve leden op basis van hun breukdeel.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Periode</Label>
                  <Input placeholder="bijv. April 2026" value={bulkPeriod} onChange={(e) => setBulkPeriod(e.target.value)} />
                </div>
                <div>
                  <Label>Basisbedrag per eenheid (&euro;)</Label>
                  <Input type="number" min="0" step="0.01" value={bulkBaseAmount} onChange={(e) => setBulkBaseAmount(e.target.value)} />
                </div>
                <div>
                  <Label>Vervaldatum</Label>
                  <Input type="date" value={bulkDueDate} onChange={(e) => setBulkDueDate(e.target.value)} />
                </div>
                {bulkPeriod && bulkDueDate && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        Voorbeeldberekening ({initialMembers.filter((m) => m.active).length} leden)
                      </p>
                      <div className="space-y-1">
                        {initialMembers.filter((m) => m.active).map((m) => (
                          <div key={m.id} className="flex justify-between text-sm">
                            <span>{m.name} ({m.unit})</span>
                            <span className="font-medium">{formatCurrency(calculateContribution(m.breukdeel, parseFloat(bulkBaseAmount) || 50))}</span>
                          </div>
                        ))}
                        <div className="border-t border-blue-200 pt-1 mt-2 flex justify-between font-semibold text-sm">
                          <span>Totaal</span>
                          <span>
                            {formatCurrency(
                              initialMembers
                                .filter((m) => m.active)
                                .reduce((sum, m) => sum + calculateContribution(m.breukdeel, parseFloat(bulkBaseAmount) || 50), 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>Annuleren</Button>
                <Button onClick={handleBulkCreate}>Alle facturen aanmaken</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Single Create Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Factuur aanmaken
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nieuwe factuur</DialogTitle>
                <DialogDescription>Selecteer leden en stel het bedrag in op basis van hun breukdeel.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Selecteer leden</Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto mt-1">
                    {initialMembers.filter((m) => m.active).map((m) => (
                      <div key={m.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedMemberIds.includes(m.id)}
                          onCheckedChange={() => toggleMemberSelection(m.id)}
                        />
                        <span className="text-sm flex-1">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.unit} - {m.breukdeel}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Periode</Label>
                  <Input placeholder="bijv. April 2026" value={newPeriod} onChange={(e) => setNewPeriod(e.target.value)} />
                </div>
                <div>
                  <Label>Basisbedrag per eenheid (&euro;)</Label>
                  <Input type="number" min="0" step="0.01" value={newBaseAmount} onChange={(e) => setNewBaseAmount(e.target.value)} />
                </div>
                <div>
                  <Label>Vervaldatum</Label>
                  <Input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                </div>
                <div>
                  <Label>Notities (optioneel)</Label>
                  <Textarea placeholder="Extra informatie op de factuur..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
                </div>
                {selectedMemberIds.length > 0 && newPeriod && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium text-blue-800 mb-2">Voorbeeldberekening</p>
                      <div className="space-y-1">
                        {selectedMemberIds.map((id) => {
                          const m = initialMembers.find((m) => m.id === id)!;
                          return (
                            <div key={id} className="flex justify-between text-sm">
                              <span>{m.name} ({m.breukdeel})</span>
                              <span className="font-medium">{formatCurrency(calculateContribution(m.breukdeel, parseFloat(newBaseAmount) || 50))}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Annuleren</Button>
                <Button onClick={handleCreateInvoices}>Aanmaken ({selectedMemberIds.length})</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Openstaand</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalOpen)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Betaald</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(paidThisMonthAmount)}</p>
                <p className="text-xs text-muted-foreground">{paidThisMonth.length} facturen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achterstallig</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdueAmount)}</p>
                <p className="text-xs text-muted-foreground">{totalOverdue.length} facturen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Euro className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Totaal gefactureerd</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Alle ({invoices.length})</TabsTrigger>
                <TabsTrigger value="open">Openstaand ({invoices.filter((i) => i.status === "open" || i.status === "sent").length})</TabsTrigger>
                <TabsTrigger value="paid">Betaald ({invoices.filter((i) => i.status === "paid").length})</TabsTrigger>
                <TabsTrigger value="overdue">Achterstallig ({invoices.filter((i) => i.status === "overdue").length})</TabsTrigger>
                <TabsTrigger value="draft">Concept ({invoices.filter((i) => i.status === "draft").length})</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek op naam, nummer, periode..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factuurnummer</TableHead>
                <TableHead>Lid</TableHead>
                <TableHead className="hidden md:table-cell">Eenheid</TableHead>
                <TableHead className="hidden lg:table-cell">Periode</TableHead>
                <TableHead className="text-right">Bedrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Vervaldatum</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Geen facturen gevonden.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((inv) => (
                  <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setDetailInvoice(inv)}>
                    <TableCell className="font-mono text-sm">{inv.invoice_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{inv.member_name}</p>
                        <p className="text-xs text-muted-foreground">{inv.member_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{inv.unit}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{inv.period}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(inv.total)}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[inv.status].variant}>
                        {statusConfig[inv.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{formatDate(inv.due_date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailInvoice(inv)} title="Bekijken">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(inv.status === "draft" || inv.status === "overdue") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => sendInvoice(inv)}
                            disabled={sendingId === inv.id}
                            title="Versturen"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        {inv.status !== "paid" && inv.status !== "cancelled" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markAsPaid(inv.id)} title="Markeer als betaald">
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={detailInvoice !== null} onOpenChange={(open) => { if (!open) setDetailInvoice(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Factuur {detailInvoice.invoice_number}
                    </DialogTitle>
                    <DialogDescription>
                      {detailInvoice.period} - {detailInvoice.member_name}
                    </DialogDescription>
                  </div>
                  <Badge variant={statusConfig[detailInvoice.status].variant} className="text-sm">
                    {statusConfig[detailInvoice.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-6 py-4 border-b">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Van</p>
                  <p className="font-semibold">Garagepark De Linden</p>
                  <p className="text-sm text-muted-foreground">Lindenlaan 15</p>
                  <p className="text-sm text-muted-foreground">1234 AB Amsterdam</p>
                  <p className="text-sm text-muted-foreground mt-1">IBAN: NL91ABNA0417164300</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Aan</p>
                  <p className="font-semibold">{detailInvoice.member_name}</p>
                  <p className="text-sm text-muted-foreground">{detailInvoice.member_email}</p>
                  <p className="text-sm text-muted-foreground">{detailInvoice.unit} (breukdeel: {detailInvoice.breukdeel})</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-4 py-3 border-b text-sm">
                <div>
                  <p className="text-muted-foreground">Factuurdatum</p>
                  <p className="font-medium">{formatDate(detailInvoice.issue_date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vervaldatum</p>
                  <p className="font-medium">{formatDate(detailInvoice.due_date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {detailInvoice.status === "paid" ? "Betaald op" : detailInvoice.sent_date ? "Verzonden op" : "Status"}
                  </p>
                  <p className="font-medium">
                    {detailInvoice.paid_date
                      ? formatDate(detailInvoice.paid_date)
                      : detailInvoice.sent_date
                        ? formatDate(detailInvoice.sent_date)
                        : statusConfig[detailInvoice.status].label}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Omschrijving</TableHead>
                    <TableHead className="text-center">Aantal</TableHead>
                    <TableHead className="text-right">Prijs</TableHead>
                    <TableHead className="text-right">Totaal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailInvoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={3} className="text-right">Totaal</TableCell>
                    <TableCell className="text-right">{formatCurrency(detailInvoice.total)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {detailInvoice.notes && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Notities</p>
                  <p className="text-sm">{detailInvoice.notes}</p>
                </div>
              )}

              {/* Status Timeline */}
              <div className="flex items-center gap-2 py-3 border-t">
                <div className={`flex items-center gap-1 text-xs ${detailInvoice.created_at ? "text-green-600" : "text-muted-foreground"}`}>
                  <CircleDot className="h-3 w-3" /> Aangemaakt
                </div>
                <div className="h-px flex-1 bg-border" />
                <div className={`flex items-center gap-1 text-xs ${detailInvoice.sent_date ? "text-green-600" : "text-muted-foreground"}`}>
                  <Send className="h-3 w-3" /> Verzonden
                </div>
                <div className="h-px flex-1 bg-border" />
                <div className={`flex items-center gap-1 text-xs ${detailInvoice.status === "paid" ? "text-green-600" : detailInvoice.status === "overdue" ? "text-red-600" : "text-muted-foreground"}`}>
                  {detailInvoice.status === "paid" ? <Check className="h-3 w-3" /> : detailInvoice.status === "overdue" ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {detailInvoice.status === "paid" ? "Betaald" : detailInvoice.status === "overdue" ? "Achterstallig" : "Betaling"}
                </div>
              </div>

              {/* Actions */}
              {detailInvoice.status !== "paid" && detailInvoice.status !== "cancelled" && (
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  {(detailInvoice.status === "draft" || detailInvoice.status === "overdue") && (
                    <Button onClick={() => sendInvoice(detailInvoice)} disabled={sendingId === detailInvoice.id}>
                      <Mail className="mr-2 h-4 w-4" />
                      {detailInvoice.status === "overdue" ? "Herinnering versturen" : "Versturen per e-mail"}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => createPaymentLink(detailInvoice)}>
                    <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
                    iDEAL betaallink
                  </Button>
                  <Button variant="outline" onClick={() => markAsPaid(detailInvoice.id)}>
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Markeer als betaald
                  </Button>
                  {detailInvoice.status !== "overdue" && (
                    <Button variant="outline" onClick={() => markAsOverdue(detailInvoice.id)}>
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                      Markeer achterstallig
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => cancelInvoice(detailInvoice.id)}>
                    <X className="mr-2 h-4 w-4" />
                    Annuleren
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
