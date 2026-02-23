"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Send, User, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "Mag ik mijn garagebox verhuren aan derden?",
  "Wat is het quorum voor de ALV?",
  "Wie is verantwoordelijk voor onderhoud garagedeuren?",
  "Hoe hoog moet het reservefonds zijn?",
  "Wat staat er in het huishoudelijk reglement over lawaai?",
  "Wanneer is de volgende ALV?",
];

const demoResponses: Record<string, string> = {
  "Mag ik mijn garagebox verhuren aan derden?":
    "Volgens uw splitsingsakte (Artikel 24, lid 3) is verhuur van uw garagebox aan derden **toegestaan**, mits:\n\n1. U het bestuur **schriftelijk informeert** v\u00f3\u00f3r aanvang van de verhuur\n2. De huurder zich houdt aan het **huishoudelijk reglement**\n3. Het gebruik conform de bestemming \"berging/stalling\" blijft\n4. De huurder geen **overlast** veroorzaakt voor andere eigenaren\n\nLet op: commercieel gebruik (zoals werkplaats of opslag van handelswaar) is **niet** toegestaan zonder toestemming van de vergadering.\n\n_Bron: Splitsingsakte art. 24.3, Huishoudelijk Reglement art. 8.1_",

  "Wat is het quorum voor de ALV?":
    "Voor de Algemene Ledenvergadering (ALV) van uw VvE gelden de volgende quorum-eisen:\n\n**Eerste vergadering:**\n- Minimaal **50% + 1** van de stemmen moet vertegenwoordigd zijn (13 van 24 eigenaren)\n\n**Tweede vergadering** (als quorum niet gehaald):\n- Geen quorum-eis, besluiten worden genomen met **gewone meerderheid** van de aanwezige stemmen\n- Moet minimaal **2 weken** na de eerste vergadering plaatsvinden\n\n**Uitzonderingen:**\n- Wijziging splitsingsakte: **4/5 meerderheid** (20 van 24)\n- Wijziging bestemming: **unanimiteit** vereist\n- Onderhoud > \u20ac5.000: **2/3 meerderheid** (16 van 24)\n\n_Bron: BW 5:127, Splitsingsakte art. 35-37_",

  "Wie is verantwoordelijk voor onderhoud garagedeuren?":
    "De verantwoordelijkheid voor onderhoud van garagedeuren hangt af van het type deur:\n\n**Gemeenschappelijke garagedeuren** (toegang tot het complex):\n- Verantwoordelijkheid van de **VvE**\n- Kosten worden verdeeld volgens de breukdelen\n- Onderhoud en vervanging via het MJOP\n\n**Individuele garagedeuren** (toegang tot individuele box):\n- Verantwoordelijkheid van de **individuele eigenaar**\n- Tenzij de splitsingsakte anders bepaalt\n\nIn uw geval zijn de garagedeuren aangemerkt als **gemeenschappelijk** (Splitsingsakte art. 17). De VvE is verantwoordelijk voor onderhoud \u00e9n vervanging. Er is al een besluit genomen om de deuren in sectie A te vervangen in Q2 2026 (\u20ac18.000).\n\n_Bron: Splitsingsakte art. 17, Notulen ALV 15-12-2025_",

  "Hoe hoog moet het reservefonds zijn?":
    "Sinds 2018 is een reservefonds **wettelijk verplicht** voor elke VvE (BW 5:126).\n\n**Wettelijke eisen:**\n- Minimaal **0,5% van de herbouwwaarde** per jaar\n- \u00d3f een bedrag conform een goedgekeurd **MJOP** (meerjarenonderhoudsplan)\n\n**Uw situatie:**\n- Huidig reservefonds: **\u20ac11.950**\n- Maandelijkse storting: **\u20ac500** (recent verhoogd)\n- MJOP totaalkosten (10 jaar): **\u20ac93.000**\n- Benodigde jaarlijkse reservering: **\u20ac9.300** (\u20ac775/maand)\n\n**Advies:** Uw huidige storting van \u20ac500/maand is **onvoldoende** om alle geplande uitgaven te dekken. Met name de garagedeurenvervanging (\u20ac18.000 in 2026 en 2028) en dakbedekking (\u20ac25.000 in 2029) vragen om een hogere reserve. Overweeg een verhoging naar \u20ac800/maand.\n\n_Bron: BW 5:126, MJOP 2024-2034_",
};

export default function AIAssistentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(text?: string) {
    const question = text || input;
    if (!question.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Try real API first, fall back to demo responses
    let response: string;
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      response = data.content || data.error || "Geen antwoord ontvangen.";
    } catch {
      // Fall back to demo responses if API fails
      response = demoResponses[question] ||
        `Bedankt voor uw vraag. De AI-assistent is momenteel niet verbonden met de API. In de productieversie analyseer ik uw splitsingsakte, huishoudelijk reglement en alle VvE-documenten om een nauwkeurig antwoord te geven.\n\n_Tip: Stel een van de voorgestelde vragen voor een demo-antwoord._`;
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          AI Assistent
        </h1>
        <p className="text-muted-foreground">Stel vragen over uw VvE, reglementen en financiën</p>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hoe kan ik u helpen?</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                Ik ken uw splitsingsakte, huishoudelijk reglement en VvE-wetgeving.
                Stel een vraag of kies een suggestie hieronder.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {suggestedQuestions.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSend(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Brain className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl p-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {msg.content.split("\n").map((line, i) => {
                        // Basic markdown-like rendering
                        const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        const italicLine = boldLine.replace(/_(.*?)_/g, '<em>$1</em>');
                        return <p key={i} className={line === "" ? "h-2" : ""} dangerouslySetInnerHTML={{ __html: italicLine }} />;
                      })}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Brain className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Aan het nadenken...
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <CardContent className="border-t p-4">
          {messages.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {suggestedQuestions.slice(0, 3).map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 shrink-0"
                  onClick={() => handleSend(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              placeholder="Stel een vraag over uw VvE..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
