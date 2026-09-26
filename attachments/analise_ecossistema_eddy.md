# 📋 ANÁLISE ESTRUTURADA DO ECOSISTEMA EddY
## Extração Completa dos Documentos Consolidados

---

## 1. RESUMO EXECUTIVO

O ecossistema **EddY** evoluiu de "scripts band-aid" fragmentados para um **Sistema de Identidade Operacional Total** — um Personal Data OS 100% offline-first e local. O projeto é estruturado em três entidades:

| Entidade | Função |
|----------|--------|
| **EDS** (Eddy Digital Solutions) | Veículo corporativo, infraestrutura legal, tecnológica e operacional |
| **ESL** (Exclusivity ESL) | Camada artística, estética e propriedade intelectual (Isabella, Vivian) |
| **EddY / NeverLost** | O produto — motor de mapeamento, organização e transformação de dados |

O foco imediato é o **NeverLost-lite** (MVP): um scanner de arquivos que entrega visibilidade imediata ao patrimônio digital do usuário, sem promessas de "IA vidente".

---

## 2. INVENTÁRIO DE DECISÕES JÁ TOMADAS

### 2.1 Missão e Visão (CONSOLIDADAS)
- **Missão:** "Transformar informação dispersa em conhecimento acionável" / "transformar patrimônio digital em ativo produtivo"
- **Visão:** Sistema operacional do conhecimento para profissionais/criadores, onde o EddY age como motor de evolução de carreira ou negócio

### 2.2 Pilares do EddY (5 pilares fixos)
1. **Capturar** — Receber todo tipo de dado (PDF, imagem, áudio, código)
2. **Entender** — Processar e extrair metadados (tópicos, datas, relações)
3. **Organizar/Relacionar** — Representar conhecimento estruturado (links, categorias, vetores)
4. **Produzir** — Gerar conteúdo e produtos (resumos, artigos, cursos, agentes automáticos)
5. **Evoluir** — Aprender com uso (feedback, histórico, preferências)

### 2.3 Decisões Constitucionais (Regras Imutáveis)
| # | Princípio | Implicação Técnica |
|---|-----------|-------------------|
| 1 | **Integridade dos dados** — nunca altera/deleta original sem confirmação | Soft actions, backups, DRY_RUN = True |
| 2 | **Produção contínua** — organização não para produção | Pipeline paralelo, não sequencial |
| 3 | **Transparência** — toda ação vem com explicação | Logs detalhados, justificativas em UI |
| 4 | **Propriedade do usuário** — dados pertencem ao usuário | Nada enviado para treinar modelos externos |
| 5 | **Modularidade** — cada módulo funciona isoladamente | Microserviços, APIs entre factories |

### 2.4 Fluxo Canônico (3 Leis)
```
MAPEAR (Observe/Index) → PLANEJAR (Understand/Decide) → AGIR (Execute)
```

---

## 3. INVENTÁRIO TÉCNICO

### 3.1 Stack Tecnológica Definida

| Camada | Escolha | Alternativas Consideradas |
|--------|---------|--------------------------|
| Containerização | **Docker + Docker Compose** | Podman, Rancher Desktop |
| Banco Relacional | **PostgreSQL 16** | MariaDB, SQLite (protótipo) |
| Cache/Fila | **Redis 8.x** | Memcached |
| Banco Vetorial | **Qdrant** | Weaviate, Milvus, FAISS, Pinecone |
| Automação | **n8n** (self-hosted) | Node-RED, Huginn |
| IA/LLM | **Ollama (local)** + APIs pagas sob demanda | GPT4All, Llama.cpp |
| OCR | **Tesseract OCR** | — |
| Proxy/SSL | **Traefik v3.2** | Nginx, Caddy |
| Notas/Docs | **Obsidian** | Joplin, Notion |
| Frontend | **Hugo** (estático) ou **React/Next.js** | — |
| Versionamento | **GitHub** | — |
| API | **FastAPI** (sugerido) | Flask |

