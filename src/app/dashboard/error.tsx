"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Er ging iets mis</h2>
          <p className="text-muted-foreground text-sm mb-6">
            {error.message || "Er is een onverwachte fout opgetreden. Probeer het opnieuw."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={reset}>Opnieuw proberen</Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Terug naar home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
