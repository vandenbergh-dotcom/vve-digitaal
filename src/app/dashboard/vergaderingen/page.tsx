"use client";

import { useState } from "react";
import { Calendar, Plus, Brain, CheckCircle2, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Meeting {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  status: "planned" | "in_progress" | "completed";
  attendees: number;
  agenda: string[];
  aiMinutes?: string;
}

const typeLabels: Record<string, string> = {
  alv: "ALV",
  extraordinary: "Buitengewoon",
  board: "Bestuur",
};

const statusLabels: Record<string, string> = {
  planned: "Gepland",
  in_progress: "Bezig",
  completed: "Afgerond",
};

const statusColors: Record<string, string> = {
  planned: "bg-blue-50 text-blue-700",
  in_progress: "bg-yellow-50 text-yellow-700",
  completed: "bg-green-50 text-green-700",
};

const initialMeetings: Meeting[] = [
  {
    id: "1",
    title: "Algemene Ledenvergadering 2026",
    type: "alv",
    date: "2026-06-15T19:30:00",
    location: "Buurthuis De Linde, zaal 3",
    status: "planned",
    attendees: 0,
    agenda: [
      "Opening en vaststelling agenda",
      "Goedkeuring notulen ALV 2025",
      "Jaarverslag 2025",
      "Financieel verslag en begroting 2026",
      "Voortgang vervanging garagedeuren",
      "MJOP update 2026-2036",
      "Bestuursverkiezing (penningmeester)",
      "Rondvraag en sluiting",
    ],
  },
  {
    id: "2",
    title: "Bestuursvergadering Q1",
    type: "board",
    date: "2026-03-01T20:00:00",
    location: "Online (Teams)",
    status: "planned",
    attendees: 0,
    agenda: [
      "Voortgang garagedeuren offerte",
      "Financieel overzicht Q1",
      "Onderhoudsverzoeken bespreken",
      "Voorbereiding ALV 2026",
    ],
  },
  {
    id: "3",
    title: "ALV 15 december 2025",
    type: "alv",
    date: "2025-12-15T19:30:00",
    location: "Buurthuis De Linde, zaal 3",
    status: "completed",
    attendees: 16,
    agenda: [
      "Opening",
      "Notulen vorige ALV",
      "Begroting 2026",
      "Vervanging garagedeuren - stemming",
      "Verhoging reservefonds",
      "Rondvraag",
    ],
    aiMinutes: "De ALV werd bijgewoond door 16 van de 24 eigenaren (67%, quorum bereikt). Belangrijkste besluiten: (1) Begroting 2026 goedgekeurd met 15 stemmen voor, 1 tegen. Maandelijkse bijdrage blijft \u20ac50. (2) Vervanging garagedeuren goedgekeurd met 14 stemmen voor, 2 tegen. Budget: \u20ac18.000 uit reservefonds + aanvullende bijdrage. Start Q2 2026. (3) Maandelijkse storting reservefonds verhoogd van \u20ac350 naar \u20ac500. Actie: bestuur vraagt 3 offertes voor garagedeuren (deadline: 1 maart 2026).",
  },
];

export default function VergaderingenPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("19:30");
  const [newLocation, setNewLocation] = useState("");
  const [newAgenda, setNewAgenda] = useState("");

  function createMeeting() {
    if (!newTitle || !newType || !newDate || !newLocation) {
      toast.error("Vul alle verplichte velden in.");
      return;
    }
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newTitle,
      type: newType,
      date: `${newDate}T${newTime}:00`,
      location: newLocation,
      status: "planned",
      attendees: 0,
      agenda: newAgenda ? newAgenda.split("\n").filter((l) => l.trim()) : [],
    };
    setMeetings((prev) => [meeting, ...prev]);
    setNewTitle("");
    setNewType("");
    setNewDate("");
    setNewTime("19:30");
    setNewLocation("");
    setNewAgenda("");
    setDialogOpen(false);
    toast.success("Vergadering aangemaakt!");
  }

  function generateMinutes(meetingId: string) {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          aiMinutes: `AI-gegenereerde notulen voor "${m.title}". De vergadering vond plaats op ${new Date(m.date).toLocaleDateString("nl-NL")} in ${m.location}. ${m.agenda.length > 0 ? `Agendapunten besproken: ${m.agenda.join(", ")}.` : ""} Verdere details worden aangevuld zodra de AI-service is verbonden.`,
        };
      })
    );
    toast.success("Notulen gegenereerd met AI!");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Vergaderingen
          </h1>
          <p className="text-muted-foreground">Plan vergaderingen en laat AI notulen genereren</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Vergadering plannen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuwe vergadering</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Titel *</Label>
                <Input placeholder="bijv. ALV 2026" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alv">ALV (Algemene Ledenvergadering)</SelectItem>
                    <SelectItem value="extraordinary">Buitengewone vergadering</SelectItem>
                    <SelectItem value="board">Bestuursvergadering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Datum *</Label>
                  <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tijd</Label>
                  <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Locatie *</Label>
                <Input placeholder="Adres of 'Online'" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Agenda (optioneel)</Label>
                <Textarea placeholder="Voeg agendapunten toe, elk op een nieuwe regel" rows={4} value={newAgenda} onChange={(e) => setNewAgenda(e.target.value)} />
              </div>
              <Button className="w-full" onClick={createMeeting}>Vergadering aanmaken</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{typeLabels[meeting.type] || meeting.type}</Badge>
                    <Badge className={statusColors[meeting.status]} variant="secondary">
                      {statusLabels[meeting.status]}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{meeting.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(meeting.date).toLocaleDateString("nl-NL", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    {meeting.attendees > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {meeting.attendees} aanwezig
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Agenda */}
              {meeting.agenda.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Agenda</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {meeting.agenda.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* AI Minutes */}
              {meeting.aiMinutes && (
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">AI-gegenereerde notulen</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{meeting.aiMinutes}</p>
                </div>
              )}

              <div className="flex gap-2">
                {meeting.status === "completed" && !meeting.aiMinutes && (
                  <Button variant="outline" size="sm" onClick={() => generateMinutes(meeting.id)}>
                    <Brain className="mr-1.5 h-3.5 w-3.5" />
                    Genereer notulen met AI
                  </Button>
                )}
                {meeting.status === "completed" && meeting.aiMinutes && (
                  <Button variant="outline" size="sm">
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-green-600" />
                    Notulen goedkeuren
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
