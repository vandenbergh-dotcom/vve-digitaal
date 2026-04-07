"use client";

import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <Building2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Er ging iets mis</h1>
        <p className="text-muted-foreground mb-6">
          {error.message || "Er is een onverwachte fout opgetreden."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Opnieuw proberen</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Terug naar home
          </Button>
        </div>
      </div>
    </div>
  );
}
