"use client";

import { useState } from "react";
import { FileText, Upload, Search, Brain, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const typeLabels: Record<string, string> = {
  splitsingsakte: "Splitsingsakte",
  huishoudelijk_reglement: "Huishoudelijk Reglement",
  insurance: "Verzekering",
  minutes: "Notulen",
  financial: "Financieel",
  jaarverslag: "Jaarverslag",
  mjop: "MJOP",
  maintenance: "Onderhoud",
  other: "Overig",
};

const typeBadgeColor: Record<string, string> = {
  splitsingsakte: "bg-blue-50 text-blue-700",
  huishoudelijk_reglement: "bg-indigo-50 text-indigo-700",
  insurance: "bg-green-50 text-green-700",
  minutes: "bg-yellow-50 text-yellow-700",
  financial: "bg-purple-50 text-purple-700",
  jaarverslag: "bg-orange-50 text-orange-700",
  mjop: "bg-red-50 text-red-700",
};

const demoDocuments = [
  {
    id: "1", title: "Splitsingsakte Garagepark De Linden", type: "splitsingsakte",
    size: "2.4 MB", date: "2024-03-15",
    aiSummary: "24 garageboxen, gelijke breukdelen (1/24 per eenheid). Gezamenlijk eigendom: dak, vloer, garagedeuren, verlichting, riolering. Verhuur aan derden toegestaan mits schriftelijke melding aan bestuur.",
  },
  {
    id: "2", title: "Huishoudelijk Reglement 2024", type: "huishoudelijk_reglement",
    size: "890 KB", date: "2024-06-01",
    aiSummary: "Regels voor gebruik garageboxen: geen bewoning, geen opslag gevaarlijke stoffen, maximale geluidsproductie 22:00-07:00. Parkeerregels op binnenterrein.",
  },
  {
    id: "3", title: "Opstalverzekering 2026", type: "insurance",
    size: "1.1 MB", date: "2026-01-01",
    aiSummary: "Opstalverzekering via Centraal Beheer, premie \u20ac890/kwartaal. Dekking: brand, storm, waterschade, inbraak. Eigen risico: \u20ac500.",
  },
  {
    id: "4", title: "Notulen ALV 15 december 2025", type: "minutes",
    size: "340 KB", date: "2025-12-15",
    aiSummary: "Besluiten: begroting 2026 goedgekeurd, reservefonds verhoogd naar \u20ac500/maand, garagedeuren vervanging goedgekeurd (start Q2 2026).",
  },
  {
    id: "5", title: "Jaarrekening 2025", type: "financial",
    size: "567 KB", date: "2026-01-31",
    aiSummary: "Totale inkomsten: \u20ac14.400, totale uitgaven: \u20ac11.200. Positief resultaat: \u20ac3.200. Reservefonds per 31-12-2025: \u20ac11.950.",
  },
  {
    id: "6", title: "MJOP 2024-2034", type: "mjop",
    size: "1.8 MB", date: "2024-01-15",
    aiSummary: "10-jarig onderhoudsplan. Grote posten: garagedeuren vervanging (2026, \u20ac18.000), dakbedekking (2029, \u20ac25.000), verlichting LED (2027, \u20ac3.500).",
  },
];

export default function DocumentenPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = demoDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.aiSummary && doc.aiSummary.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Documenten
          </h1>
          <p className="text-muted-foreground">Alle VvE documenten op \u00e9\u00e9n plek</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Document uploaden
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Document uploaden</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Sleep een bestand hierheen</p>
                <p className="text-xs text-muted-foreground">of klik om te selecteren (PDF, max 25 MB)</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type document</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Uploaden</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek in documenten..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Alle types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle types</SelectItem>
            {Object.entries(typeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={typeBadgeColor[doc.type] || "bg-gray-50 text-gray-700"} variant="secondary">
                      {typeLabels[doc.type]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {doc.aiSummary && (
                <div className="bg-purple-50/50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Brain className="h-3.5 w-3.5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">AI Samenvatting</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{doc.aiSummary}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Bekijken
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
