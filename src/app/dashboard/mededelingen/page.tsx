"use client";

import { useState } from "react";
import { Bell, Plus, Pin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  isPinned: boolean;
  createdAt: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Stemming geopend: Vervanging garagedeuren",
    content: "Beste eigenaren,\n\nEr is een stemming geopend over de vervanging van de garagedeuren in sectie A. De geschatte kosten zijn \u20ac18.000. U kunt uw stem uitbrengen via het platform onder 'Stemmen'. De deadline is 28 februari 2026.\n\nMet vriendelijke groet,\nHet bestuur",
    authorName: "Hidde van den Bergh",
    isPinned: true,
    createdAt: "2026-02-18T10:00:00",
  },
  {
    id: "2",
    title: "Werkzaamheden bestrating binnenterrein",
    content: "Op donderdag 6 maart worden werkzaamheden uitgevoerd aan de bestrating van het binnenterrein bij de inrit. Gelieve uw voertuigen die dag niet in de buurt van de inrit te parkeren.\n\nDe werkzaamheden duren naar verwachting 1 dag.",
    authorName: "Jan de Vries",
    isPinned: false,
    createdAt: "2026-02-15T14:30:00",
  },
  {
    id: "3",
    title: "Notulen ALV december 2025 beschikbaar",
    content: "De notulen van de ALV van 15 december 2025 zijn beschikbaar in het documentenportaal. U kunt ze bekijken onder 'Documenten'.\n\nBij vragen over de notulen kunt u contact opnemen met de secretaris.",
    authorName: "Pieter Bakker",
    isPinned: false,
    createdAt: "2026-01-10T09:00:00",
  },
  {
    id: "4",
    title: "Prettige feestdagen!",
    content: "Het bestuur van VvE Garagepark De Linden wenst alle eigenaren prettige feestdagen en een voorspoedig 2026!",
    authorName: "Hidde van den Bergh",
    isPinned: false,
    createdAt: "2025-12-23T12:00:00",
  },
];

export default function MededelingenPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  function addAnnouncement() {
    if (!newTitle || !newContent) {
      toast.error("Vul titel en bericht in.");
      return;
    }
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      authorName: "Hidde van den Bergh",
      isPinned: false,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [announcement, ...prev]);
    setNewTitle("");
    setNewContent("");
    setDialogOpen(false);
    toast.success("Mededeling geplaatst!");
  }

  function togglePin(id: string) {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  }

  // Sort: pinned first, then by date
  const sorted = [...announcements].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            Mededelingen
          </h1>
          <p className="text-muted-foreground">Berichten en aankondigingen voor alle leden</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe mededeling
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mededeling plaatsen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Titel *</Label>
                <Input placeholder="Onderwerp van de mededeling" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Bericht *</Label>
                <Textarea placeholder="Schrijf uw bericht..." rows={5} value={newContent} onChange={(e) => setNewContent(e.target.value)} />
              </div>
              <Button className="w-full" onClick={addAnnouncement}>Plaatsen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sorted.map((announcement) => (
          <Card key={announcement.id} className={announcement.isPinned ? "border-blue-200 bg-blue-50/30" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {announcement.isPinned && (
                      <Badge className="bg-blue-100 text-blue-700" variant="secondary">
                        <Pin className="h-3 w-3 mr-1" />
                        Vastgepind
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <CardDescription>
                    {announcement.authorName} &bull;{" "}
                    {new Date(announcement.createdAt).toLocaleDateString("nl-NL", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePin(announcement.id)}
                  className={announcement.isPinned ? "text-blue-600" : "text-muted-foreground"}
                >
                  <Pin className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {announcement.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
