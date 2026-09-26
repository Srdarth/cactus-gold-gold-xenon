export type FileCategory =
  | "Documentos"
  | "Código"
  | "Compactados"
  | "Mídia"
  | "Outros";

export type FileMeta = {
  path: string;
  name: string;
  size: number;
  mtimeMs: number;
  ext: string;
  category: FileCategory;
};

export type CategoryRow = {
  name: FileCategory;
  files: number;
  bytes: number;
};

export type ExtRow = {
  ext: string;
  files: number;
  bytes: number;
};

export type FolderRow = {
  folder: string;
  bytes: number;
  files: number;
};

export type DupCandidate = {
  filename: string;
  size_bytes: number;
  count: number;
  sample_paths: string[];
};

export type HeavyFile = {
  path: string;
  size: number;
  ext: string;
  category: FileCategory;
};

export type ScanStats = {
  OK: number;
  NEW: number;
  MOVED: number;
  UNCHANGED: number;
  ERR: number;
};

export type ChaosSummary = {
  run_id: string;
  roots: string[];
  total_files: number;
  total_size_bytes: number;
  categories: CategoryRow[];
  top_extensions: ExtRow[];
  top_folders: FolderRow[];
  dup_candidates: DupCandidate[];
  heaviest: HeavyFile[];
  dup_extra_copies: number;
  dup_wasted_bytes: number;
  stats: ScanStats;
  missing_marked: number;
  elapsed_seconds: number;
  source: "demo" | "local";
};

export type ScanProgress = {
  processed: number;
  total: number;
  bytes: number;
  current?: string;
  startedAt: number;
};
