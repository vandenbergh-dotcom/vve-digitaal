"use client";

import { useState } from "react";
import { Wallet, Plus, TrendingUp, TrendingDown, PiggyBank, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "contribution" | "expense" | "income" | "reserve_deposit";
  aiCategory: string;
}

const aiCategories: Record<string, string> = {
  Bijdragen: "Servicekosten",
  Onderhoud: "Reparatie",
  Energie: "Energie",
  Verzekering: "Verzekering",
  Schoonmaak: "Schoonmaak",
  Overig: "Overig",
};

const initialTransactions: Transaction[] = [
  { id: "1", date: "2026-02-20", description: "Maandelijkse bijdrage - alle leden", category: "Bijdragen", amount: 1200, type: "contribution", aiCategory: "Servicekosten" },
  { id: "2", date: "2026-02-18", description: "Elektriciteit verlichting parkeergarage", category: "Energie", amount: -145.50, type: "expense" as const, aiCategory: "Energie" },
  { id: "3", date: "2026-02-15", description: "Schoonmaak februari", category: "Onderhoud", amount: -250, type: "expense" as const, aiCategory: "Schoonmaak" },
  { id: "4", date: "2026-02-10", description: "Verzekeringspremie Q1", category: "Verzekering", amount: -890, type: "expense" as const, aiCategory: "Verzekering" },
  { id: "5", date: "2026-02-01", description: "Storting reservefonds", category: "Reservefonds", amount: -500, type: "reserve_deposit" as const, aiCategory: "Reserve" },
  { id: "6", date: "2026-01-20", description: "Maandelijkse bijdrage - alle leden", category: "Bijdragen", amount: 1200, type: "contribution" as const, aiCategory: "Servicekosten" },
  { id: "7", date: "2026-01-15", description: "Reparatie garagedeur box 12", category: "Onderhoud", amount: -375, type: "expense" as const, aiCategory: "Reparatie" },
  { id: "8", date: "2026-01-10", description: "Schoonmaak januari", category: "Onderhoud", amount: -250, type: "expense", aiCategory: "Schoonmaak" },
];

export default function FinancieelPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newCategory, setNewCategory] = useState("");

  function addTransaction() {
    if (!newType || !newAmount || !newDesc || !newDate) {
      toast.error("Vul alle verplichte velden in.");
      return;
    }
    const amount = parseFloat(newAmount);
    const isExpense = newType === "expense" || newType === "reserve_deposit";
    const tx: Transaction = {
      id: Date.now().toString(),
      date: newDate,
      description: newDesc,
      category: newCategory || "Overig",
      amount: isExpense ? -Math.abs(amount) : Math.abs(amount),
      type: newType as Transaction["type"],
      aiCategory: aiCategories[newCategory] || "Overig",
    };
    setTransactions((prev) => [tx, ...prev]);
    setNewType("");
    setNewAmount("");
    setNewDesc("");
    setNewCategory("");
    setDialogOpen(false);
    toast.success("Transactie toegevoegd!");
  }

  const filtered = transactions.filter(
    (t) => t.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0 && t.type !== "reserve_deposit").reduce((s, t) => s + t.amount, 0));
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            Financieel overzicht
          </h1>
          <p className="text-muted-foreground">Bijdragen, uitgaven en reservefonds</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Transactie toevoegen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuwe transactie</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contribution">Bijdrage</SelectItem>
                    <SelectItem value="expense">Uitgave</SelectItem>
                    <SelectItem value="income">Inkomst</SelectItem>
                    <SelectItem value="reserve_deposit">Storting reservefonds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bedrag *</Label>
                <Input type="number" placeholder="0.00" step="0.01" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Omschrijving *</Label>
                <Input placeholder="Beschrijving van de transactie" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Datum *</Label>
                <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Categorie</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger><SelectValue placeholder="Selecteer categorie" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bijdragen">Servicekosten</SelectItem>
                    <SelectItem value="Onderhoud">Onderhoud</SelectItem>
                    <SelectItem value="Energie">Energie</SelectItem>
                    <SelectItem value="Verzekering">Verzekering</SelectItem>
                    <SelectItem value="Schoonmaak">Schoonmaak</SelectItem>
                    <SelectItem value="Overig">Overig</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={addTransaction}>Opslaan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Inkomsten</span>
            </div>
            <p className="text-2xl font-bold text-green-600">&euro;{totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Uitgaven</span>
            </div>
            <p className="text-2xl font-bold text-red-600">&euro;{totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpDown className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Saldo</span>
            </div>
            <p className="text-2xl font-bold">&euro;{balance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Reservefonds</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">&euro;12.450</p>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Info */}
      <Card className="border-blue-100 bg-blue-50/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Maandelijkse bijdrage per eenheid</p>
              <p className="text-xs text-muted-foreground">Op basis van gelijke breukdelen (1/24)</p>
            </div>
            <p className="text-xl font-bold text-blue-700">&euro;50,00</p>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transacties</CardTitle>
            <Input
              placeholder="Zoeken..."
              className="max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Omschrijving</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>AI</TableHead>
                <TableHead className="text-right">Bedrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tx.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      AI: {tx.aiCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-mono ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {tx.amount > 0 ? "+" : ""}&euro;{Math.abs(tx.amount).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
