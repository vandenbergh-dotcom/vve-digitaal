"use client";

import { useState } from "react";
import {
  Grid3X3,
  Check,
  X,
  Clock,
  AlertTriangle,
  Minus,
  Mail,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// --- Types ---

type PaymentStatus = "paid" | "sent" | "open" | "overdue" | "draft" | "none";

interface MemberPayments {
  id: string;
  name: string;
  unit: string;
  breukdeel: string;
  payments: Record<string, { status: PaymentStatus; amount: number; invoice_number?: string; paid_date?: string }>;
}

// --- Config ---

const statusIcons: Record<PaymentStatus, { icon: typeof Check; color: string; label: string }> = {
  paid: { icon: Check, color: "text-green-600 bg-green-50", label: "Betaald" },
  sent: { icon: Mail, color: "text-blue-600 bg-blue-50", label: "Verzonden" },
  open: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Openstaand" },
  overdue: { icon: AlertTriangle, color: "text-red-600 bg-red-50", label: "Achterstallig" },
  draft: { icon: Minus, color: "text-gray-400 bg-gray-50", label: "Concept" },
  none: { icon: X, color: "text-gray-300 bg-gray-50/50", label: "Geen factuur" },
};

const periods = [
  "Jan 2026", "Feb 2026", "Mrt 2026", "Apr 2026",
  "Mei 2026", "Jun 2026", "Jul 2026", "Aug 2026",
  "Sep 2026", "Okt 2026", "Nov 2026", "Dec 2026",
];

// --- Demo Data ---

const memberPayments: MemberPayments[] = [
  {
    id: "m1", name: "Hidde van den Bergh", unit: "Box 1", breukdeel: "1/24",
    payments: {
      "Jan 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0001", paid_date: "2026-01-15" },
      "Feb 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0009", paid_date: "2026-02-12" },
      "Mrt 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0019", paid_date: "2026-03-10" },
      "Apr 2026": { status: "none", amount: 50 },
    },
  },
  {
    id: "m2", name: "Jan de Vries", unit: "Box 2", breukdeel: "1/24",
    payments: {
      "Jan 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0002", paid_date: "2026-01-20" },
      "Feb 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0010", paid_date: "2026-02-18" },
      "Mrt 2026": { status: "sent", amount: 50, invoice_number: "VVE-2026-0020" },
      "Apr 2026": { status: "none", amount: 50 },
    },
  },
  {
    id: "m3", name: "Maria Jansen", unit: "Box 3", breukdeel: "1/24",
    payments: {
      "Jan 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0003", paid_date: "2026-01-28" },
      "Feb 2026": { status: "overdue", amount: 50, invoice_number: "VVE-2026-0011" },
      "Mrt 2026": { status: "open", amount: 50, invoice_number: "VVE-2026-0021" },
      "Apr 2026": { status: "none", amount: 50 },
    },
  },
  {
    id: "m4", name: "Pieter Bakker", unit: "Box 4", breukdeel: "1/24",
    payments: {
      "Jan 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0005", paid_date: "2026-01-22" },
      "Feb 2026": { status: "overdue", amount: 50, invoice_number: "VVE-2026-0012" },
      "Mrt 2026": { status: "draft", amount: 50, invoice_number: "VVE-2026-0022" },
      "Apr 2026": { status: "none", amount: 50 },
    },
  },
  {
    id: "m5", name: "Sophie Visser", unit: "Box 5", breukdeel: "1/24",
    payments: {
      "Jan 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0006", paid_date: "2026-01-18" },
      "Feb 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0013", paid_date: "2026-02-20" },
      "Mrt 2026": { status: "sent", amount: 50, invoice_number: "VVE-2026-0015" },
      "Apr 2026": { status: "none", amount: 50 },
    },
  },
  {
    id: "m6", name: "Thomas Smit", unit: "Box 6", breukdeel: "1/24",
    payments: {
      "Jan 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0007", paid_date: "2026-01-25" },
      "Feb 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0014", paid_date: "2026-02-22" },
      "Mrt 2026": { status: "open", amount: 50, invoice_number: "VVE-2026-0016" },
      "Apr 2026": { status: "none", amount: 50 },
    },
  },
  {
    id: "m7", name: "Emma Mulder", unit: "Box 7-8", breukdeel: "2/24",
    payments: {
      "Jan 2026": { status: "paid", amount: 100, invoice_number: "VVE-2026-0004", paid_date: "2026-01-10" },
      "Feb 2026": { status: "paid", amount: 100, invoice_number: "VVE-2026-0008", paid_date: "2026-02-08" },
      "Mrt 2026": { status: "draft", amount: 100, invoice_number: "VVE-2026-0017" },
      "Apr 2026": { status: "none", amount: 100 },
    },
  },
  {
    id: "m8", name: "Lucas Bos", unit: "Box 9", breukdeel: "1/24",
    payments: {
      "Jan 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0008", paid_date: "2026-01-30" },
      "Feb 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0016", paid_date: "2026-02-25" },
      "Mrt 2026": { status: "paid", amount: 50, invoice_number: "VVE-2026-0024", paid_date: "2026-03-15" },
      "Apr 2026": { status: "draft", amount: 50, invoice_number: "VVE-2026-0018" },
    },
  },
];

// --- Helpers ---

