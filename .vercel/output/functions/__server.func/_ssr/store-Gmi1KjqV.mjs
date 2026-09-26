import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Eye } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as create } from "../_libs/zustand.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function AppShell({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-h-dvh bg-bg text-fg", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 text-sm font-medium tracking-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 items-center justify-center rounded-[length:var(--radius-sm)] border border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
							className: "size-4 text-accent",
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["NeverLost", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 hidden text-xs font-normal text-muted sm:inline",
						children: "Observer"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/report",
						className: "text-xs text-muted hover:text-fg",
						children: "Relatório"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
						children: "Somente leitura"
					})]
				})]
			})
		}), children]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
			ghost: "text-muted hover:bg-surface-2 hover:text-fg"
		},
		size: {
			default: "h-11 min-h-11 rounded-[length:var(--radius-md)] px-5 text-sm",
			sm: "h-10 min-h-10 rounded-[length:var(--radius-sm)] px-3 text-xs",
			lg: "h-12 min-h-12 rounded-[length:var(--radius-md)] px-6 text-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function bytesHuman(n) {
	const units = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB",
		"PB"
	];
	let x = Math.abs(n);
	let i = 0;
	while (x >= 1024 && i < units.length - 1) {
		x /= 1024;
		i += 1;
	}
	const digits = i === 0 ? 0 : x >= 100 ? 1 : 2;
	return `${x.toFixed(digits)} ${units[i]}`;
}
function formatInt(n) {
	return new Intl.NumberFormat("pt-BR").format(n);
}
function formatElapsed(seconds) {
	if (seconds < 1) return `${Math.round(seconds * 1e3)} ms`;
	if (seconds < 60) return `${seconds.toFixed(1)} s`;
	return `${Math.floor(seconds / 60)} min ${Math.round(seconds % 60)}s`;
}
function makeRunId(d = /* @__PURE__ */ new Date()) {
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
var KEY = "neverlost.summary.v2";
function coerce(raw) {
	const dups = raw.dup_candidates ?? [];
	let extra = raw.dup_extra_copies;
	let wasted = raw.dup_wasted_bytes;
	if (extra == null || wasted == null) {
		extra = 0;
		wasted = 0;
		for (const d of dups) {
			const x = Math.max(0, d.count - 1);
			extra += x;
			wasted += x * d.size_bytes;
		}
	}
	return {
		...raw,
		top_folders: raw.top_folders ?? [],
		heaviest: raw.heaviest ?? [],
		dup_extra_copies: extra,
		dup_wasted_bytes: wasted,
		stats: raw.stats ?? {
			OK: raw.total_files,
			NEW: raw.total_files,
			MOVED: 0,
			UNCHANGED: 0,
			ERR: 0
		}
	};
}
function readStored() {
	if (typeof sessionStorage === "undefined") return null;
	try {
		const raw = sessionStorage.getItem(KEY);
		return raw ? coerce(JSON.parse(raw)) : null;
	} catch {
		return null;
	}
}
function writeStored(summary) {
	if (typeof sessionStorage === "undefined") return;
	try {
		if (!summary) sessionStorage.removeItem(KEY);
		else sessionStorage.setItem(KEY, JSON.stringify(summary));
	} catch {}
}
var useNeverLost = create((set) => ({
	summary: readStored(),
	scanning: false,
	cancelled: false,
	progress: null,
	log: [],
	error: null,
	setSummary: (summary) => {
		const next = summary ? coerce(summary) : null;
		writeStored(next);
		set({ summary: next });
	},
	setScanning: (scanning) => set({ scanning }),
	requestCancel: () => set({ cancelled: true }),
	resetCancel: () => set({ cancelled: false }),
	setProgress: (progress) => set({ progress }),
	pushLog: (line) => set((s) => ({ log: s.log.length > 80 ? [...s.log.slice(-60), line] : [...s.log, line] })),
	clearLog: () => set({ log: [] }),
	setError: (error) => set({ error })
}));
//#endregion
export { formatInt as a, formatElapsed as i, Button as n, makeRunId as o, bytesHuman as r, useNeverLost as s, AppShell as t };
