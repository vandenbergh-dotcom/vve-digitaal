"use client";

import { useState } from "react";
import { Users, Plus, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
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

const demoMembers = [
  { id: "1", name: "Hidde van den Bergh", email: "hidde@example.nl", phone: "06-12345678", unit: "Box 1", role: "board_chair", breukdeel: "1/24", active: true },
  { id: "2", name: "Jan de Vries", email: "jan@example.nl", phone: "06-23456789", unit: "Box 2", role: "board_treasurer", breukdeel: "1/24", active: true },
  { id: "3", name: "Maria Jansen", email: "maria@example.nl", phone: "06-34567890", unit: "Box 3", role: "owner", breukdeel: "1/24", active: true },
  { id: "4", name: "Pieter Bakker", email: "pieter@example.nl", phone: "06-45678901", unit: "Box 4", role: "board_secretary", breukdeel: "1/24", active: true },
  { id: "5", name: "Sophie Visser", email: "sophie@example.nl", phone: "06-56789012", unit: "Box 5", role: "owner", breukdeel: "1/24", active: true },
  { id: "6", name: "Thomas Smit", email: "thomas@example.nl", phone: "06-67890123", unit: "Box 6", role: "owner", breukdeel: "1/24", active: true },
  { id: "7", name: "Emma Mulder", email: "emma@example.nl", phone: "06-78901234", unit: "Box 7-8", role: "owner", breukdeel: "2/24", active: true },
  { id: "8", name: "Lucas de Groot", email: "lucas@example.nl", phone: "", unit: "Box 9", role: "owner", breukdeel: "1/24", active: false },
];

const roleLabels: Record<string, string> = {
  board_chair: "Voorzitter",
  board_secretary: "Secretaris",
  board_treasurer: "Penningmeester",
  board_member: "Bestuurslid",
  owner: "Eigenaar",
};

const roleBadgeVariant = (role: string) => {
  if (role.startsWith("board")) return "default" as const;
  return "secondary" as const;
};

export default function LedenPage() {
  const [search, setSearch] = useState("");

  const filtered = demoMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.unit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Leden
          </h1>
          <p className="text-muted-foreground">Beheer eigenaren en bestuursleden</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Lid toevoegen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuw lid toevoegen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Naam</Label>
                <Input placeholder="Volledige naam" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" placeholder="email@voorbeeld.nl" />
              </div>
              <div className="space-y-2">
                <Label>Telefoon</Label>
                <Input type="tel" placeholder="06-12345678" />
              </div>
              <div className="space-y-2">
                <Label>Eenheid</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer eenheid" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`box-${i + 1}`}>
                        Box {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Eigenaar</SelectItem>
                    <SelectItem value="board_chair">Voorzitter</SelectItem>
                    <SelectItem value="board_secretary">Secretaris</SelectItem>
                    <SelectItem value="board_treasurer">Penningmeester</SelectItem>
                    <SelectItem value="board_member">Bestuurslid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Toevoegen</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">18</p>
            <p className="text-sm text-muted-foreground">Actieve leden</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">4</p>
            <p className="text-sm text-muted-foreground">Bestuursleden</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-muted-foreground">Totaal eenheden</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ledenlijst</CardTitle>
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
                <TableHead>Naam</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Eenheid</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Breukdeel</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{member.unit}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant(member.role)}>
                      {roleLabels[member.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{member.breukdeel}</TableCell>
                  <TableCell>
                    <Badge variant={member.active ? "secondary" : "outline"}>
                      {member.active ? "Actief" : "Inactief"}
                    </Badge>
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
