import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-dvh bg-bg text-fg", className)}>
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-[length:var(--radius-sm)] border border-border bg-surface">
              <Eye className="size-4 text-accent" strokeWidth={1.75} />
            </span>
            <span>
              NeverLost
              <span className="ml-2 hidden text-xs font-normal text-muted sm:inline">Observer</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/report" className="text-xs text-muted hover:text-fg">
              Relatório
            </Link>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Somente leitura</p>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