### 3.2 Arquitetura de Módulos (Factories)

```
┌─────────────────────────────────────────────────────────────┐
│  Usuário / Frontend / Serviços Externos / Webhooks          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Traefik (Proxy + HTTPS + Segurança)                      │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│  n8n (Automation Factory — Orquestrador Central)            │
│  → Orquestra: Scanner, IA, Banco, Notificações            │
└───────┬───────────────────┬───────────────────┬─────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐ ┌───────────────┐ ┌─────────────────────────┐
│ PostgreSQL    │ │ Redis         │ │  Ollama + Qdrant        │
│ → Metadados   │ │ → Fila/Cache  │ │  → Embeddings + Busca   │
│ → Ativos      │ │               │ │  → IA Local/Privada     │
└───────────────┘ └───────────────┘ └─────────────────────────┘
        ▲
        │
┌───────┴─────────────────────────────────────────────────────┐
│  NeverLost Scanner (Python, containerizado)                 │
│  → Varre arquivos → Envia metadados → n8n valida e salva  │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Configuração Docker Compose (JÁ DEFINIDA)

O documento contém um `docker-compose.yml` completo com:
- **n8n** (imagem stable, com PostgreSQL + Redis, limpeza automática de logs a cada 7 dias)
- **PostgreSQL 16-alpine** (dados persistentes via volume)
- **Redis 8-alpine** (com senha via `--requirepass`)
- **Traefik v3.2** (SSL automático via Let's Encrypt, API desabilitada)
- **Rede isolada** `eddy_net` (bridge)
- **Arquivo `.env`** separado para segredos

### 3.4 Estrutura de Pastas Proposta
```
eddy-n8n/
├── .env                # Senhas/segredos (nunca no Git!)
├── docker-compose.yml  # Definição de todos os serviços
└── README.md           # Documentação do ambiente
```

---

## 4. INVENTÁRIO DE ENTREGÁVEIS

### 4.1 O que JÁ EXISTE (do pipeline EddY)
| Item | Status | Detalhes |
|------|--------|----------|
| `run_pipeline.py` | ✅ Funcional | Pipeline com stages: observe, identify, plan, execute |
| `eddy.db` (SQLite) | ✅ Populado | 474.231 arquivos indexados |
| `eddy_config.json` | ✅ Existente | Config com targets, dest_root, dry_run |
| Scanner Python | ✅ Funcional | Varre múltiplos drives (R:\, K:\, C:\, G:\) |
| Cache de scan | ✅ Implementado | 364.000 arquivos em cache incremental |
| Logs de erro | ✅ Implementado | `observe_errors_1.log` |
| Modo incremental | ✅ Implementado | Retoma scans anteriores |

### 4.2 O que ESTÁ FALTANDO (lacunas críticas)
| Item | Prioridade | Impacto |
|------|-----------|---------|
| **Exclusões de diretórios no config** | 🔴 CRÍTICA | Scan travando em cache do Chrome (8 arquivos/s) |
| **Etapa `identify`** | 🔴 CRÍTICA | Status dos arquivos não está sendo reclassificado — 474.033 como `new` |
| **Batch inserts no SQLite** | 🟡 ALTA | Inserção um a um gargalando performance |
| **API REST do scanner** | 🟡 ALTA | Scanner não expõe endpoint para n8n consumir |
| **Landing page** | 🟡 ALTA | Necessária para primeira entrega imediata |
| **Docker do scanner** | 🟡 ALTA | Scanner ainda não está containerizado |
| **PostgreSQL para n8n** | 🟢 MÉDIA | Config já definida, só falta subir |
| **Qdrant** | 🟢 MÉDIA | Não mencionado no docker-compose atual |
| **Ollama** | 🟢 MÉDIA | Não mencionado no docker-compose atual |
| **FastAPI / Flask** | 🟢 MÉDIA | API para consumir dados do scanner |
| **Frontend (Hugo/React)** | 🔵 BAIXA | Só necessário no V6 |
| **CI/CD GitHub Actions** | 🔵 BAIXA | Semana 2 do plano de ensino |

---

## 5. PROBLEMAS IDENTIFICADOS

### 5.1 Problemas Técnicos do Pipeline EddY

| Problema | Severidade | Causa Raiz | Solução Proposta |
|----------|-----------|-----------|-----------------|
| **Degradação de performance** (5.800/s → 8/s) | 🔴 CRÍTICA | Scan entrando em `\AppData\Local\Google\Chrome\User Data\*\Service Worker\CacheStorage\` — milhares de arquivos minúsculos com nomes hex aleatórios | Adicionar `exclude_contains` no `eddy_config.json` para pular Chrome cache, Temp, Recycle.Bin |
| **Status não reclassificado** (474.033 `new`) | 🔴 CRÍTICA | `observe` só adiciona/atualiza registros; não reavalia status de registros antigos. A classificação real só vem na etapa `identify` | Rodar `--stage identify --loop 1` após corrigir exclusões |
| **Inserção SQLite um a um** | 🟡 ALTA | Sem batch inserts nem transaction blocks | Refatorar para `executemany()` ou commit a cada 1.000-10.000 registros |
| **Drive G:\ não existe** | 🟢 BAIXA | Drive removível desconectado | Remover do `targets` ou verificar existência antes de scan |
| **FileNotFoundError (3 erros)** | 🟢 BAIXA | Race condition — arquivos deletados durante scan em `AppData` | Normal em diretórios voláteis; já logado |

### 5.2 Problemas Estratégicos

| Problema | Severidade | Descrição |
|----------|-----------|-----------|
| **Escopo ameaçador** | 🟡 ALTA | Tendência a querer fazer tudo (IA multimodal, SaaS, curso, landing page) simultaneamente |
| **Dependência de recursos de IA** | 🟡 ALTA | Modelos locais exigem GPU; APIs pagas têm custo |
| **Inércia do usuário** | 🟡 ALTA | Se a ferramenta for complexa, não será usada |
| **Concorrência de gigantes** | 🟢 MÉDIA | Notion AI, Gemini, Google Fotos já existem |
| **Falta de validação de mercado** | 🔴 CRÍTICA | Nenhum usuário teste ainda; nenhuma landing page no ar |

---

## 6. INCONSISTÊNCIAS E LACUNAS ENCONTRADAS

### 6.1 Inconsistências Técnicas
1. **Banco de dados duplicado:** O pipeline usa SQLite local (`eddy.db`), mas a arquitetura propõe PostgreSQL para o n8n. **Não há decisão sobre se o scanner usará SQLite (protótipo) ou PostgreSQL (produção).**
2. **Qdrant e Ollama ausentes do docker-compose:** O docker-compose fornecido só tem n8n + PostgreSQL + Redis + Traefik. Qdrant e Ollama são mencionados na arquitetura mas não estão no compose.
3. **Versão do Redis:** O documento menciona "Redis 8.x" mas a imagem no compose é `redis:8-alpine`. Redis 8 ainda não existe oficialmente (última stable é 7.x). **Possível erro de versão.**
4. **n8n em Queue Mode:** O compose configura `QUEUE_MODE=redis` mas não configura workers separados. Para Queue Mode funcionar corretamente, precisa de `n8n worker` como serviço separado.
5. **Traefik sem redirecionamento HTTP→HTTPS:** O compose não tem entrypoint de redirect de HTTP para HTTPS.
6. **Volumes do n8n:** O volume `n8n_data` é anônimo. Em produção, deveria ser volume nomeado com path local para backup fácil.

### 6.2 Inconsistências Estratégicas
1. **Roadmap vs. Realidade:** O roadmap diz V1 = scanner básico (2 semanas), mas o scanner já existe e funciona. O problema é que ele não está integrado ao resto.
2. **Plano de ensino vs. Produto:** O curso de 8 semanas ensina Docker na Semana 3, mas o docker-compose já está pronto. Isso cria uma dissonância: ou o aluno "copia" o compose sem entender, ou o produto já está além do curso.
3. **Monetização antes de validação:** Estratégias de monetização (SaaS, consultoria, templates) estão detalhadas, mas não há evidência de que alguém pagaria. Falta validação.
4. **Persona indefinida:** "Inicialmente percebemos que o EddY pode servir criadores, advogados, pesquisadores, pequenas empresas etc." — isso é **todos**, ou seja, é ninguém. O documento reconhece o risco mas não resolve.

### 6.3 Lacunas de Documentação
| Documento | Status | Necessidade |
|-----------|--------|-------------|
| Whitepaper (missão/visão/pilares) | ❌ Não existe | Alta — serve como norte para decisões |
| Documentação da API do scanner | ❌ Não existe | Alta — n8n precisa consumir |
| Schema do banco de dados | ❌ Não existe | Alta — modelagem necessária |
| Documento de arquitetura técnica | ⚠️ Parcial | Média — o relatório cobre conceitual, não técnico |
| Guia de contribuição / README | ❌ Não existe | Média — para open source futuro |
| Política de privacidade / Termos | ❌ Não existe | Alta — para SaaS |

---

## 7. PRÓXIMOS PASSOS PRIORITÁRIOS

### FASE 0: ESTABILIZAR O QUE EXISTE (Esta semana)

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 0: ESTABILIZAÇÃO DO PIPELINE EXISTENTE                │
├─────────────────────────────────────────────────────────────┤
│  [1] Verificar estado real do banco SQLite                  │
│      └─→ sqlite3 eddy.db "SELECT status, COUNT(*) FROM files  │
│          GROUP BY status;"                                   │
│                                                              │
│  [2] Atualizar eddy_config.json com exclusões                │
│      └─→ Adicionar exclude_contains para Chrome cache,       │
│          Temp, Recycle.Bin, Windows/Temp                     │
│                                                              │
│  [3] Rodar observe novamente para completar scan limpo       │
│      └─→ python run_pipeline.py --stage observe --loop 1    │
│                                                              │
│  [4] Rodar identify para reclassificar status                │
│      └─→ python run_pipeline.py --stage identify --loop 1    │
│                                                              │
│  [5] Verificar se plan/execute está seguro                 │
│      └─→ Confirmar que DRY_RUN=True antes de qualquer ação  │
└─────────────────────────────────────────────────────────────┘
```

