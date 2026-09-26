# Aula 23 — SQLite: banco de dados embutido no Python

## Objetivo
Ao final desta aula você consegue:
- Explicar o que é um banco relacional e por que SQLite é perfeito para começar
- Criar tabelas, inserir, consultar, atualizar e apagar dados
- Usar `sqlite3` (já vem no Python — zero instalação)
- Entender `row_factory` para acessar colunas por nome
- Ligar isso ao Projeto Final (clientes e produtos)

## Explicação (Papo Reto)

CSV é ótimo para troca de dados.  
Banco de dados é ótimo para **consultar, filtrar e manter estado** com segurança.

**SQLite** = banco de dados em um único arquivo (`.db`).  
Não precisa instalar servidor. Não precisa de usuário/senha no começo. Ideal para:
- protótipos
- ferramentas desktop (ex.: NeverLost)
- APIs pequenas
- aprendizado de SQL real

### SQL mínimo que você precisa

```sql
CREATE TABLE ...
INSERT INTO ...
SELECT ... FROM ... WHERE ...
UPDATE ... SET ... WHERE ...
DELETE FROM ... WHERE ...
```

### Padrão seguro no Python

```python
conn = sqlite3.connect("loja.db")
conn.row_factory = sqlite3.Row  # permite row["nome"]
cur = conn.cursor()
cur.execute("SELECT * FROM clientes WHERE id = ?", (cliente_id,))  # SEMPRE use ? (evita SQL injection)
rows = cur.fetchall()
conn.commit()
conn.close()
```

Nunca monte SQL com f-string juntando input do usuário. Use `?` e tupla de parâmetros.

## Exemplo guiado

Arquivo desta aula:

```text
codigo/modulo_03_avancado/aula_23_sqlite.py
```

### Como rodar

```bash
# Windows
py codigo/modulo_03_avancado/aula_23_sqlite.py

# Linux / Mac
python3 codigo/modulo_03_avancado/aula_23_sqlite.py
```

O exemplo:
1. Cria o arquivo `loja_eds.db`
2. Cria tabelas
3. Insere dados
4. Consulta com filtro
5. Mostra como ler por nome de coluna

## Mundo real

- Backend do Projeto Final (clientes + produtos)
- Histórico de runs do NeverLost (banco incremental)
- Cache local de uma automação
- Qualquer ferramenta que precisa “lembrar” de dados entre execuções

Regra prática:
- CSV → entrada/saída e relatórios
- SQLite → estado interno do sistema

## Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `OperationalError: no such table` | Esqueceu de criar a tabela | Rode o `CREATE TABLE` antes |
| Dados não aparecem | Esqueceu `conn.commit()` | Sempre faça commit após escrita |
| SQL injection | Concatenou string no SQL | Use `?` + parâmetros |
| Arquivo travado | Conexão aberta em outro lugar | Feche a conexão / use `with` |
| Tipo errado na coluna | SQLite é flexível, mas não milagroso | Valide no Python antes de gravar |

## Exercícios

1. Crie uma tabela `pedidos` com `id`, `cliente_id`, `total`, `criado_em`.
2. Insira 3 pedidos e liste apenas os pedidos com `total > 100`.
3. Atualize o estoque de um produto depois de uma “venda”.
4. (Desafio) Faça uma função `buscar_cliente_por_email(email)` que retorna `None` se não existir.
5. (Desafio) Exporte o resultado de um `SELECT` para CSV (juntando Aula 12 + Aula 23).

## Checklist de domínio

- [ ] Explico SQLite vs CSV
- [ ] Crio tabela e faço CRUD básico
- [ ] Uso `?` para parâmetros
- [ ] Uso `row_factory = sqlite3.Row`
- [ ] Consigo enxergar o SQLite como base do Projeto Final
