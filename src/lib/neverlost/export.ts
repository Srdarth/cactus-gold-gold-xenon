import { bytesHuman, formatElapsed, formatInt } from "./format";
import type { ChaosSummary } from "./types";

export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJson(summary: ChaosSummary) {
  downloadText(
    `neverlost_${summary.run_id}_resumo.json`,
    JSON.stringify(summary, null, 2),
    "application/json;charset=utf-8",
  );
}

export function exportHtml(summary: ChaosSummary) {
  downloadText(
    `neverlost_${summary.run_id}_mapa.html`,
    renderReportHtml(summary),
    "text/html;charset=utf-8",
  );
}

function escapeHtml(s: string): string {
  const amp = String.fromCharCode(38);
  return s
    .replaceAll("&", amp + "amp;")
    .replaceAll("<", amp + "lt;")
    .replaceAll(">", amp + "gt;")
    .replaceAll('"', amp + "quot;");
}

export function renderReportHtml(s: ChaosSummary): string {
  const cats = s.categories
    .map(
      (c) =>
        `<tr><td>${escapeHtml(c.name)}</td><td>${formatInt(c.files)}</td><td>${bytesHuman(c.bytes)}</td></tr>`,
    )
    .join("");
  const exts = s.top_extensions
    .map(
      (e) =>
        `<tr><td>${escapeHtml(e.ext)}</td><td>${formatInt(e.files)}</td><td>${bytesHuman(e.bytes)}</td></tr>`,
    )
    .join("");
  const folders = s.top_folders
    .map(
      (f) =>
        `<tr><td>${escapeHtml(f.folder)}</td><td>${bytesHuman(f.bytes)}</td><td>${f.files ? formatInt(f.files) : "—"}</td></tr>`,
    )
    .join("");
  const dups = s.dup_candidates
    .slice(0, 40)
    .map(
      (d) =>
        `<tr><td>${escapeHtml(d.filename)}</td><td>${formatInt(d.count)}</td><td>${bytesHuman(d.size_bytes)}</td></tr>`,
    )
    .join("");
  const heavy = s.heaviest
    .slice(0, 20)
    .map(
      (h) =>
        `<tr><td>${escapeHtml(h.path)}</td><td>${bytesHuman(h.size)}</td><td>${escapeHtml(h.ext)}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>NeverLost — Mapa do Caos ${escapeHtml(s.run_id)}</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; background: #08090b; color: #e8ecef; font-family: "IBM Plex Sans", Segoe UI, sans-serif; }
  main { max-width: 960px; margin: 0 auto; padding: 32px 20px 64px; }
  h1 { font-weight: 500; letter-spacing: -0.03em; margin: 0 0 8px; }
  .muted { color: #8b919a; font-size: 14px; }
  .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 28px 0; }
  .kpi { background: #111318; border: 1px solid rgba(232,236,239,.12); border-radius: 16px; padding: 16px; }
  .kpi b { display: block; font-variant-numeric: tabular-nums; font-size: 22px; font-weight: 500; }
  .kpi span { color: #8b919a; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0 32px; }
  th, td { border-bottom: 1px solid rgba(232,236,239,.1); padding: 10px 8px; text-align: left; font-size: 14px; }
  th { color: #8b919a; font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
  h2 { font-size: 16px; font-weight: 500; margin: 32px 0 8px; }
</style>
</head>
<body>
<main>
  <p class="muted">NeverLost · Observer · somente leitura · ${s.source === "demo" ? "prova sanitizada" : "scan local"}</p>
  <h1>Mapa do Caos Digital</h1>
  <p class="muted">Run ${escapeHtml(s.run_id)} · ${escapeHtml(s.roots.join(" · "))} · ${formatElapsed(s.elapsed_seconds)}</p>
  <div class="kpis">
    <div class="kpi"><span>Arquivos</span><b>${formatInt(s.total_files)}</b></div>
    <div class="kpi"><span>Tamanho</span><b>${bytesHuman(s.total_size_bytes)}</b></div>
    <div class="kpi"><span>Cópias extras</span><b>${formatInt(s.dup_extra_copies)}</b></div>
    <div class="kpi"><span>Espaço suspeito</span><b>${bytesHuman(s.dup_wasted_bytes)}</b></div>
  </div>
  <p class="muted">Duplicatas candidatas usam nome + tamanho, não hash de conteúdo. Não é sentença — é pista.</p>
  <h2>Categorias</h2>
  <table><thead><tr><th>Categoria</th><th>Arquivos</th><th>Tamanho</th></tr></thead><tbody>${cats}</tbody></table>
  <h2>Top extensões</h2>
  <table><thead><tr><th>Extensão</th><th>Arquivos</th><th>Tamanho</th></tr></thead><tbody>${exts}</tbody></table>
  <h2>Pastas mais pesadas</h2>
  <table><thead><tr><th>Pasta</th><th>Tamanho</th><th>Arquivos</th></tr></thead><tbody>${folders}</tbody></table>
  ${heavy ? `<h2>Arquivos mais pesados</h2><table><thead><tr><th>Caminho</th><th>Tamanho</th><th>Ext</th></tr></thead><tbody>${heavy}</tbody></table>` : ""}
  <h2>Duplicatas candidatas</h2>
  <table><thead><tr><th>Nome</th><th>Ocorrências</th><th>Tamanho</th></tr></thead><tbody>${dups || `<tr><td colspan="3">Nenhuma neste recorte.</td></tr>`}</tbody></table>
  <p class="muted">Dados não saem do dispositivo. Relatório gerado localmente. Nenhum arquivo foi modificado.</p>
</main>
</body>
</html>`;
}