### FASE 1: PRIMEIRA ENTREGA IMEDIATA (Semanas 1-2)

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: NEVERLOST DIAGNOSTIC (MVP MÍNIMO)                  │
├─────────────────────────────────────────────────────────────┤
│  [1] Criar script de relatório a partir do eddy.db           │
│      └─→ Python que lê SQLite e gera HTML/PDF estatístico   │
│                                                              │
│  [2] Criar landing page simples (GitHub Pages ou Replit)     │
│      └─→ "Descubra o tesouro escondido nos seus arquivos!"   │
│                                                              │
│  [3] Configurar formulário de coleta de leads               │
│      └─→ Google Forms, Tally, ou formulário HTML simples    │
│                                                              │
│  [4] Criar e-mail de onboarding e sequência básica          │
│      └─→ Mailchimp, Brevo, ou Gmail + script Python         │
│                                                              │
│  [5] Meta: 10-20 inscrições para validar interesse real     │
└─────────────────────────────────────────────────────────────┘
```

### FASE 2: INFRAESTRUTURA PROFISSIONAL (Semanas 3-4)

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 2: DOCKER + n8n + PostgreSQL                         │
├─────────────────────────────────────────────────────────────┤
│  [1] Subir docker-compose.yml (n8n + PostgreSQL + Redis)   │
│      └─→ Corrigir versão do Redis (7-alpine, não 8)        │
│                                                              │
│  [2] Adicionar Qdrant ao docker-compose                      │
│      └─→ Serviço adicional para embeddings                   │
│                                                              │
│  [3] Adicionar Ollama ao docker-compose (opcional)          │
│      └─→ Ou usar API externa para prototipar                 │
│                                                              │
│  [4] Criar schema PostgreSQL para ativos digitais           │
│      └─→ Tabela: ativo_digital (id, path, tipo, tamanho,    │
│          data, hash, status, vetor_id)                       │
│                                                              │
│  [5] Migrar dados do SQLite para PostgreSQL                 │
│      └─→ Script de ETL one-time                            │
└─────────────────────────────────────────────────────────────┘
```

