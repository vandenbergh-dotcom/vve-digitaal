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

const demoVotes = [
  {
    id: "1",
    subject: "Vervanging garagedeuren sectie A",
    description: "Voorstel om de 12 garagedeuren in sectie A te vervangen door geïsoleerde sectionaaldeuren. Geschatte kosten: \u20ac18.000 uit reservefonds.",
    type: "qualified_majority",
    status: "open",
    deadline: "2026-02-28",
    forCount: 14,
    againstCount: 3,
    abstainCount: 1,
    totalMembers: 24,
    voted: 18,
    result: null,
  },
  {
    id: "2",
    subject: "Verhoging maandelijkse bijdrage naar \u20ac55",
    description: "Voorstel om de maandelijkse VvE-bijdrage te verhogen van \u20ac50 naar \u20ac55 per eenheid, vanwege gestegen energiekosten.",
    type: "simple_majority",
    status: "open",
    deadline: "2026-03-15",
    forCount: 8,
    againstCount: 5,
    abstainCount: 0,
    totalMembers: 24,
    voted: 13,
    result: null,
  },
  {
    id: "3",
    subject: "Goedkeuring begroting 2026",
    description: "Jaarlijkse begroting voor 2026. Totale begroting: \u20ac14.800. Details beschikbaar in de bijlage.",
    type: "simple_majority",
    status: "closed",
    deadline: "2025-12-15",
    forCount: 15,
    againstCount: 1,
    abstainCount: 0,
    totalMembers: 24,
    voted: 16,
    result: "approved",
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
  },
];

const typeLabels: Record<string, string> = {
  simple_majority: "Gewone meerderheid",
  qualified_majority: "Gekwalificeerde meerderheid (2/3)",
  unanimous: "Unanimiteit",
};

export default function StemmenPage() {
  const [myVote, setMyVote] = useState<string>("");

  const openVotes = demoVotes.filter((v) => v.status === "open");
  const closedVotes = demoVotes.filter((v) => v.status === "closed");

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
        <Dialog>
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
                <Label>Onderwerp</Label>
                <Input placeholder="Waar wordt over gestemd?" />
              </div>
              <div className="space-y-2">
                <Label>Toelichting</Label>
                <Textarea placeholder="Beschrijf het voorstel" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Type meerderheid</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple_majority">Gewone meerderheid (&gt;50%)</SelectItem>
                    <SelectItem value="qualified_majority">Gekwalificeerde meerderheid (2/3)</SelectItem>
                    <SelectItem value="unanimous">Unanimiteit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input type="date" />
              </div>
              <Button className="w-full">Stemming starten</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Open Votes */}
      {openVotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Openstaande stemmingen</h2>
          {openVotes.map((vote) => {
            const quorumNeeded = vote.type === "qualified_majority" ? Math.ceil(vote.totalMembers * 2 / 3) : Math.ceil(vote.totalMembers / 2) + 1;
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
                        <Badge className="bg-orange-50 text-orange-700 text-xs" variant="secondary">Nog {quorumNeeded - vote.voted} nodig</Badge>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Deadline: {new Date(vote.deadline).toLocaleDateString("nl-NL")}
                    </span>
                  </div>

                  {/* Cast Vote */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium mb-3">Uw stem uitbrengen</p>
                    <RadioGroup value={myVote} onValueChange={setMyVote} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="for" id={`for-${vote.id}`} />
                        <Label htmlFor={`for-${vote.id}`} className="text-green-700 font-medium">Voor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="against" id={`against-${vote.id}`} />
                        <Label htmlFor={`against-${vote.id}`} className="text-red-700 font-medium">Tegen</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="abstain" id={`abstain-${vote.id}`} />
                        <Label htmlFor={`abstain-${vote.id}`} className="text-gray-500">Onthouding</Label>
                      </div>
                    </RadioGroup>
                    <Button className="mt-3" size="sm" disabled={!myVote}>
                      Stem uitbrengen
                    </Button>
                  </div>
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
