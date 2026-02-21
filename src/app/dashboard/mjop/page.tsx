"use client";

import { ClipboardList, Brain, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const demoMJOP = [
  { id: "1", component: "Garagedeuren sectie A", description: "Vervanging 12 sectionaaldeuren", estimatedCost: 18000, plannedYear: 2026, priority: "high", status: "planned" },
  { id: "2", component: "Verlichting", description: "Omschakeling naar LED verlichting", estimatedCost: 3500, plannedYear: 2027, priority: "medium", status: "planned" },
  { id: "3", component: "Garagedeuren sectie B", description: "Vervanging 12 sectionaaldeuren", estimatedCost: 18000, plannedYear: 2028, priority: "high", status: "planned" },
  { id: "4", component: "Dakbedekking", description: "Volledige vervanging bitumen dakbedekking", estimatedCost: 25000, plannedYear: 2029, priority: "high", status: "planned" },
  { id: "5", component: "Bestrating", description: "Herstraten binnenterrein en inrit", estimatedCost: 8000, plannedYear: 2029, priority: "medium", status: "planned" },
  { id: "6", component: "Riolering", description: "Inspectie en reiniging rioolstelsel", estimatedCost: 2000, plannedYear: 2027, priority: "low", status: "planned" },
  { id: "7", component: "Schilderwerk", description: "Buitenschilderwerk kozijnen en deuren", estimatedCost: 4500, plannedYear: 2028, priority: "medium", status: "planned" },
  { id: "8", component: "Elektra", description: "Keuring en vervanging verouderde groepenkast", estimatedCost: 3000, plannedYear: 2030, priority: "medium", status: "planned" },
  { id: "9", component: "Ventilatie", description: "Plaatsing mechanische ventilatie", estimatedCost: 6000, plannedYear: 2031, priority: "low", status: "planned" },
  { id: "10", component: "Garagedeuren motor", description: "Vervanging automatische deuropeners", estimatedCost: 5000, plannedYear: 2032, priority: "medium", status: "planned" },
];

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Laag", color: "bg-gray-50 text-gray-700" },
  medium: { label: "Gemiddeld", color: "bg-yellow-50 text-yellow-700" },
  high: { label: "Hoog", color: "bg-red-50 text-red-700" },
};

const statusLabels: Record<string, string> = {
  planned: "Gepland",
  in_progress: "In uitvoering",
  completed: "Afgerond",
  deferred: "Uitgesteld",
};

export default function MJOPPage() {
  // Group by year
  const years = Array.from(new Set(demoMJOP.map((item) => item.plannedYear))).sort();
  const costByYear = years.map((year) => ({
    year,
    total: demoMJOP.filter((item) => item.plannedYear === year).reduce((s, i) => s + i.estimatedCost, 0),
  }));
  const totalCost = demoMJOP.reduce((s, i) => s + i.estimatedCost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            MJOP
          </h1>
          <p className="text-muted-foreground">Meerjarenonderhoudsplan 2026-2036</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Brain className="mr-2 h-4 w-4" />
            Genereer MJOP met AI
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Item toevoegen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>MJOP item toevoegen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Component</Label>
                  <Input placeholder="bijv. Dakbedekking" />
                </div>
                <div className="space-y-2">
                  <Label>Beschrijving</Label>
                  <Input placeholder="Wat moet er gebeuren?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Geschatte kosten</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gepland jaar</Label>
                    <Input type="number" placeholder="2026" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Prioriteit</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecteer" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Laag</SelectItem>
                      <SelectItem value="medium">Gemiddeld</SelectItem>
                      <SelectItem value="high">Hoog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Toevoegen</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Timeline Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">&euro;{totalCost.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Totale kosten (10 jaar)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{demoMJOP.length}</p>
            <p className="text-sm text-muted-foreground">Onderhoudsposten</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">&euro;{Math.round(totalCost / 10 / 12).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Benodigde reserve/maand</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">&euro;12.450</p>
            <p className="text-sm text-muted-foreground">Huidig reservefonds</p>
          </CardContent>
        </Card>
      </div>

      {/* Year Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Kosten per jaar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {costByYear.map(({ year, total }) => {
              const maxCost = Math.max(...costByYear.map((c) => c.total));
              const pct = (total / maxCost) * 100;
              return (
                <div key={year} className="flex items-center gap-4">
                  <span className="text-sm font-mono w-10">{year}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full flex items-center pl-3"
                      style={{ width: `${Math.max(pct, 10)}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        &euro;{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Onderhoudsposten</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Beschrijving</TableHead>
                <TableHead>Jaar</TableHead>
                <TableHead>Prioriteit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Geschatte kosten</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoMJOP.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.component}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description}</TableCell>
                  <TableCell className="font-mono">{item.plannedYear}</TableCell>
                  <TableCell>
                    <Badge className={priorityConfig[item.priority].color} variant="secondary">
                      {priorityConfig[item.priority].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{statusLabels[item.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    &euro;{item.estimatedCost.toLocaleString()}
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