### FASE 3: INTEGRAÇÃO E AUTOMAÇÃO (Semanas 5-6)

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 3: n8n ORQUESTRANDO TUDO                              │
├─────────────────────────────────────────────────────────────┤
│  [1] Criar API REST do scanner (FastAPI)                     │
│      └─→ Endpoints: /scan, /status, /relatorio, /ativos      │
│                                                              │
│  [2] Criar workflow n8n: Scan agendado                        │
│      └─→ Cron: diário/semanal → chama /scan → insere no DB  │
│                                                              │
│  [3] Criar workflow n8n: Relatório por e-mail               │
│      └─→ Após scan → gera relatório → envia SMTP            │
│                                                              │
│  [4] Criar workflow n8n: Deduplicação                       │
│      └─→ Compara hashes → flaga duplicatas → notifica       │
│                                                              │
│  [5] Criar workflow n8n: Insights com IA                    │
│      └─→ Chama Ollama/API → analisa metadados → sugere      │
│          produtos baseados no acervo                         │
└─────────────────────────────────────────────────────────────┘
```

### FASE 4: ESCALA E MONETIZAÇÃO (Semanas 7-8+)

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 4: PRODUTO E RECEITA                                  │
├─────────────────────────────────────────────────────────────┤
│  [1] Criar planos de assinatura (Gumroad / HeroSpark)       │
│      └─→ Freemium: scan básico gratuito                     │
│      └─→ Pro: deduplicação, insights IA, relatórios avançados│
│                                                              │
│  [2] Criar frontend básico (painel do usuário)              │
│      └─→ React/Next.js ou Hugo com JS dinâmico               │
│                                                              │
│  [3] Implementar gamificação (RPG / missões)                │
│      └─→ Sistema de XP para engajar usuários neurodivergentes│
│                                                              │
│  [4] Lançar curso prático (8 semanas)                      │
│      └─→ Cada módulo gera um ativo monetizável              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. CHECKLIST DE AÇÃO IMEDIATA (Próximas 48h)

- [ ] **Executar query SQLite** para confirmar estado real do banco
- [ ] **Atualizar `eddy_config.json`** com exclusões de diretórios do sistema
- [ ] **Remover `G:\`** do array de targets (drive não existe)
- [ ] **Rodar `observe` novamente** para scan limpo
- [ ] **Rodar `identify`** para reclassificar status dos arquivos
- [ ] **Verificar se DRY_RUN=True** antes de qualquer `plan`/`execute`
- [ ] **Criar script Python** que gera relatório HTML/PDF a partir do `eddy.db`
- [ ] **Publicar landing page** (pode ser no GitHub Pages ou Replit)
- [ ] **Configurar formulário** para capturar primeiros leads
- [ ] **Corrigir versão Redis** no docker-compose (7-alpine, não 8-alpine)
- [ ] **Adicionar Qdrant** ao docker-compose.yml
- [ ] **Documentar schema do banco** (tabelas, colunas, índices)

---

## 9. DEPENDÊNCIAS CRÍTICAS

```
FASE 0 (Estabilizar)  ──────────────────────────────────────┐
    │                                                     │
    ▼                                                     │
