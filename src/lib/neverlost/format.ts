export function bytesHuman(n: number): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let x = Math.abs(n);
  let i = 0;
  while (x >= 1024 && i < units.length - 1) {
    x /= 1024;
    i += 1;
  }
  const digits = i === 0 ? 0 : x >= 100 ? 1 : 2;
  return `${x.toFixed(digits)} ${units[i]}`;
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(n);
}

export function formatElapsed(seconds: number): string {
  if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m} min ${s}s`;
}

export function makeRunId(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_` +
    `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}
