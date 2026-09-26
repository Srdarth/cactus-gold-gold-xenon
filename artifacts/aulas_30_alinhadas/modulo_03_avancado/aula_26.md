# Aula 26 — Automação: arquivos, pastas e processos

## Objetivo
Ao final desta aula você consegue:
- Automatizar tarefas chatas de arquivos e pastas com `pathlib` + `shutil`
- Listar, filtrar, mover e organizar arquivos em lote
- Rodar comandos do sistema com `subprocess` (com cuidado)
- Montar um mini “robô” de organização (base do Projeto 2)
- Enxergar automação como produto (não só exercício)

## Explicação (Papo Reto)

Automação = você descreve a regra uma vez e o computador repete 1.000 vezes sem reclamar.

### Ferramentas certas

| Biblioteca | Para quê |
|------------|----------|
| `pathlib` | Caminhos modernos, legíveis, multiplataforma |
| `shutil` | Copiar, mover, apagar pastas |
| `subprocess` | Chamar programas externos (com cuidado) |
| `csv` / `json` | Entrada e saída de dados |

### Regra de ouro da automação

1. **Dry-run primeiro** (simular sem alterar)
2. Só depois aplicar de verdade
3. Nunca testar na pasta mais importante do seu HD

Isso evita desastre.

## Exemplo guiado

Arquivo desta aula:

```text
codigo/modulo_03_avancado/aula_26_automacao.py
```

Arquivos de treino úteis:

```text
arquivos_de_treino/aula_renomeador/pasta_teste/
arquivos_de_treino/aula_organizador/
```

### Como rodar

```bash
# Windows
py codigo/modulo_03_avancado/aula_26_automacao.py

# Linux / Mac
python3 codigo/modulo_03_avancado/aula_26_automacao.py
```

O exemplo mostra:
- listagem de arquivos
- filtros por extensão
- organização por tipo
- detecção simples de possíveis duplicatas por tamanho
- uso seguro de `subprocess`

## Mundo real

- Organizar Downloads automaticamente
- Renomear lotes de fotos / notas fiscais / prints
- Gerar pastas de projeto padrão
- Preparar arquivos para upload em lote
- Base de produtos como NeverLost (mapa do caos → organização)

No ecossistema EDS:
- O mesmo raciocínio do NeverLost começa aqui
- O Projeto 2 (Organizador) é a versão guiada desta aula

## Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| Apagou/moveu o que não devia | Testou em pasta errada | Sempre dry-run + pasta de teste |
| `PermissionError` | Arquivo aberto ou sem permissão | Feche o arquivo / rode com cuidado |
| Caminho quebrado no Windows | Misturou `/` e `\` na mão | Use `pathlib.Path` |
| `subprocess` travou | Comando interativo | Evite; use flags não-interativas |
| Sobrescreveu arquivo | Não checou `exists()` | Gere nome alternativo (`_copia`) |

## Exercícios

1. Liste todos os `.py` da pasta do curso e some o tamanho total.
2. Crie um organizador que separa `imagens/`, `documentos/`, `outros/` a partir de uma pasta de teste.
3. Faça versão **dry-run**: só imprime o que faria, sem mover.
4. (Desafio) Renomeie arquivos com espaços e caracteres estranhos para um padrão `arquivo_001.ext`.
5. (Desafio) Gere um relatório CSV do que foi movido (nome antigo → nome novo → pasta).

## Checklist de domínio

- [ ] Uso `Path` com confiança
- [ ] Sei a diferença entre simular e aplicar
- [ ] Consigo organizar uma pasta por extensão
- [ ] Entendo o risco de automação destrutiva
- [ ] Ligo esta aula ao Projeto 2 e ao NeverLost
