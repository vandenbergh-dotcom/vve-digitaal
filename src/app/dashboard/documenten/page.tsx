"use client";

import { useState, useRef } from "react";
import { FileText, Upload, Search, Brain, Download, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSupabaseData } from "@/lib/use-supabase-data";
import { useVvE } from "@/lib/vve-context";
import { createClient } from "@/lib/supabase/client";

interface Doc {
  id: string;
  title: string;
  type: string;
  file_size?: number;
  size?: string;
  uploaded_at?: string;
  date?: string;
  ai_summary?: string;
  aiSummary?: string;
  file_path?: string;
}

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

const demoDocuments: Doc[] = [
  { id: "1", title: "Splitsingsakte Garagepark De Linden", type: "splitsingsakte", size: "2.4 MB", date: "2024-03-15", aiSummary: "24 garageboxen, gelijke breukdelen (1/24 per eenheid). Gezamenlijk eigendom: dak, vloer, garagedeuren, verlichting, riolering. Verhuur aan derden toegestaan mits schriftelijke melding aan bestuur." },
  { id: "2", title: "Huishoudelijk Reglement 2024", type: "huishoudelijk_reglement", size: "890 KB", date: "2024-06-01", aiSummary: "Regels voor gebruik garageboxen: geen bewoning, geen opslag gevaarlijke stoffen, maximale geluidsproductie 22:00-07:00. Parkeerregels op binnenterrein." },
  { id: "3", title: "Opstalverzekering 2026", type: "insurance", size: "1.1 MB", date: "2026-01-01", aiSummary: "Opstalverzekering via Centraal Beheer, premie \u20ac890/kwartaal. Dekking: brand, storm, waterschade, inbraak. Eigen risico: \u20ac500." },
  { id: "4", title: "Notulen ALV 15 december 2025", type: "minutes", size: "340 KB", date: "2025-12-15", aiSummary: "Besluiten: begroting 2026 goedgekeurd, reservefonds verhoogd naar \u20ac500/maand, garagedeuren vervanging goedgekeurd (start Q2 2026)." },
  { id: "5", title: "Jaarrekening 2025", type: "financial", size: "567 KB", date: "2026-01-31", aiSummary: "Totale inkomsten: \u20ac14.400, totale uitgaven: \u20ac11.200. Positief resultaat: \u20ac3.200. Reservefonds per 31-12-2025: \u20ac11.950." },
  { id: "6", title: "MJOP 2024-2034", type: "mjop", size: "1.8 MB", date: "2024-01-15", aiSummary: "10-jarig onderhoudsplan. Grote posten: garagedeuren vervanging (2026, \u20ac18.000), dakbedekking (2029, \u20ac25.000), verlichting LED (2027, \u20ac3.500)." },
];

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentenPage() {
  const { currentVvE, isConnected } = useVvE();
  const { data: documents, loading, refresh } = useSupabaseData<Doc>("documents", demoDocuments, {
    orderBy: "uploaded_at",
    orderAsc: false,
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!selectedFile || !uploadType) {
      toast.error("Selecteer een bestand en type.");
      return;
    }
    setUploading(true);
    try {
      if (isConnected && currentVvE) {
        const supabase = createClient();
        const filePath = `${currentVvE.id}/${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, selectedFile);
        if (uploadError) throw new Error(uploadError.message);

        const { error: dbError } = await supabase.from("documents").insert({
          vve_id: currentVvE.id,
          title: uploadTitle || selectedFile.name,
          type: uploadType,
          file_path: filePath,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
        });
        if (dbError) throw new Error(dbError.message);
        await refresh();
      }
      toast.success(`${uploadTitle || selectedFile.name} geupload.`);
      setDialogOpen(false);
      setSelectedFile(null);
      setUploadTitle("");
      setUploadType("");
    } catch (err) {
      toast.error(`Upload mislukt: ${err instanceof Error ? err.message : "Onbekende fout"}`);
    } finally {
      setUploading(false);
    }
  }

  const getDate = (d: Doc) => d.uploaded_at?.split("T")[0] || d.date || "";
  const getSize = (d: Doc) => d.size || formatFileSize(d.file_size);
  const getSummary = (d: Doc) => d.ai_summary || d.aiSummary || "";

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      getSummary(doc).toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Documenten
          </h1>
          <p className="text-muted-foreground">Alle VvE documenten op een plek</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Upload className="mr-2 h-4 w-4" /> Document uploaden</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Document uploaden</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <input type="file" ref={fileRef} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setSelectedFile(f); if (!uploadTitle) setUploadTitle(f.name.replace(/\.[^.]+$/, "")); }
              }} />
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${selectedFile ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-blue-400"}`}
                onClick={() => fileRef.current?.click()}
              >
                {selectedFile ? (
                  <>
                    <FileText className="h-10 w-10 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                    <p className="text-xs text-green-600">{formatFileSize(selectedFile.size)}</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium mb-1">Sleep een bestand hierheen</p>
                    <p className="text-xs text-muted-foreground">of klik om te selecteren (PDF, max 25 MB)</p>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label>Titel</Label>
                <Input placeholder="Documentnaam" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Type document *</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuleren</Button>
              <Button onClick={handleUpload} disabled={uploading || !selectedFile || !uploadType}>
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Uploaden
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Zoek in documenten..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Alle types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle types</SelectItem>
            {Object.entries(typeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={typeBadgeColor[doc.type] || "bg-gray-50 text-gray-700"} variant="secondary">
                      {typeLabels[doc.type] || doc.type}
                    </Badge>
                    {getSize(doc) && <span className="text-xs text-muted-foreground">{getSize(doc)}</span>}
                    {getDate(doc) && <span className="text-xs text-muted-foreground">{getDate(doc)}</span>}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {getSummary(doc) && (
                <div className="bg-purple-50/50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Brain className="h-3.5 w-3.5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">AI Samenvatting</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{getSummary(doc)}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Eye className="mr-1.5 h-3.5 w-3.5" /> Bekijken</Button>
                <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