[eddy_config.json corrigido] ──→ [Scan limpo] ──→ [Identify] │
    │                                                     │
    ▼                                                     │
FASE 1 (Diagnostic)  ───────────────────────────────────────┤
    │                                                     │
    ▼                                                     │
[Relatório HTML/PDF] ──→ [Landing page] ──→ [Leads]       │
    │                                                     │
    ▼                                                     │
FASE 2 (Infra)  ──────────────────────────────────────────┤
    │                                                     │
    ▼                                                     │
[Docker Compose] ──→ [PostgreSQL schema] ──→ [ETL SQLite→PG]│
    │                                                     │
    ▼                                                     │
FASE 3 (Automação)  ────────────────────────────────────────┤
    │                                                     │
    ▼                                                     │
[FastAPI scanner] ──→ [n8n workflows] ──→ [Ollama insights]│
    │                                                     │
    ▼                                                     │
FASE 4 (Monetização)  ──────────────────────────────────────┘
```

---

## 10. RECOMENDAÇÕES ESTRATÉGICAS

### 10.1 Sobre o Foco
**Recomendação:** Congele tudo que não seja FASE 0 e FASE 1 pelas próximas 2 semanas. O scanner já funciona. O banco já tem quase meio milhão de arquivos. O valor imediato está em **mostrar esse valor ao usuário**, não em construir mais infraestrutura.

### 10.2 Sobre a Stack
**Recomendação:** Mantenha SQLite para o scanner local (é mais rápido para arquivo único, não precisa de servidor). Use PostgreSQL **apenas** para o n8n e para a camada web. Não migre o scanner para PostgreSQL ainda — isso é otimização prematura.

### 10.3 Sobre o n8n
**Recomendação:** O n8n é a escolha correta, mas **não suba o Queue Mode ainda**. Comece com o n8n em modo standalone. O Queue Mode só faz sentido quando você tiver múltiplos workflows pesados rodando simultaneamente. Adicionar Redis + workers agora é complexidade desnecessária.

### 10.4 Sobre a IA
**Recomendação:** Não integre Ollama no MVP. Use a API do scanner + n8n para gerar relatórios estatísticos simples ("Você tem 2.300 PDFs, 52.000 imagens..."). A IA semântica (embeddings, RAG) é V3/V4. Tentar fazer isso agora é o risco #1: escopo excessivo.

### 10.5 Sobre o Curso
**Recomendação:** O curso de 8 semanas é um ativo valioso, mas **não deixe o desenvolvimento do produto depender do curso**. Grave os módulos à medida que constrói o produto ("ensinar enquanto faz"), não o contrário.

---

## 11. GLOSSÁRIO DE TERMOS DO PROJETO

| Termo | Significado |
|-------|-------------|
| **EddY** | Sistema operacional de dados pessoais — o produto principal |
| **NeverLost** | Motor de escaneamento e mapeamento de patrimônio digital |
| **EDS** | Eddy Digital Solutions — veículo corporativo |
| **ESL** | Exclusivity ESL — camada artística e de propriedade intelectual |
| **Observe** | Etapa de mapeamento/scan de arquivos |
| **Identify** | Etapa de classificação e rotulagem de arquivos |
| **Plan** | Etapa de planejamento de ações (cópia, movimentação) |
| **Execute** | Etapa de execução das ações planejadas |
| **DRY_RUN** | Modo simulação — mostra o que faria sem fazer |
| **Factory** | Módulo especializado (Knowledge, Creator, Automation, Business) |
| **RAG** | Retrieval-Augmented Generation — busca semântica + geração de texto |
| **Embedding** | Representação vetorial de texto/imagem para busca semântica |
| **MCP** | Model Context Protocol — protocolo de contexto para LLMs |

---

*Análise gerada em 2026-08-03. Baseada em ~60.000 caracteres de documentação consolidada do projeto EddY.*
