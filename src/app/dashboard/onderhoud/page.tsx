"use client";

import { useState } from "react";
import { Wrench, Plus, Brain, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  reporterName: string;
  createdAt: string;
  estimatedCost: number;
  actualCost?: number;
  aiCategory: string;
  aiPriorityReason: string;
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Laag", color: "bg-gray-50 text-gray-700" },
  medium: { label: "Gemiddeld", color: "bg-yellow-50 text-yellow-700" },
  high: { label: "Hoog", color: "bg-orange-50 text-orange-700" },
  urgent: { label: "Urgent", color: "bg-red-50 text-red-700" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  reported: { label: "Gemeld", color: "bg-blue-50 text-blue-700" },
  assessed: { label: "Beoordeeld", color: "bg-purple-50 text-purple-700" },
  approved: { label: "Goedgekeurd", color: "bg-indigo-50 text-indigo-700" },
  in_progress: { label: "In uitvoering", color: "bg-yellow-50 text-yellow-700" },
  completed: { label: "Afgerond", color: "bg-green-50 text-green-700" },
};

const aiAnalysis: Record<string, { category: string; reason: string }> = {
  low: { category: "Algemeen", reason: "Lage prioriteit: geen direct veiligheidsrisico." },
  medium: { category: "Onderhoud", reason: "Gemiddelde prioriteit: planbaar onderhoud aanbevolen." },
  high: { category: "Veiligheid", reason: "Hoge prioriteit: kan schade of overlast veroorzaken." },
  urgent: { category: "Acuut", reason: "Urgent: directe actie vereist om verdere schade te voorkomen." },
};

const initialRequests: MaintenanceRequest[] = [
  {
    id: "1", title: "Verlichting parkeergarage sectie B defect",
    description: "3 van de 6 TL-buizen in sectie B zijn kapot. Het is erg donker bij boxen 13-18.",
    priority: "high", status: "approved", reporterName: "Sophie Visser",
    createdAt: "2026-02-18", estimatedCost: 450,
    aiCategory: "Verlichting", aiPriorityReason: "Veiligheidsrisico: onvoldoende verlichting verhoogt kans op ongelukken en inbraak.",
  },
  {
    id: "2", title: "Waterlek bij garagedeur box 3",
    description: "Bij hevige regenval komt er water onder de garagedeur door. Vloer staat blank.",
    priority: "urgent", status: "in_progress", reporterName: "Maria Jansen",
    createdAt: "2026-02-15", estimatedCost: 1200,
    aiCategory: "Waterschade", aiPriorityReason: "Urgent: waterschade kan snel verergeren en andere boxen aantasten.",
  },
  {
    id: "3", title: "Scharnieren garagedeur box 9 piepen",
    description: "De scharnieren van box 9 maken veel lawaai bij openen/sluiten.",
    priority: "low", status: "reported", reporterName: "Lucas de Groot",
    createdAt: "2026-02-10", estimatedCost: 75,
    aiCategory: "Garagedeuren", aiPriorityReason: "Lage prioriteit: overlast maar geen veiligheidsrisico. Smering kan volstaan.",
  },
  {
    id: "4", title: "Bestrating binnenterrein verzakt",
    description: "De bestrating bij de inrit is op meerdere plekken verzakt. Auto's botsen op de drempels.",
    priority: "medium", status: "assessed", reporterName: "Jan de Vries",
    createdAt: "2026-02-05", estimatedCost: 2500,
    aiCategory: "Bestrating", aiPriorityReason: "Gemiddelde prioriteit: kan schade aan voertuigen veroorzaken, maar is niet acuut.",
  },
  {
    id: "5", title: "Graffiti op buitenmuur",
    description: "Graffiti aangebracht op de buitenmuur aan de Lindenlaan-zijde.",
    priority: "low", status: "completed", reporterName: "Thomas Smit",
    createdAt: "2026-01-20", estimatedCost: 200, actualCost: 175,
    aiCategory: "Vandalisme", aiPriorityReason: "Cosmetisch, maar snel verwijderen voorkomt meer vandalisme.",
  },
];

export default function OnderhoudPage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("");

  function addRequest() {
    if (!newTitle || !newDesc || !newPriority) {
      toast.error("Vul alle verplichte velden in.");
      return;
    }
    const ai = aiAnalysis[newPriority] || aiAnalysis.medium;
    const req: MaintenanceRequest = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: "reported",
      reporterName: "Hidde van den Bergh",
      createdAt: new Date().toISOString().split("T")[0],
      estimatedCost: 0,
      aiCategory: ai.category,
      aiPriorityReason: ai.reason,
    };
    setRequests((prev) => [req, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setNewPriority("");
    setDialogOpen(false);
    toast.success("Onderhoudsverzoek ingediend!");
  }

  const openCount = requests.filter((r) => r.status === "reported" || r.status === "assessed" || r.status === "approved").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;
  const totalEstimated = requests.filter((r) => r.status !== "completed").reduce((s, r) => s + r.estimatedCost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6 text-blue-600" />
            Onderhoud
          </h1>
          <p className="text-muted-foreground">Meld en volg onderhoudsverzoeken</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Verzoek indienen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Onderhoudsverzoek indienen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Titel *</Label>
                <Input placeholder="Kort omschrijving van het probleem" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Beschrijving *</Label>
                <Textarea placeholder="Beschrijf het probleem in detail" rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Prioriteit *</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger><SelectValue placeholder="Selecteer prioriteit" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Laag</SelectItem>
                    <SelectItem value="medium">Gemiddeld</SelectItem>
                    <SelectItem value="high">Hoog</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Foto toevoegen (optioneel)</p>
              </div>
              <Button className="w-full" onClick={addRequest}>Verzoek indienen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-blue-600">{openCount}</p>
            <p className="text-sm text-muted-foreground">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-yellow-600">{inProgressCount}</p>
            <p className="text-sm text-muted-foreground">In uitvoering</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Afgerond</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">&euro;{totalEstimated.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Geschatte kosten</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests */}
      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={priorityConfig[req.priority]?.color} variant="secondary">
                      {priorityConfig[req.priority]?.label}
                    </Badge>
                    <Badge className={statusConfig[req.status]?.color} variant="secondary">
                      {statusConfig[req.status]?.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{req.title}</CardTitle>
                  <CardDescription>
                    Gemeld door {req.reporterName} op {req.createdAt}
                  </CardDescription>
                </div>
                {req.estimatedCost > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Geschat</p>
                    <p className="font-semibold">&euro;{req.estimatedCost.toLocaleString()}</p>
                    {req.actualCost && (
                      <>
                        <p className="text-xs text-muted-foreground mt-1">Werkelijk</p>
                        <p className="text-sm font-medium text-green-600">&euro;{req.actualCost.toLocaleString()}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{req.description}</p>
              {req.aiCategory && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Brain className="h-3.5 w-3.5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">AI Analyse</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Categorie:</strong> {req.aiCategory} &bull; {req.aiPriorityReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
