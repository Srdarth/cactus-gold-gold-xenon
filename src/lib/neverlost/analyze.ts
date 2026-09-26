import { categorize, extensionOf } from "./categories";
import { makeRunId } from "./format";
import type {
  ChaosSummary,
  DupCandidate,
  ExtRow,
  FileCategory,
  FileMeta,
  FolderRow,
  HeavyFile,
} from "./types";

const TOP_N = 12;
const DUP_SAMPLE = 8;
const HEAVY_N = 25;
const FOLDER_TOP_FILES = 5000;

export function fileFromBrowser(file: File): FileMeta {
  const path =
    (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
  const name = file.name;
  const ext = extensionOf(name);
  return {
    path,
    name,
    size: file.size,
    mtimeMs: file.lastModified,
    ext: ext || "(sem)",
    category: categorize(ext),
  };
}

/** Root + first child — same rule as Observer Python (top folders). */
export function folderBucket(path: string): string {
  const unix = path.replace(/\\/g, "/");
  const parts = unix.split("/").filter(Boolean);
  if (parts.length === 0) return "(raiz)";
  const win = /^[A-Za-z]:$/.test(parts[0] ?? "");
  if (win) {
    const drive = `${parts[0]}\\`;
    const first = parts[1];
    return first ? `${drive}${first}` : drive;
  }
  if (parts.length === 1) return parts[0] ?? "(raiz)";
  if (parts.length === 2) return parts[0] ?? "(raiz)";
  return `${parts[0]}/${parts[1]}`;
}

function uniqueRoots(paths: string[]): string[] {
  const set = new Set<string>();
  for (const p of paths) {
    const norm = p.replace(/\\/g, "/");
    const first = norm.split("/").filter(Boolean)[0];
    if (first) set.add(first);
  }
  return [...set].slice(0, 12);
}

export function analyzeFiles(files: FileMeta[], elapsedSeconds: number): ChaosSummary {
  const catMap = new Map<FileCategory, { files: number; bytes: number }>();
  const extMap = new Map<string, { files: number; bytes: number }>();
  const dupMap = new Map<string, { count: number; size: number; samples: string[] }>();
  const folderMap = new Map<string, { bytes: number; files: number }>();

  let totalBytes = 0;
  const heaviest: HeavyFile[] = [];

  const useAllFolders = files.length <= FOLDER_TOP_FILES;
  const bySize = useAllFolders ? files : [...files].sort((a, b) => b.size - a.size).slice(0, FOLDER_TOP_FILES);

  for (const f of files) {
    totalBytes += f.size;

    const cat = catMap.get(f.category) ?? { files: 0, bytes: 0 };
    cat.files += 1;
    cat.bytes += f.size;
    catMap.set(f.category, cat);

    const extKey = f.ext || "(sem)";
    const ext = extMap.get(extKey) ?? { files: 0, bytes: 0 };
    ext.files += 1;
    ext.bytes += f.size;
    extMap.set(extKey, ext);

    const dupKey = `${f.name}|${f.size}`;
    const dup = dupMap.get(dupKey) ?? { count: 0, size: f.size, samples: [] };
    dup.count += 1;
    if (dup.samples.length < DUP_SAMPLE) dup.samples.push(f.path);
    dupMap.set(dupKey, dup);

    if (heaviest.length < HEAVY_N) {
      heaviest.push({ path: f.path, size: f.size, ext: f.ext, category: f.category });
      if (heaviest.length === HEAVY_N) heaviest.sort((a, b) => a.size - b.size);
    } else if (f.size > heaviest[0].size) {
      heaviest[0] = { path: f.path, size: f.size, ext: f.ext, category: f.category };
      heaviest.sort((a, b) => a.size - b.size);
    }
  }

  for (const f of bySize) {
    const key = folderBucket(f.path);
    const row = folderMap.get(key) ?? { bytes: 0, files: 0 };
    row.bytes += f.size;
    row.files += 1;
    folderMap.set(key, row);
  }

  const categories = [...catMap.entries()]
    .map(([name, v]) => ({ name, files: v.files, bytes: v.bytes }))
    .sort((a, b) => b.bytes - a.bytes);

  const top_extensions: ExtRow[] = [...extMap.entries()]
    .map(([ext, v]) => ({ ext, files: v.files, bytes: v.bytes }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, TOP_N);

  const top_folders: FolderRow[] = [...folderMap.entries()]
    .map(([folder, v]) => ({ folder, bytes: v.bytes, files: v.files }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, TOP_N);

  const dup_candidates: DupCandidate[] = [...dupMap.entries()]
    .filter(([, v]) => v.count >= 2)
    .map(([key, v]) => ({
      filename: key.split("|")[0] ?? key,
      size_bytes: v.size,
      count: v.count,
      sample_paths: v.samples,
    }))
    .sort((a, b) => b.count - a.count || b.size_bytes - a.size_bytes)
    .slice(0, 120);

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
      ERR: 0,
    },
    missing_marked: 0,
    elapsed_seconds: elapsedSeconds,
    source: "local",
  };
}

export type DemoRaw = {
  run_id: string;
  roots: string[];
  total_files: number;
  total_size_bytes: number;
  categories: { name: string; files: number; bytes: number }[];
  top_extensions: { ext: string; files: number; bytes: number }[];
  dup_candidates: DupCandidate[];
  stats?: ChaosSummary["stats"];
  missing_marked?: number;
  elapsed_seconds?: number;
};

/** Redacted Observer output — original sanitizer collapsed folder names to <FOLDER>. */
const DEMO_FOLDERS: FolderRow[] = [
  { folder: "C:\\<FOLDER> #1", bytes: 600584372224, files: 0 },
  { folder: "C:\\<FOLDER> #2", bytes: 25040207872, files: 0 },
  { folder: "C:\\<FOLDER> Games", bytes: 18264358912, files: 0 },
  { folder: "R:\\<FOLDER>", bytes: 16273899520, files: 0 },
  { folder: "C:\\<FOLDER> Files", bytes: 13864710963, files: 0 },
  { folder: "C:\\<FOLDER> Files (x86)", bytes: 6184752906, files: 0 },
  { folder: "F:\\<FOLDER>", bytes: 5175431987, files: 0 },
  { folder: "R:\\<FOLDER> #2", bytes: 4252017623, files: 0 },
  { folder: "D:\\<FOLDER>", bytes: 3199737856, files: 0 },
  { folder: "C:\\<FOLDER> #3", bytes: 2072205721, files: 0 },
  { folder: "E:\\<FOLDER>", bytes: 1224065679, files: 0 },
  { folder: "C:\\<FOLDER> #4", bytes: 1073741824, files: 0 },
];

export function normalizeDemo(raw: DemoRaw): ChaosSummary {
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
      name: c.name as FileCategory,
      files: c.files,
      bytes: c.bytes,
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
      ERR: 0,
    },
    missing_marked: raw.missing_marked ?? 0,
    elapsed_seconds: raw.elapsed_seconds ?? 0,
    source: "demo",
  };
}
