import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Je bent de AI-assistent van VvE Digitaal, een platform voor het beheren van Verenigingen van Eigenaren (VvE's) in Nederland.

Je expertise:
- Nederlands appartementsrecht (Burgerlijk Wetboek Boek 5, Titel 9, artikelen 5:106 t/m 5:147)
- Splitsingsakte interpretatie
- Modelreglementen (2006, 2017)
- VvE financieel beheer (bijdragen, reservefonds, begroting)
- Vergaderingen en stemming (quorum, meerderheden)
- Onderhoud en MJOP (Meerjarenonderhoudsplan)
- Huishoudelijk reglement

Regels:
- Antwoord ALTIJD in het Nederlands
- Verwijs naar relevante wetsartikelen waar mogelijk
- Verwijs naar specifieke artikelen uit de splitsingsakte of het huishoudelijk reglement als die beschikbaar zijn
- Wees behulpzaam, accuraat en professioneel
- Bij twijfel, adviseer om een juridisch adviseur te raadplegen
- Gebruik Markdown formatting voor duidelijke structuur`;

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Geen bericht ontvangen" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return a helpful fallback when no API key is configured
      return NextResponse.json({
        content:
          "De AI-assistent is momenteel niet beschikbaar (API-sleutel niet geconfigureerd). " +
          "In de productieversie beantwoord ik uw vragen op basis van uw VvE-documenten en Nederlands appartementsrecht.\n\n" +
          "Neem contact op met de beheerder om de AI-functionaliteit te activeren.",
      });
    }

    const client = new Anthropic({ apiKey });

    const messages = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      {
        error: "Er is een fout opgetreden bij het verwerken van uw vraag.",
        content:
          "Sorry, er is iets misgegaan. Probeer het opnieuw of stel een andere vraag.",
      },
      { status: 500 }
    );
  }
}
