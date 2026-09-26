# Aula 12 — Arquivos CSV: ler, escrever e transformar dados tabulares

## Objetivo
Ao final desta aula você consegue:
- Explicar o que é um CSV e por que ele é a ponte entre Excel/planilhas e Python
- Escrever um CSV do zero
- Ler um CSV e transformar os dados (filtrar, calcular, agregar)
- Usar `csv.DictReader` / `csv.DictWriter` (forma correta no mundo real)
- Lidar com encoding e delimitador (`,` vs `;` no Brasil)

## Explicação (Papo Reto)

CSV = **Comma-Separated Values**. É só texto. Cada linha é um registro. Cada coluna é separada por vírgula (ou ponto e vírgula).

Por que importa?
- Excel, Google Sheets, sistemas de empresa, bancos exportam CSV
- É o formato mais simples para trocar dados tabulares
- Python lê e escreve CSV sem instalar nada (`import csv`)

### As duas formas de trabalhar

1. **`csv.writer` / `csv.reader`** → trabalha com listas  
2. **`csv.DictWriter` / `csv.DictReader`** → trabalha com dicionários (recomendado)

No mundo real a gente prefere **DictReader**: você acessa pelo nome da coluna (`linha["produto"]`), não pela posição. Se a planilha mudar a ordem das colunas, seu código não quebra.

### Cuidados reais
- **Encoding**: no Brasil use `encoding="utf-8"`. Arquivos antigos do Excel às vezes vêm em `latin-1` ou `cp1252`.
- **Delimitador**: Excel BR muitas vezes usa `;` em vez de `,`.
- **`newline=""`**: ao escrever, passe isso no `open()` para evitar linhas em branco extras no Windows.
- **Nunca assuma que o arquivo existe**: trate `FileNotFoundError`.

## Exemplo guiado

Arquivo desta aula:

```text
codigo/modulo_02_intermediario/aula_12_arquivos_csv.py
```

Também use o arquivo de treino:

```text
arquivos_de_treino/aula_csv/vendas_eds.csv
```

### Como rodar

```bash
# Windows
py codigo/modulo_02_intermediario/aula_12_arquivos_csv.py

# Linux / Mac
python3 codigo/modulo_02_intermediario/aula_12_arquivos_csv.py
```

O que o exemplo faz:
1. Escreve um CSV de vendas
2. Lê o CSV e imprime
3. Calcula faturamento (quantidade × preço)
4. Mostra CSV com delimitador `;` (padrão Brasil)

Responda para si:
- O que entra?
- O que sai?
- O que muda no disco?

## Mundo real

- Limpar export de sistema e mandar para o Power BI / Excel
- Gerar relatório de vendas do dia
- Separar leads por cidade / categoria
- Alimentar o Projeto Final (produtos e clientes)

## Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `FileNotFoundError` | Caminho errado ou rodou fora da pasta | Use `Path` e confira `Path.cwd()` |
| Linhas em branco no CSV | Esqueceu `newline=""` no Windows | `open(..., newline="")` |
| Acentos quebrados | Encoding errado | Force `encoding="utf-8"` |
| Coluna não encontrada | Usou posição em vez de nome | Prefira `DictReader` |
| Número virou texto | Tudo que vem do CSV é `str` | Faça `float()` / `int()` com tratamento |

## Exercícios

1. Leia `arquivos_de_treino/aula_csv/vendas_eds.csv` e imprima só os produtos da categoria **Tecnologia**.
2. Calcule o preço médio por categoria e grave um novo CSV `media_por_categoria.csv`.
3. Crie um CSV de “estoque baixo”: produtos com `quantidade < 25`.
4. Quebre de propósito: abra um arquivo que não existe e trate o erro com mensagem clara.
5. (Desafio) Converta o CSV de `;` para `,` e vice-versa.

## Checklist de domínio

- [ ] Explico CSV sem olhar a aula
- [ ] Escrevo e leio CSV com `DictWriter` / `DictReader`
- [ ] Sei a diferença entre `,` e `;`
- [ ] Trato encoding e arquivo inexistente
- [ ] Consigo filtrar e agregar dados de um CSV real
