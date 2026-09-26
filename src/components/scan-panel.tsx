import { useNavigate } from "@tanstack/react-router";
import { FolderSearch, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { analyzeFiles, fileFromBrowser, normalizeDemo, type DemoRaw } from "@/lib/neverlost/analyze";
import { bytesHuman, formatInt } from "@/lib/neverlost/format";
import { useNeverLost } from "@/lib/neverlost/store";
import type { FileMeta } from "@/lib/neverlost/types";

const CHUNK = 400;

export function ScanPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    scanning,
    cancelled,
    progress,
    log,
    error,
    setScanning,
    setProgress,
    setSummary,
    pushLog,
    clearLog,
    setError,
    requestCancel,
    resetCancel,
  } = useNeverLost();
  const [busyDemo, setBusyDemo] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.setAttribute("webkitdirectory", "");
    el.setAttribute("directory", "");
  }, []);

  async function runLocalScan(list: FileList | File[]) {
    const files = Array.from(list);
    if (!files.length) {
      setError("Nenhum arquivo na pasta selecionada.");
      return;
    }
    setError(null);
    clearLog();
    resetCancel();
    setScanning(true);
    const startedAt = performance.now();
    const total = files.length;
    setProgress({ processed: 0, total, bytes: 0, startedAt });
    pushLog(`Observer ativo · ${formatInt(total)} entradas · somente leitura`);
    const metas: FileMeta[] = [];
    let bytes = 0;
    for (let i = 0; i < files.length; i += CHUNK) {
      if (useNeverLost.getState().cancelled) {
        setScanning(false);
        setProgress(null);
        pushLog("Varredura cancelada. Nada foi alterado.");
        return;
      }
      const slice = files.slice(i, i + CHUNK);
      for (const f of slice) {
        const meta = fileFromBrowser(f);
        metas.push(meta);
        bytes += meta.size;
      }
      const processed = metas.length;
      setProgress({
        processed,
        total,
        bytes,
        current: metas[metas.length - 1]?.path,
        startedAt,
      });
      if (processed === CHUNK || processed % (CHUNK * 4) === 0) {
        pushLog(`Indexando ${formatInt(processed)} / ${formatInt(total)} · ${bytesHuman(bytes)}`);
      }
      await new Promise((r) => requestAnimationFrame(r));
    }
    const elapsed = (performance.now() - startedAt) / 1000;
    pushLog("Agregando mapa do caos…");
    const summary = analyzeFiles(metas, elapsed);
    summary.roots = summary.roots.length ? summary.roots : ["pasta local"];
    setSummary(summary);
    setScanning(false);
    setProgress(null);
    resetCancel();
    pushLog(
      `Concluído · ${formatInt(summary.total_files)} arquivos · ${bytesHuman(summary.total_size_bytes)} · ${summary.dup_candidates.length} grupos duplicados`,
    );
    await navigate({ to: "/report" });
  }

  async function loadDemo() {
    setBusyDemo(true);
    setError(null);
    clearLog();
    pushLog("Carregando mapa real sanitizado (1,06 milhão de arquivos)…");
    try {
      const res = await fetch("/demo-resumo.json");
      if (!res.ok) throw new Error("Falha ao carregar demonstração.");
      const raw = (await res.json()) as DemoRaw;
      const summary = normalizeDemo(raw);
      setSummary(summary);
      pushLog(`Run ${summary.run_id} · ${bytesHuman(summary.total_size_bytes)} · Observer original`);
      await navigate({ to: "/report" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível abrir o mapa de demonstração.");
    } finally {
      setBusyDemo(false);
    }
  }

  const pct = progress && progress.total > 0 ? Math.min(100, (progress.processed / progress.total) * 100) : 0;

  return (
    <section
      className={`rounded-[length:var(--radius-xl)] border bg-surface p-5 sm:p-7 ${
        dragOver ? "border-accent" : "border-border"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) void runLocalScan(e.dataTransfer.files);
      }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Modo observer</p>
      <h2 className="mt-2 text-xl font-medium tracking-tight">Mapear uma pasta</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        A leitura acontece no navegador. Nada sobe para servidor. O app não move, não apaga
        e não altera arquivo — só observa metadados e monta o mapa.
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const list = e.target.files;
          if (list) void runLocalScan(list);
          e.target.value = "";
        }}
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" disabled={scanning || busyDemo} onClick={() => inputRef.current?.click()}>
          <FolderSearch />
          Escolher pasta
        </Button>
        <Button size="lg" variant="outline" disabled={scanning || busyDemo} onClick={() => void loadDemo()}>
          <Play />
          Abrir mapa de prova
        </Button>
        {scanning ? (
          <Button size="lg" variant="ghost" onClick={() => requestCancel()}>
            <Square />
            Cancelar
          </Button>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      {(scanning || log.length > 0) && (
        <div className="mt-6 overflow-hidden rounded-[length:var(--radius-lg)] border border-border bg-bg">
          {progress && scanning ? (
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-mono tabular-nums">
                  {formatInt(progress.processed)} / {formatInt(progress.total)} · {bytesHuman(progress.bytes)}
                </span>
                <span className="truncate pl-4 text-subtle">{progress.current ?? "lendo…"}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full bg-accent transition-[width] duration-[var(--motion-quick)] ease-[var(--ease-out)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ) : null}
          <pre className="max-h-44 overflow-auto p-4 font-mono text-[12px] leading-6 text-accent">
            {log.join("\n") || "aguardando…"}
          </pre>
        </div>
      )}
      {cancelled && !scanning ? (
        <p className="mt-3 text-xs text-subtle">Última varredura foi cancelada.</p>
      ) : null}
    </section>
  );
}
