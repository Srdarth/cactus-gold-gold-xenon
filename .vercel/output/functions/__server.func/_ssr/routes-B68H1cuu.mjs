import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as FolderSearch, n as Square, r as Play } from "../_libs/lucide-react.mjs";
import { a as formatInt, n as Button, o as makeRunId, r as bytesHuman, s as useNeverLost, t as AppShell } from "./store-Gmi1KjqV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B68H1cuu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DOC = /* @__PURE__ */ new Set([
	".pdf",
	".doc",
	".docx",
	".ppt",
	".pptx",
	".xls",
	".xlsx",
	".csv",
	".txt",
	".rtf",
	".md",
	".odt",
	".ods",
	".odp",
	".epub",
	".mobi",
	".json",
	".xml",
	".yaml",
	".yml"
]);
var CODE = /* @__PURE__ */ new Set([
	".py",
	".js",
	".ts",
	".tsx",
	".jsx",
	".java",
	".c",
	".cpp",
	".cs",
	".go",
	".rs",
	".php",
	".html",
	".css",
	".scss",
	".sql",
	".sh",
	".bat",
	".ps1",
	".ini",
	".toml",
	".cfg",
	".env"
]);
var ARCH = /* @__PURE__ */ new Set([
	".zip",
	".rar",
	".7z",
	".tar",
	".gz",
	".bz2",
	".xz",
	".iso"
]);
var MEDIA = /* @__PURE__ */ new Set([
	".jpg",
	".jpeg",
	".png",
	".gif",
	".bmp",
	".tiff",
	".webp",
	".heic",
	".mp4",
	".mov",
	".mkv",
	".avi",
	".wmv",
	".flv",
	".mpeg",
	".mpg",
	".3gp",
	".mp3",
	".wav",
	".flac",
	".aac",
	".ogg",
	".m4a"
]);
function extensionOf(name) {
	const base = name.split(/[/\\]/).pop() ?? name;
	const i = base.lastIndexOf(".");
	if (i <= 0) return "";
	return base.slice(i).toLowerCase();
}
function categorize(ext) {
	const e = ext.toLowerCase();
	if (DOC.has(e)) return "Documentos";
	if (CODE.has(e)) return "Código";
	if (ARCH.has(e)) return "Compactados";
	if (MEDIA.has(e)) return "Mídia";
	return "Outros";
}
var TOP_N = 12;
var DUP_SAMPLE = 8;
var HEAVY_N = 25;
var FOLDER_TOP_FILES = 5e3;
function fileFromBrowser(file) {
	const path = file.webkitRelativePath || file.name;
	const name = file.name;
	const ext = extensionOf(name);
	return {
		path,
		name,
		size: file.size,
		mtimeMs: file.lastModified,
		ext: ext || "(sem)",
		category: categorize(ext)
	};
}
/** Root + first child — same rule as Observer Python (top folders). */
function folderBucket(path) {
	const parts = path.replace(/\\/g, "/").split("/").filter(Boolean);
	if (parts.length === 0) return "(raiz)";
	if (/^[A-Za-z]:$/.test(parts[0] ?? "")) {
		const drive = `${parts[0]}\\`;
		const first = parts[1];
		return first ? `${drive}${first}` : drive;
	}
	if (parts.length === 1) return parts[0] ?? "(raiz)";
	if (parts.length === 2) return parts[0] ?? "(raiz)";
	return `${parts[0]}/${parts[1]}`;
}
function uniqueRoots(paths) {
	const set = /* @__PURE__ */ new Set();
	for (const p of paths) {
		const first = p.replace(/\\/g, "/").split("/").filter(Boolean)[0];
		if (first) set.add(first);
	}
	return [...set].slice(0, 12);
}
function analyzeFiles(files, elapsedSeconds) {
	const catMap = /* @__PURE__ */ new Map();
	const extMap = /* @__PURE__ */ new Map();
	const dupMap = /* @__PURE__ */ new Map();
	const folderMap = /* @__PURE__ */ new Map();
	let totalBytes = 0;
	const heaviest = [];
	const bySize = files.length <= FOLDER_TOP_FILES ? files : [...files].sort((a, b) => b.size - a.size).slice(0, FOLDER_TOP_FILES);
	for (const f of files) {
		totalBytes += f.size;
		const cat = catMap.get(f.category) ?? {
			files: 0,
			bytes: 0
		};
		cat.files += 1;
		cat.bytes += f.size;
		catMap.set(f.category, cat);
		const extKey = f.ext || "(sem)";
		const ext = extMap.get(extKey) ?? {
			files: 0,
			bytes: 0
		};
		ext.files += 1;
		ext.bytes += f.size;
		extMap.set(extKey, ext);
		const dupKey = `${f.name}|${f.size}`;
		const dup = dupMap.get(dupKey) ?? {
			count: 0,
			size: f.size,
			samples: []
		};
		dup.count += 1;
		if (dup.samples.length < DUP_SAMPLE) dup.samples.push(f.path);
		dupMap.set(dupKey, dup);
		if (heaviest.length < HEAVY_N) {
			heaviest.push({
				path: f.path,
				size: f.size,
				ext: f.ext,
				category: f.category
			});
			if (heaviest.length === HEAVY_N) heaviest.sort((a, b) => a.size - b.size);
		} else if (f.size > heaviest[0].size) {
			heaviest[0] = {
				path: f.path,
				size: f.size,
				ext: f.ext,
				category: f.category
			};
			heaviest.sort((a, b) => a.size - b.size);
		}
	}
	for (const f of bySize) {
		const key = folderBucket(f.path);
		const row = folderMap.get(key) ?? {
			bytes: 0,
			files: 0
		};
		row.bytes += f.size;
		row.files += 1;
		folderMap.set(key, row);
	}
	const categories = [...catMap.entries()].map(([name, v]) => ({
		name,
		files: v.files,
		bytes: v.bytes
	})).sort((a, b) => b.bytes - a.bytes);
	const top_extensions = [...extMap.entries()].map(([ext, v]) => ({
		ext,
		files: v.files,
		bytes: v.bytes
	})).sort((a, b) => b.bytes - a.bytes).slice(0, TOP_N);
	const top_folders = [...folderMap.entries()].map(([folder, v]) => ({
		folder,
		bytes: v.bytes,
		files: v.files
	})).sort((a, b) => b.bytes - a.bytes).slice(0, TOP_N);
	const dup_candidates = [...dupMap.entries()].filter(([, v]) => v.count >= 2).map(([key, v]) => ({
		filename: key.split("|")[0] ?? key,
		size_bytes: v.size,
		count: v.count,
		sample_paths: v.samples
	})).sort((a, b) => b.count - a.count || b.size_bytes - a.size_bytes).slice(0, 120);
	let dup_extra_copies = 0;
	let dup_wasted_bytes = 0;
	for (const d of dup_candidates) {
		const extra = d.count - 1;
		dup_extra_copies += extra;
		dup_wasted_bytes += extra * d.size_bytes;
	}
	heaviest.sort((a, b) => b.size - a.size);
	return {
		run_id: makeRunId(),
		roots: uniqueRoots(files.map((f) => f.path)),
		total_files: files.length,
		total_size_bytes: totalBytes,
		categories,
		top_extensions,
		top_folders,
		dup_candidates,
		heaviest,
		dup_extra_copies,
		dup_wasted_bytes,
		stats: {
			OK: files.length,
			NEW: files.length,
			MOVED: 0,
			UNCHANGED: 0,
			ERR: 0
		},
		missing_marked: 0,
		elapsed_seconds: elapsedSeconds,
		source: "local"
	};
}
/** Redacted Observer output — original sanitizer collapsed folder names to <FOLDER>. */
var DEMO_FOLDERS = [
	{
		folder: "C:\\<FOLDER> #1",
		bytes: 600584372224,
		files: 0
	},
	{
		folder: "C:\\<FOLDER> #2",
		bytes: 25040207872,
		files: 0
	},
	{
		folder: "C:\\<FOLDER> Games",
		bytes: 18264358912,
		files: 0
	},
	{
		folder: "R:\\<FOLDER>",
		bytes: 16273899520,
		files: 0
	},
	{
		folder: "C:\\<FOLDER> Files",
		bytes: 13864710963,
		files: 0
	},
	{
		folder: "C:\\<FOLDER> Files (x86)",
		bytes: 6184752906,
		files: 0
	},
	{
		folder: "F:\\<FOLDER>",
		bytes: 5175431987,
		files: 0
	},
	{
		folder: "R:\\<FOLDER> #2",
		bytes: 4252017623,
		files: 0
	},
	{
		folder: "D:\\<FOLDER>",
		bytes: 3199737856,
		files: 0
	},
	{
		folder: "C:\\<FOLDER> #3",
		bytes: 2072205721,
		files: 0
	},
	{
		folder: "E:\\<FOLDER>",
		bytes: 1224065679,
		files: 0
	},
	{
		folder: "C:\\<FOLDER> #4",
		bytes: 1073741824,
		files: 0
	}
];
function normalizeDemo(raw) {
	const dups = raw.dup_candidates ?? [];
	let dup_extra_copies = 0;
	let dup_wasted_bytes = 0;
	for (const d of dups) {
		const extra = Math.max(0, d.count - 1);
		dup_extra_copies += extra;
		dup_wasted_bytes += extra * d.size_bytes;
	}
	return {
		run_id: raw.run_id,
		roots: raw.roots,
		total_files: raw.total_files,
		total_size_bytes: raw.total_size_bytes,
		categories: raw.categories.map((c) => ({
			name: c.name,
			files: c.files,
			bytes: c.bytes
		})),
		top_extensions: raw.top_extensions,
		top_folders: DEMO_FOLDERS,
		dup_candidates: dups,
		heaviest: [],
		dup_extra_copies,
		dup_wasted_bytes,
		stats: raw.stats ?? {
			OK: raw.total_files,
			NEW: raw.total_files,
			MOVED: 0,
			UNCHANGED: 0,
			ERR: 0
		},
		missing_marked: raw.missing_marked ?? 0,
		elapsed_seconds: raw.elapsed_seconds ?? 0,
		source: "demo"
	};
}
var CHUNK = 400;
function ScanPanel() {
	const inputRef = (0, import_react.useRef)(null);
	const navigate = useNavigate();
	const { scanning, cancelled, progress, log, error, setScanning, setProgress, setSummary, pushLog, clearLog, setError, requestCancel, resetCancel } = useNeverLost();
	const [busyDemo, setBusyDemo] = (0, import_react.useState)(false);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = inputRef.current;
		if (!el) return;
		el.setAttribute("webkitdirectory", "");
		el.setAttribute("directory", "");
	}, []);
	async function runLocalScan(list) {
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
		setProgress({
			processed: 0,
			total,
			bytes: 0,
			startedAt
		});
		pushLog(`Observer ativo · ${formatInt(total)} entradas · somente leitura`);
		const metas = [];
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
				startedAt
			});
			if (processed === CHUNK || processed % (CHUNK * 4) === 0) pushLog(`Indexando ${formatInt(processed)} / ${formatInt(total)} · ${bytesHuman(bytes)}`);
			await new Promise((r) => requestAnimationFrame(r));
		}
		const elapsed = (performance.now() - startedAt) / 1e3;
		pushLog("Agregando mapa do caos…");
		const summary = analyzeFiles(metas, elapsed);
		summary.roots = summary.roots.length ? summary.roots : ["pasta local"];
		setSummary(summary);
		setScanning(false);
		setProgress(null);
		resetCancel();
		pushLog(`Concluído · ${formatInt(summary.total_files)} arquivos · ${bytesHuman(summary.total_size_bytes)} · ${summary.dup_candidates.length} grupos duplicados`);
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
			const summary = normalizeDemo(await res.json());
			setSummary(summary);
			pushLog(`Run ${summary.run_id} · ${bytesHuman(summary.total_size_bytes)} · Observer original`);
			await navigate({ to: "/report" });
		} catch (e) {
			setError(e instanceof Error ? e.message : "Não foi possível abrir o mapa de demonstração.");
		} finally {
			setBusyDemo(false);
		}
	}
	const pct = progress && progress.total > 0 ? Math.min(100, progress.processed / progress.total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `rounded-[length:var(--radius-xl)] border bg-surface p-5 sm:p-7 ${dragOver ? "border-accent" : "border-border"}`,
		onDragOver: (e) => {
			e.preventDefault();
			setDragOver(true);
		},
		onDragLeave: () => setDragOver(false),
		onDrop: (e) => {
			e.preventDefault();
			setDragOver(false);
			if (e.dataTransfer.files?.length) runLocalScan(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
				children: "Modo observer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-xl font-medium tracking-tight",
				children: "Mapear uma pasta"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
				children: "A leitura acontece no navegador. Nada sobe para servidor. O app não move, não apaga e não altera arquivo — só observa metadados e monta o mapa."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				multiple: true,
				className: "hidden",
				onChange: (e) => {
					const list = e.target.files;
					if (list) runLocalScan(list);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						disabled: scanning || busyDemo,
						onClick: () => inputRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderSearch, {}), "Escolher pasta"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						variant: "outline",
						disabled: scanning || busyDemo,
						onClick: () => void loadDemo(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), "Abrir mapa de prova"]
					}),
					scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						variant: "ghost",
						onClick: () => requestCancel(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}), "Cancelar"]
					}) : null
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-danger",
				children: error
			}) : null,
			(scanning || log.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 overflow-hidden rounded-[length:var(--radius-lg)] border border-border bg-bg",
				children: [progress && scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono tabular-nums",
							children: [
								formatInt(progress.processed),
								" / ",
								formatInt(progress.total),
								" · ",
								bytesHuman(progress.bytes)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate pl-4 text-subtle",
							children: progress.current ?? "lendo…"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-1 overflow-hidden rounded-full bg-surface-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-accent transition-[width] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
							style: { width: `${pct}%` }
						})
					})]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-44 overflow-auto p-4 font-mono text-[12px] leading-6 text-accent",
					children: log.join("\n") || "aguardando…"
				})]
			}),
			cancelled && !scanning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-subtle",
				children: "Última varredura foi cancelada."
			}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] uppercase tracking-[0.18em] text-subtle",
				children: "Scanner forense de soberania digital"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 max-w-3xl text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl",
				children: "Sua bagunça nunca mais perdida."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-2xl text-base leading-relaxed text-muted",
				children: "NeverLost observa uma pasta no seu dispositivo — sem nuvem, sem mover arquivo — e devolve o mapa: onde está o peso, quais extensões dominam e o que parece duplicado."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Prova real",
						v: "1,06 mi arquivos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Volume mapeado",
						v: "1,50 TB"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Modo",
						v: "Somente leitura"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "Dados",
						v: "Ficam no dispositivo"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanPanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-12 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "01",
						t: "Escolher",
						d: "Pasta no navegador, ou o mapa de prova sanitizado do Observer original."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "02",
						t: "Observar",
						d: "Indexação local: categoria, extensão, pasta, duplicata candidata."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
						n: "03",
						t: "Exportar",
						d: "Relatório HTML e JSON. Nada é enviado."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 border-t border-border pt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium tracking-tight",
					children: "O que este MVP faz — e o que não faz"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
							t: "Faz",
							d: "Lê metadados da pasta que você autorizar (nome, tamanho, data). Classifica como o core Python. Mostra o mapa, exporta HTML/JSON."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
							t: "Não faz",
							d: "Não varre o disco C: inteiro do Windows. Não calcula hash de conteúdo. Não apaga duplicata. Não sobe arquivo para nuvem."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
							t: "Duplicata",
							d: "Candidata = mesmo nome + mesmo tamanho. No desktop original, movimentação usa size+mtime (quicksig), não MD5."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
							t: "Mapa de prova",
							d: "É um recorte real sanitizado: 1.063.643 arquivos, ~1,50 TB, roots C: D: K: R:. Pastas ofuscadas de propósito."
						})
					]
				})]
			})
		]
	}) });
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-mono text-sm tabular-nums",
			children: v
		})]
	});
}
function Step({ n, t, d }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-[length:var(--radius-lg)] border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] text-subtle",
				children: n
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm font-medium",
				children: t
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: d
			})
		]
	});
}
function Note({ t, d }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[length:var(--radius-lg)] border border-border bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: t
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted",
			children: d
		})]
	});
}
//#endregion
export { Home as component };