function formatCurrency(amount: number): string {
  return `\u20AC${amount.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// --- Component ---

export default function BetalingsoverzichtPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const visiblePeriods = periods.filter((p) => p.includes(selectedYear));

  // Calculate totals per period
  function periodStats(period: string) {
    let paid = 0;
    let paidAmount = 0;
    let outstanding = 0;
    let outstandingAmount = 0;
    for (const member of memberPayments) {
      const p = member.payments[period];
      if (!p || p.status === "none") continue;
      if (p.status === "paid") {
        paid++;
        paidAmount += p.amount;
      } else {
        outstanding++;
        outstandingAmount += p.amount;
      }
    }
    return { paid, paidAmount, outstanding, outstandingAmount, total: paid + outstanding };
  }

  // Calculate totals per member
  function memberStats(member: MemberPayments) {
    let paid = 0;
    let paidAmount = 0;
    let outstanding = 0;
    for (const period of visiblePeriods) {
      const p = member.payments[period];
      if (!p || p.status === "none") continue;
      if (p.status === "paid") {
        paid++;
        paidAmount += p.amount;
      } else {
        outstanding++;
      }
    }
    return { paid, paidAmount, outstanding };
  }

  function sendAllOverdue() {
    toast.success("Herinneringen verzonden naar alle leden met achterstallige facturen.");
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Grid3X3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Betalingsoverzicht</h1>
              <p className="text-sm text-muted-foreground">Wie heeft betaald per periode - in een oogopslag</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={sendAllOverdue}>
              <Mail className="mr-2 h-4 w-4" />
              Alle herinneringen
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporteer
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusIcons).filter(([key]) => key !== "none").map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 text-sm">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${config.color}`}>
                <config.icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>

        {/* Matrix */}
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium min-w-[180px] sticky left-0 bg-white">Lid</th>
                  <th className="text-left py-2 pr-2 font-medium min-w-[60px]">Eenheid</th>
                  {visiblePeriods.map((period) => (
                    <th key={period} className="text-center py-2 px-1 font-medium min-w-[60px]">
                      {period.split(" ")[0]}
                    </th>
                  ))}
                  <th className="text-right py-2 pl-4 font-medium min-w-[100px]">Betaald</th>
                  <th className="text-right py-2 pl-2 font-medium min-w-[60px]">Open</th>
                </tr>
              </thead>
              <tbody>
                {memberPayments.map((member) => {
                  const stats = memberStats(member);
                  return (
                    <tr key={member.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 pr-4 font-medium sticky left-0 bg-white">
                        <div>
                          <p>{member.name}</p>
                          <p className="text-xs text-muted-foreground font-normal">{member.breukdeel}</p>
                        </div>
                      </td>
                      <td className="py-2 pr-2 text-muted-foreground">{member.unit}</td>
                      {visiblePeriods.map((period) => {
                        const payment = member.payments[period];
                        const status: PaymentStatus = payment?.status || "none";
                        const config = statusIcons[status];
                        const Icon = config.icon;
                        return (
                          <td key={period} className="py-2 px-1 text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={`w-8 h-8 rounded mx-auto flex items-center justify-center cursor-default ${config.color}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <p className="font-medium">{member.name} - {period}</p>
                                  <p>{config.label}{payment?.amount ? ` - ${formatCurrency(payment.amount)}` : ""}</p>
                                  {payment?.invoice_number && <p className="font-mono">{payment.invoice_number}</p>}
                                  {payment?.paid_date && <p>Betaald: {payment.paid_date}</p>}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </td>
                        );
                      })}
                      <td className="py-2 pl-4 text-right font-medium text-green-600">{formatCurrency(stats.paidAmount)}</td>
                      <td className="py-2 pl-2 text-right">
                        {stats.outstanding > 0 ? (
                          <Badge variant="destructive" className="text-xs">{stats.outstanding}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-green-600">0</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-medium">
                  <td className="py-3 pr-4 sticky left-0 bg-white">Totaal per maand</td>
                  <td></td>
                  {visiblePeriods.map((period) => {
                    const stats = periodStats(period);
                    return (
                      <td key={period} className="py-3 px-1 text-center">
                        {stats.total > 0 ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs">
                                <span className="text-green-600">{stats.paid}</span>
                                {stats.outstanding > 0 && (
                                  <span className="text-red-600">/{stats.outstanding}</span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                <p>{period}</p>
                                <p className="text-green-600">Betaald: {stats.paid} ({formatCurrency(stats.paidAmount)})</p>
                                {stats.outstanding > 0 && (
                                  <p className="text-red-600">Openstaand: {stats.outstanding} ({formatCurrency(stats.outstandingAmount)})</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-3 pl-4 text-right text-green-600">
                    {formatCurrency(memberPayments.reduce((sum, m) => sum + memberStats(m).paidAmount, 0))}
                  </td>
                  <td className="py-3 pl-2 text-right text-red-600">
                    {memberPayments.reduce((sum, m) => sum + memberStats(m).outstanding, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inningspercentage</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(() => {
                      let paid = 0;
                      let total = 0;
                      for (const m of memberPayments) {
                        for (const p of visiblePeriods) {
                          const pay = m.payments[p];
                          if (!pay || pay.status === "none") continue;
                          total++;
                          if (pay.status === "paid") paid++;
                        }
                      }
                      return total > 0 ? `${Math.round((paid / total) * 100)}%` : "0%";
                    })()}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Achterstallige leden</p>
                  <p className="text-2xl font-bold text-red-600">
                    {memberPayments.filter((m) =>
                      Object.values(m.payments).some((p) => p.status === "overdue")
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Grid3X3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Totaal ontvangen {selectedYear}</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(memberPayments.reduce((sum, m) => sum + memberStats(m).paidAmount, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
