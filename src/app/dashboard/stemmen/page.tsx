"use client";

import { useState } from "react";
import { Vote, Plus, CheckCircle2, XCircle, MinusCircle, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface VoteItem {
  id: string;
  subject: string;
  description: string;
  type: string;
  status: "open" | "closed";
  deadline: string;
  forCount: number;
  againstCount: number;
  abstainCount: number;
  totalMembers: number;
  voted: number;
  result: string | null;
  myVote: string | null;
}

const initialVotes: VoteItem[] = [
  {
    id: "1",
    subject: "Vervanging garagedeuren sectie A",
    description: "Voorstel om de 12 garagedeuren in sectie A te vervangen door ge\u00efsoleerde sectionaaldeuren. Geschatte kosten: \u20ac18.000 uit reservefonds.",
    type: "qualified_majority",
    status: "open",
    deadline: "2026-03-15",
    forCount: 14,
    againstCount: 3,
    abstainCount: 1,
    totalMembers: 24,
    voted: 18,
    result: null,
    myVote: null,
  },
  {
    id: "2",
    subject: "Verhoging maandelijkse bijdrage naar \u20ac55",
    description: "Voorstel om de maandelijkse VvE-bijdrage te verhogen van \u20ac50 naar \u20ac55 per eenheid, vanwege gestegen energiekosten.",
    type: "simple_majority",
    status: "open",
    deadline: "2026-03-31",
    forCount: 8,
    againstCount: 5,
    abstainCount: 0,
    totalMembers: 24,
    voted: 13,
    result: null,
    myVote: null,
  },
  {
    id: "3",
    subject: "Goedkeuring begroting 2026",
    description: "Jaarlijkse begroting voor 2026. Totale begroting: \u20ac14.800.",
    type: "simple_majority",
    status: "closed",
    deadline: "2025-12-15",
    forCount: 15,
    againstCount: 1,
    abstainCount: 0,
    totalMembers: 24,
    voted: 16,
    result: "approved",
    myVote: "for",
  },
  {
    id: "4",
    subject: "Verhoging reservefonds storting",
    description: "Voorstel om de maandelijkse storting naar het reservefonds te verhogen van \u20ac350 naar \u20ac500.",
    type: "simple_majority",
    status: "closed",
    deadline: "2025-12-15",
    forCount: 14,
    againstCount: 2,
    abstainCount: 0,
    totalMembers: 24,
    voted: 16,
    result: "approved",
    myVote: "for",
  },
];

const typeLabels: Record<string, string> = {
  simple_majority: "Gewone meerderheid",
  qualified_majority: "Gekwalificeerde meerderheid (2/3)",
  unanimous: "Unanimiteit",
};

export default function StemmenPage() {
  const [votes, setVotes] = useState<VoteItem[]>(initialVotes);
  const [selectedVote, setSelectedVote] = useState<Record<string, string>>({});
  const [newOpen, setNewOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  function castVote(voteId: string) {
    const choice = selectedVote[voteId];
    if (!choice) return;

    setVotes((prev) =>
      prev.map((v) => {
        if (v.id !== voteId) return v;
        return {
          ...v,
          forCount: v.forCount + (choice === "for" ? 1 : 0),
          againstCount: v.againstCount + (choice === "against" ? 1 : 0),
          abstainCount: v.abstainCount + (choice === "abstain" ? 1 : 0),
          voted: v.voted + 1,
          myVote: choice,
        };
      })
    );
    toast.success("Uw stem is uitgebracht!");
  }

  function createVote() {
    if (!newSubject || !newType || !newDeadline) {
      toast.error("Vul alle verplichte velden in.");
      return;
    }
    const newVote: VoteItem = {
      id: Date.now().toString(),
      subject: newSubject,
      description: newDescription,
      type: newType,
      status: "open",
      deadline: newDeadline,
      forCount: 0,
      againstCount: 0,
      abstainCount: 0,
      totalMembers: 24,
      voted: 0,
      result: null,
      myVote: null,
    };
    setVotes((prev) => [newVote, ...prev]);
    setNewSubject("");
    setNewDescription("");
    setNewType("");
    setNewDeadline("");
    setNewOpen(false);
    toast.success("Stemming aangemaakt!");
  }

  const openVotes = votes.filter((v) => v.status === "open");
  const closedVotes = votes.filter((v) => v.status === "closed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Vote className="h-6 w-6 text-blue-600" />
            Stemmingen
          </h1>
          <p className="text-muted-foreground">Digitaal stemmen met automatische quorum-berekening</p>
        </div>
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe stemming
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Stemming aanmaken</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Onderwerp *</Label>
                <Input placeholder="Waar wordt over gestemd?" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Toelichting</Label>
                <Textarea placeholder="Beschrijf het voorstel" rows={3} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Type meerderheid *</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple_majority">Gewone meerderheid (&gt;50%)</SelectItem>
                    <SelectItem value="qualified_majority">Gekwalificeerde meerderheid (2/3)</SelectItem>
                    <SelectItem value="unanimous">Unanimiteit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deadline *</Label>
                <Input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
              </div>
              <Button className="w-full" onClick={createVote}>Stemming starten</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Open Votes */}
      {openVotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Openstaande stemmingen</h2>
          {openVotes.map((vote) => {
            const quorumMet = vote.voted >= Math.ceil(vote.totalMembers / 2);
            const forPct = vote.voted > 0 ? Math.round((vote.forCount / vote.voted) * 100) : 0;
            const againstPct = vote.voted > 0 ? Math.round((vote.againstCount / vote.voted) * 100) : 0;

            return (
              <Card key={vote.id} className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-blue-50 text-blue-700" variant="secondary">Open</Badge>
                    <Badge variant="outline">{typeLabels[vote.type]}</Badge>
                  </div>
                  <CardTitle className="text-lg">{vote.subject}</CardTitle>
                  <CardDescription>{vote.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Results so far */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Voor: {vote.forCount} ({forPct}%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Tegen: {vote.againstCount} ({againstPct}%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MinusCircle className="h-4 w-4 text-gray-400" />
                        Onthouding: {vote.abstainCount}
                      </span>
                    </div>
                    <div className="flex gap-0.5 h-3 rounded-full overflow-hidden bg-gray-100">
                      <div className="bg-green-500 transition-all" style={{ width: `${forPct}%` }} />
                      <div className="bg-red-500 transition-all" style={{ width: `${againstPct}%` }} />
                    </div>
                  </div>

                  {/* Quorum & Deadline */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {vote.voted}/{vote.totalMembers} gestemd
                      {quorumMet ? (
                        <Badge className="bg-green-50 text-green-700 text-xs" variant="secondary">Quorum bereikt</Badge>
                      ) : (
                        <Badge className="bg-orange-50 text-orange-700 text-xs" variant="secondary">Nog {Math.ceil(vote.totalMembers / 2) - vote.voted} nodig</Badge>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Deadline: {new Date(vote.deadline).toLocaleDateString("nl-NL")}
                    </span>
                  </div>

                  {/* Cast Vote */}
                  {vote.myVote ? (
                    <div className="bg-green-50 rounded-lg p-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        U heeft gestemd: {vote.myVote === "for" ? "Voor" : vote.myVote === "against" ? "Tegen" : "Onthouding"}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium mb-3">Uw stem uitbrengen</p>
                      <RadioGroup
                        value={selectedVote[vote.id] || ""}
                        onValueChange={(val) => setSelectedVote((prev) => ({ ...prev, [vote.id]: val }))}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="for" id={`for-${vote.id}`} />
                          <Label htmlFor={`for-${vote.id}`} className="text-green-700 font-medium cursor-pointer">Voor</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="against" id={`against-${vote.id}`} />
                          <Label htmlFor={`against-${vote.id}`} className="text-red-700 font-medium cursor-pointer">Tegen</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="abstain" id={`abstain-${vote.id}`} />
                          <Label htmlFor={`abstain-${vote.id}`} className="text-gray-500 cursor-pointer">Onthouding</Label>
                        </div>
                      </RadioGroup>
                      <Button className="mt-3" size="sm" disabled={!selectedVote[vote.id]} onClick={() => castVote(vote.id)}>
                        Stem uitbrengen
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Closed Votes */}
      {closedVotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Afgeronde stemmingen</h2>
          {closedVotes.map((vote) => {
            const forPct = vote.voted > 0 ? Math.round((vote.forCount / vote.voted) * 100) : 0;
            return (
              <Card key={vote.id}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={vote.result === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"} variant="secondary">
                      {vote.result === "approved" ? "Aangenomen" : "Verworpen"}
                    </Badge>
                    <Badge variant="outline">{typeLabels[vote.type]}</Badge>
                  </div>
                  <CardTitle className="text-base">{vote.subject}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{vote.forCount} voor ({forPct}%)</span>
                    <span>{vote.againstCount} tegen</span>
                    <span>{vote.voted}/{vote.totalMembers} gestemd</span>
                  </div>
                  <Progress value={forPct} className="mt-2 h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
