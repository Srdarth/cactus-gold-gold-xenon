import type { FileCategory } from "./types";

const DOC = new Set([
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
  ".yml",
]);

const CODE = new Set([
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
  ".env",
]);

const ARCH = new Set([
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".bz2",
  ".xz",
  ".iso",
]);

const MEDIA = new Set([
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
  ".m4a",
]);

export function extensionOf(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  const i = base.lastIndexOf(".");
  if (i <= 0) return "";
  return base.slice(i).toLowerCase();
}

export function categorize(ext: string): FileCategory {
  const e = ext.toLowerCase();
  if (DOC.has(e)) return "Documentos";
  if (CODE.has(e)) return "Código";
  if (ARCH.has(e)) return "Compactados";
  if (MEDIA.has(e)) return "Mídia";
  return "Outros";
}

export const CATEGORY_ORDER: FileCategory[] = [
  "Documentos",
  "Mídia",
  "Compactados",
  "Código",
  "Outros",
];
