import { create } from "zustand";
import type { ChaosSummary, ScanProgress } from "./types";

const KEY = "neverlost.summary.v2";

function coerce(raw: ChaosSummary): ChaosSummary {
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
    stats: raw.stats ?? { OK: raw.total_files, NEW: raw.total_files, MOVED: 0, UNCHANGED: 0, ERR: 0 },
  };
}

function readStored(): ChaosSummary | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? coerce(JSON.parse(raw) as ChaosSummary) : null;
  } catch {
    return null;
  }
}

function writeStored(summary: ChaosSummary | null) {
  if (typeof sessionStorage === "undefined") return;
  try {
    if (!summary) sessionStorage.removeItem(KEY);
    else sessionStorage.setItem(KEY, JSON.stringify(summary));
  } catch {
    /* quota */
  }
}

type NeverLostState = {
  summary: ChaosSummary | null;
  scanning: boolean;
  cancelled: boolean;
  progress: ScanProgress | null;
  log: string[];
  error: string | null;
  setSummary: (s: ChaosSummary | null) => void;
  setScanning: (v: boolean) => void;
  requestCancel: () => void;
  resetCancel: () => void;
  setProgress: (p: ScanProgress | null) => void;
  pushLog: (line: string) => void;
  clearLog: () => void;
  setError: (e: string | null) => void;
};

export const useNeverLost = create<NeverLostState>((set) => ({
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
  pushLog: (line) =>
    set((s) => ({ log: s.log.length > 80 ? [...s.log.slice(-60), line] : [...s.log, line] })),
  clearLog: () => set({ log: [] }),
  setError: (error) => set({ error }),
}));
