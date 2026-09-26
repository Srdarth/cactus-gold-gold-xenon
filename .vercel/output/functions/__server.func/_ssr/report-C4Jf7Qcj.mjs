import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as FileJson, s as Download } from "../_libs/lucide-react.mjs";
import { a as formatInt, i as formatElapsed, n as Button, r as bytesHuman, s as useNeverLost, t as AppShell } from "./store-Gmi1KjqV.mjs";
import { a as Bar, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as Pie, r as YAxis, s as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-C4Jf7Qcj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function downloadText(filename, text, mime) {
	const blob = new Blob([text], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function exportJson(summary) {
	downloadText(`neverlost_${summary.run_id}_resumo.json`, JSON.stringify(summary, null, 2), "application/json;charset=utf-8");
}
function exportHtml(summary) {
	downloadText(`neverlost_${summary.run_id}_mapa.html`, renderReportHtml(summary), "text/html;charset=utf-8");
}
function escapeHtml(s) {
	return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function renderReportHtml(s) {
	const cats = s.categories.map((c) => `<tr><td>${escapeHtml(c.name)}</td><td>${formatInt(c.files)}</td><td>${bytesHuman(c.bytes)}</td></tr>`).join("");
	const exts = s.top_extensions.map((e) => `<tr><td>${escapeHtml(e.ext)}</td><td>${formatInt(e.files)}</td><td>${bytesHuman(e.bytes)}</td></tr>`).join("");
	const folders = s.top_folders.map((f) => `<tr><td>${escapeHtml(f.folder)}</td><td>${bytesHuman(f.bytes)}</td><td>${f.files ? formatInt(f.files) : "—"}</td></tr>`).join("");
	const dups = s.dup_candidates.slice(0, 40).map((d) => `<tr><td>${escapeHtml(d.filename)}</td><td>${formatInt(d.count)}</td><td>${bytesHuman(d.size_bytes)}</td></tr>`).join("");
	const heavy = s.heaviest.slice(0, 20).map((h) => `<tr><td>${escapeHtml(h.path)}</td><td>${bytesHuman(h.size)}</td><td>${escapeHtml(h.ext)}</td></tr>`).join("");
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
var CAT_FILL = {
	Documentos: "var(--color-signal)",
	Mídia: "var(--color-accent)",
	Compactados: "var(--color-primary)",
	Código: "color-mix(in oklab, var(--color-accent) 55%, var(--color-fg))",
	Outros: "color-mix(in oklab, var(--color-muted) 80%, transparent)"
};
function Kpi({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[length:var(--radius-lg)] border border-border bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-2xl font-medium tabular-nums tracking-tight",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function ReportView({ summary }) {
	const [tab, setTab] = (0, import_react.useState)("mapa");
	const [q, setQ] = (0, import_react.useState)("");
	const needle = q.trim().toLowerCase();
	const chartData = summary.categories.map((c) => ({
		name: c.name,
		gb: Number((c.bytes / 1024 ** 3).toFixed(2)),
		files: c.files
	}));
	const extChart = summary.top_extensions.slice(0, 8).map((e) => ({
		name: e.ext,
		gb: Number((e.bytes / 1024 ** 3).toFixed(2))
	}));
	const exts = (0, import_react.useMemo)(() => summary.top_extensions.filter((e) => !needle || e.ext.toLowerCase().includes(needle)), [summary.top_extensions, needle]);
	const folders = (0, import_react.useMemo)(() => summary.top_folders.filter((f) => !needle || f.folder.toLowerCase().includes(needle)), [summary.top_folders, needle]);
	const dups = (0, import_react.useMemo)(() => summary.dup_candidates.filter((d) => !needle || d.filename.toLowerCase().includes(needle)), [summary.dup_candidates, needle]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8 pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
						children: ["Relatório · ", summary.source === "demo" ? "prova sanitizada" : "scan local"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl font-medium tracking-tight",
						children: "Mapa do Caos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-xl text-sm text-muted",
						children: [
							"Run ",
							summary.run_id,
							summary.roots.length ? ` · ${summary.roots.slice(0, 6).join(" · ")}` : "",
							" · ",
							formatElapsed(summary.elapsed_seconds)
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportJson(summary),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileJson, {}), "JSON"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => exportHtml(summary),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Relatório HTML"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Arquivos",
						value: formatInt(summary.total_files)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Tamanho",
						value: bytesHuman(summary.total_size_bytes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Cópias extras",
						value: formatInt(summary.dup_extra_copies),
						hint: `${formatInt(summary.dup_candidates.length)} grupos`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Espaço suspeito",
						value: bytesHuman(summary.dup_wasted_bytes),
						hint: "nome + tamanho, sem hash"
					})
				]
			}),
			summary.stats.MOVED > 0 || summary.stats.UNCHANGED > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 font-mono text-xs text-subtle",
				children: [
					"Incremental · novos ",
					formatInt(summary.stats.NEW),
					" · movidos ",
					formatInt(summary.stats.MOVED),
					" · inalterados ",
					formatInt(summary.stats.UNCHANGED),
					" · erros ",
					formatInt(summary.stats.ERR)
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-2",
				children: [[
					{
						id: "mapa",
						label: "Mapa"
					},
					{
						id: "ext",
						label: "Extensões"
					},
					{
						id: "pastas",
						label: "Pastas"
					},
					{
						id: "dups",
						label: "Duplicatas"
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(t.id),
					className: `h-10 min-h-10 rounded-[length:var(--radius-sm)] px-4 text-sm ${tab === t.id ? "bg-primary text-primary-foreground" : "border border-border text-muted hover:text-fg"}`,
					children: t.label
				}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filtrar…",
					className: "h-10 min-h-10 min-w-[10rem] flex-1 rounded-[length:var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				})]
			}),
			tab === "mapa" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-[length:var(--radius-xl)] border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Peso por categoria"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: ".exe, .dll e .img caem em Outros — igual ao Observer original."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: chartData,
									margin: {
										top: 8,
										right: 8,
										left: 0,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "name",
											tick: {
												fill: "var(--color-muted)",
												fontSize: 12
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: {
												fill: "var(--color-muted)",
												fontSize: 12
											},
											axisLine: false,
											tickLine: false,
											unit: " GB"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											cursor: { fill: "color-mix(in oklab, var(--color-fg) 6%, transparent)" },
											contentStyle: {
												background: "var(--color-bg)",
												border: "1px solid var(--color-border)",
												borderRadius: 12,
												color: "var(--color-fg)"
											},
											formatter: (v) => [`${v} GB`, "Tamanho"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "gb",
											radius: [
												6,
												6,
												0,
												0
											],
											children: chartData.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CAT_FILL[row.name] ?? "var(--color-accent)" }, row.name))
										})
									]
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: chartData,
									dataKey: "gb",
									nameKey: "name",
									innerRadius: 52,
									outerRadius: 88,
									paddingAngle: 2,
									children: chartData.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CAT_FILL[row.name] ?? "var(--color-accent)" }, row.name))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--color-bg)",
										border: "1px solid var(--color-border)",
										borderRadius: 12,
										color: "var(--color-fg)"
									},
									formatter: (v) => [`${v} GB`, "Tamanho"]
								})] })
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[28rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[11px] uppercase tracking-[0.12em] text-subtle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Categoria"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Arquivos"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Tamanho"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: summary.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 font-mono tabular-nums",
										children: formatInt(c.files)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 font-mono tabular-nums",
										children: bytesHuman(c.bytes)
									})
								]
							}, c.name)) })]
						})
					})
				]
			}) : null,
			tab === "ext" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-[length:var(--radius-xl)] border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Extensões vilãs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: extChart,
								layout: "vertical",
								margin: {
									top: 8,
									right: 16,
									left: 16,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										tick: {
											fill: "var(--color-muted)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false,
										unit: " GB"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "name",
										width: 72,
										tick: {
											fill: "var(--color-muted)",
											fontSize: 12
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "var(--color-bg)",
											border: "1px solid var(--color-border)",
											borderRadius: 12,
											color: "var(--color-fg)"
										},
										formatter: (v) => [`${v} GB`, "Tamanho"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "gb",
										fill: "var(--color-accent)",
										radius: [
											0,
											6,
											6,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						headers: [
							"Ext",
							"Arquivos",
							"Tamanho"
						],
						rows: exts.map((e) => [
							e.ext,
							formatInt(e.files),
							bytesHuman(e.bytes)
						]),
						empty: "Nenhuma extensão neste filtro."
					})
				]
			}) : null,
			tab === "pastas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-[length:var(--radius-xl)] border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Pastas mais pesadas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: summary.source === "demo" ? "Estimativa do Observer original (top 5000 arquivos). Nomes ofuscados de propósito." : "Primeiro nível sob a pasta escolhida. Scan local usa todos os arquivos desta pasta."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						headers: [
							"Pasta",
							"Tamanho",
							"Arquivos"
						],
						rows: folders.map((f) => [
							f.folder,
							bytesHuman(f.bytes),
							f.files ? formatInt(f.files) : "—"
						]),
						empty: "Nenhuma pasta neste filtro."
					}),
					summary.heaviest.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-8 text-sm font-medium",
						children: "Arquivos mais pesados"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						headers: [
							"Caminho",
							"Tamanho",
							"Ext"
						],
						rows: summary.heaviest.filter((h) => !needle || h.path.toLowerCase().includes(needle) || h.ext.toLowerCase().includes(needle)).map((h) => [
							h.path,
							bytesHuman(h.size),
							h.ext
						]),
						empty: "Nenhum arquivo neste filtro."
					})] }) : null
				]
			}) : null,
			tab === "dups" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-[length:var(--radius-xl)] border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Duplicatas candidatas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Mesmo nome e mesmo tamanho — não é hash de conteúdo. Use como pista, não como sentença."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: dups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-sm text-muted",
							children: "Nenhuma duplicata candidata neste recorte."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[32rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[11px] uppercase tracking-[0.12em] text-subtle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Arquivo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Vezes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Tamanho"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Amostra"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: dups.slice(0, 40).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "max-w-[14rem] truncate py-2.5 font-mono text-xs",
										children: d.filename
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 font-mono tabular-nums",
										children: formatInt(d.count)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 font-mono tabular-nums",
										children: bytesHuman(d.size_bytes)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "max-w-[16rem] truncate py-2.5 text-xs text-muted",
										children: d.sample_paths[0] ?? "—"
									})
								]
							}, `${d.filename}-${d.size_bytes}-${d.count}`)) })]
						})
					})
				]
			}) : null
		]
	});
}
function DataTable({ headers, rows, empty }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 py-8 text-sm text-muted",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-[11px] uppercase tracking-[0.12em] text-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "py-2 font-medium",
					children: h
				}, h)) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-t border-border",
				children: row.map((cell, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: `py-2.5 ${j === 0 ? "max-w-[16rem] truncate font-mono text-xs" : "font-mono tabular-nums"}`,
					children: cell
				}, j))
			}, i)) })]
		})
	});
}
function ReportPage() {
	const summary = useNeverLost((s) => s.summary);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 rounded-[length:var(--radius-sm)] bg-surface-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 rounded-[length:var(--radius-lg)] border border-border bg-surface" }, i))
		})]
	}) });
	if (!summary) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center px-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight",
				children: "Nenhum mapa ainda"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Escolha uma pasta ou abra o mapa de prova para gerar o relatório."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Voltar ao observer"
				})
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportView, { summary }) });
}
//#endregion
export { ReportPage as component };
