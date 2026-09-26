import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ReportView } from "@/components/report-view";
import { Button } from "@/components/ui/button";
import { useNeverLost } from "@/lib/neverlost/store";

export const Route = createFileRoute("/report")({ component: ReportPage });

function ReportPage() {
  const summary = useNeverLost((s) => s.summary);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <AppShell>
        <main className="mx-auto max-w-6xl px-4 py-16">
          <div className="h-8 w-48 rounded-[length:var(--radius-sm)] bg-surface-2" />
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-[length:var(--radius-lg)] border border-border bg-surface"
              />
            ))}
          </div>
        </main>
      </AppShell>
    );
  }

  if (!summary) {
    return (
      <AppShell>
        <main className="mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-medium tracking-tight">Nenhum mapa ainda</h1>
          <p className="mt-3 text-sm text-muted">
            Escolha uma pasta ou abra o mapa de prova para gerar o relatório.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Voltar ao observer</Link>
          </Button>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ReportView summary={summary} />
    </AppShell>
  );
}
