import { Download, FileJson } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { exportHtml, exportJson } from "@/lib/neverlost/export";
import { bytesHuman, formatElapsed, formatInt } from "@/lib/neverlost/format";
import type { ChaosSummary } from "@/lib/neverlost/types";

const CAT_FILL: Record<string, string> = {
  Documentos: "var(--color-signal)",
  Mídia: "var(--color-accent)",
  Compactados: "var(--color-primary)",
  Código: "color-mix(in oklab, var(--color-accent) 55%, var(--color-fg))",
  Outros: "color-mix(in oklab, var(--color-muted) 80%, transparent)",
};

type Tab = "mapa" | "ext" | "pastas" | "dups";

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[length:var(--radius-lg)] border border-border bg-surface p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="mt-2 font-mono text-2xl font-medium tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function ReportView({ summary }: { summary: ChaosSummary }) {
  const [tab, setTab] = useState<Tab>("mapa");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const chartData = summary.categories.map((c) => ({
    name: c.name,
    gb: Number((c.bytes / 1024 ** 3).toFixed(2)),
    files: c.files,
  }));

  const extChart = summary.top_extensions.slice(0, 8).map((e) => ({
    name: e.ext,
    gb: Number((e.bytes / 1024 ** 3).toFixed(2)),
  }));

  const exts = useMemo(
    () => summary.top_extensions.filter((e) => !needle || e.ext.toLowerCase().includes(needle)),
    [summary.top_extensions, needle],
  );
  const folders = useMemo(
    () =>
      summary.top_folders.filter((f) => !needle || f.folder.toLowerCase().includes(needle)),
    [summary.top_folders, needle],
  );
  const dups = useMemo(
    () =>
      summary.dup_candidates.filter(
        (d) => !needle || d.filename.toLowerCase().includes(needle),
      ),
    [summary.dup_candidates, needle],
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "mapa", label: "Mapa" },
    { id: "ext", label: "Extensões" },
    { id: "pastas", label: "Pastas" },
    { id: "dups", label: "Duplicatas" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            Relatório · {summary.source === "demo" ? "prova sanitizada" : "scan local"}
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">Mapa do Caos</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Run {summary.run_id}
            {summary.roots.length ? ` · ${summary.roots.slice(0, 6).join(" · ")}` : ""}
            {" · "}
            {formatElapsed(summary.elapsed_seconds)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => exportJson(summary)}>
            <FileJson />
            JSON
          </Button>
          <Button size="sm" onClick={() => exportHtml(summary)}>
            <Download />
            Relatório HTML
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Arquivos" value={formatInt(summary.total_files)} />
        <Kpi label="Tamanho" value={bytesHuman(summary.total_size_bytes)} />
        <Kpi
          label="Cópias extras"
          value={formatInt(summary.dup_extra_copies)}
          hint={`${formatInt(summary.dup_candidates.length)} grupos`}
        />
        <Kpi
          label="Espaço suspeito"
          value={bytesHuman(summary.dup_wasted_bytes)}
          hint="nome + tamanho, sem hash"
        />
      </div>

      {summary.stats.MOVED > 0 || summary.stats.UNCHANGED > 0 ? (
        <p className="mt-4 font-mono text-xs text-subtle">
          Incremental · novos {formatInt(summary.stats.NEW)} · movidos {formatInt(summary.stats.MOVED)} ·
          inalterados {formatInt(summary.stats.UNCHANGED)} · erros {formatInt(summary.stats.ERR)}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`h-10 min-h-10 rounded-[length:var(--radius-sm)] px-4 text-sm ${
              tab === t.id ? "bg-primary text-primary-foreground" : "border border-border text-muted hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar…"
          className="h-10 min-h-10 min-w-[10rem] flex-1 rounded-[length:var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {tab === "mapa" ? (
        <section className="mt-6 rounded-[length:var(--radius-xl)] border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Peso por categoria</h2>
          <p className="mt-1 text-xs text-muted">
            .exe, .dll e .img caem em Outros — igual ao Observer original.
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} unit=" GB" />
                  <Tooltip
                    cursor={{ fill: "color-mix(in oklab, var(--color-fg) 6%, transparent)" }}
                    contentStyle={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-fg)",
                    }}
                    formatter={(v) => [`${v} GB`, "Tamanho"]}
                  />
                  <Bar dataKey="gb" radius={[6, 6, 0, 0]}>
                    {chartData.map((row) => (
                      <Cell key={row.name} fill={CAT_FILL[row.name] ?? "var(--color-accent)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="gb" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={2}>
                    {chartData.map((row) => (
                      <Cell key={row.name} fill={CAT_FILL[row.name] ?? "var(--color-accent)"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-fg)",
                    }}
                    formatter={(v) => [`${v} GB`, "Tamanho"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.12em] text-subtle">
                <tr>
                  <th className="py-2 font-medium">Categoria</th>
                  <th className="py-2 font-medium">Arquivos</th>
                  <th className="py-2 font-medium">Tamanho</th>
                </tr>
              </thead>
              <tbody>
                {summary.categories.map((c) => (
                  <tr key={c.name} className="border-t border-border">
                    <td className="py-2.5">{c.name}</td>
                    <td className="py-2.5 font-mono tabular-nums">{formatInt(c.files)}</td>
                    <td className="py-2.5 font-mono tabular-nums">{bytesHuman(c.bytes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === "ext" ? (
        <section className="mt-6 rounded-[length:var(--radius-xl)] border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Extensões vilãs</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={extChart} layout="vertical" margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} unit=" GB" />
                <YAxis type="category" dataKey="name" width={72} tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-fg)",
                  }}
                  formatter={(v) => [`${v} GB`, "Tamanho"]}
                />
                <Bar dataKey="gb" fill="var(--color-accent)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <DataTable
            headers={["Ext", "Arquivos", "Tamanho"]}
            rows={exts.map((e) => [e.ext, formatInt(e.files), bytesHuman(e.bytes)])}
            empty="Nenhuma extensão neste filtro."
          />
        </section>
      ) : null}

      {tab === "pastas" ? (
        <section className="mt-6 rounded-[length:var(--radius-xl)] border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Pastas mais pesadas</h2>
          <p className="mt-1 text-xs text-muted">
            {summary.source === "demo"
              ? "Estimativa do Observer original (top 5000 arquivos). Nomes ofuscados de propósito."
              : "Primeiro nível sob a pasta escolhida. Scan local usa todos os arquivos desta pasta."}
          </p>
          <DataTable
            headers={["Pasta", "Tamanho", "Arquivos"]}
            rows={folders.map((f) => [f.folder, bytesHuman(f.bytes), f.files ? formatInt(f.files) : "—"])}
            empty="Nenhuma pasta neste filtro."
          />
          {summary.heaviest.length > 0 ? (
            <>
              <h3 className="mt-8 text-sm font-medium">Arquivos mais pesados</h3>
              <DataTable
                headers={["Caminho", "Tamanho", "Ext"]}
                rows={summary.heaviest
                  .filter((h) => !needle || h.path.toLowerCase().includes(needle) || h.ext.toLowerCase().includes(needle))
                  .map((h) => [h.path, bytesHuman(h.size), h.ext])}
                empty="Nenhum arquivo neste filtro."
              />
            </>
          ) : null}
        </section>
      ) : null}

      {tab === "dups" ? (
        <section className="mt-6 rounded-[length:var(--radius-xl)] border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Duplicatas candidatas</h2>
          <p className="mt-1 text-xs text-muted">
            Mesmo nome e mesmo tamanho — não é hash de conteúdo. Use como pista, não como sentença.
          </p>
          <div className="mt-4 overflow-x-auto">
            {dups.length === 0 ? (
              <p className="py-8 text-sm text-muted">Nenhuma duplicata candidata neste recorte.</p>
            ) : (
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="text-[11px] uppercase tracking-[0.12em] text-subtle">
                  <tr>
                    <th className="py-2 font-medium">Arquivo</th>
                    <th className="py-2 font-medium">Vezes</th>
                    <th className="py-2 font-medium">Tamanho</th>
                    <th className="py-2 font-medium">Amostra</th>
                  </tr>
                </thead>
                <tbody>
                  {dups.slice(0, 40).map((d) => (
                    <tr key={`${d.filename}-${d.size_bytes}-${d.count}`} className="border-t border-border">
                      <td className="max-w-[14rem] truncate py-2.5 font-mono text-xs">{d.filename}</td>
                      <td className="py-2.5 font-mono tabular-nums">{formatInt(d.count)}</td>
                      <td className="py-2.5 font-mono tabular-nums">{bytesHuman(d.size_bytes)}</td>
                      <td className="max-w-[16rem] truncate py-2.5 text-xs text-muted">
                        {d.sample_paths[0] ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function DataTable({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: string[][];
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="mt-4 py-8 text-sm text-muted">{empty}</p>;
  }
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-[11px] uppercase tracking-[0.12em] text-subtle">
          <tr>
            {headers.map((h) => (
              <th key={h} className="py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`py-2.5 ${j === 0 ? "max-w-[16rem] truncate font-mono text-xs" : "font-mono tabular-nums"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
