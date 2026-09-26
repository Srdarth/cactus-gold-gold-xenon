import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ScanPanel } from "@/components/scan-panel";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
          Scanner forense de soberania digital
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          Sua bagunça nunca mais perdida.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          NeverLost observa uma pasta no seu dispositivo — sem nuvem, sem mover arquivo —
          e devolve o mapa: onde está o peso, quais extensões dominam e o que parece duplicado.
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat k="Prova real" v="1,06 mi arquivos" />
          <Stat k="Volume mapeado" v="1,50 TB" />
          <Stat k="Modo" v="Somente leitura" />
          <Stat k="Dados" v="Ficam no dispositivo" />
        </dl>

        <div className="mt-12">
          <ScanPanel />
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-3">
          <Step n="01" t="Escolher" d="Pasta no navegador, ou o mapa de prova sanitizado do Observer original." />
          <Step n="02" t="Observar" d="Indexação local: categoria, extensão, pasta, duplicata candidata." />
          <Step n="03" t="Exportar" d="Relatório HTML e JSON. Nada é enviado." />
        </ol>

        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-lg font-medium tracking-tight">O que este MVP faz — e o que não faz</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Note
              t="Faz"
              d="Lê metadados da pasta que você autorizar (nome, tamanho, data). Classifica como o core Python. Mostra o mapa, exporta HTML/JSON."
            />
            <Note
              t="Não faz"
              d="Não varre o disco C: inteiro do Windows. Não calcula hash de conteúdo. Não apaga duplicata. Não sobe arquivo para nuvem."
            />
            <Note
              t="Duplicata"
              d="Candidata = mesmo nome + mesmo tamanho. No desktop original, movimentação usa size+mtime (quicksig), não MD5."
            />
            <Note
              t="Mapa de prova"
              d="É um recorte real sanitizado: 1.063.643 arquivos, ~1,50 TB, roots C: D: K: R:. Pastas ofuscadas de propósito."
            />
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-t border-border pt-3">
      <dt className="text-xs text-subtle">{k}</dt>
      <dd className="mt-1 font-mono text-sm tabular-nums">{v}</dd>
    </div>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <li className="rounded-[length:var(--radius-lg)] border border-border bg-surface p-5">
      <p className="font-mono text-[11px] text-subtle">{n}</p>
      <p className="mt-2 text-sm font-medium">{t}</p>
      <p className="mt-1 text-sm text-muted">{d}</p>
    </li>
  );
}

function Note({ t, d }: { t: string; d: string }) {
  return (
    <div className="rounded-[length:var(--radius-lg)] border border-border bg-surface p-5">
      <p className="text-sm font-medium">{t}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
    </div>
  );
}
