# Aula 25 — FastAPI: crie uma API de verdade em minutos

## Objetivo
Ao final desta aula você consegue:
- Explicar o que é uma API REST e por que FastAPI é uma das melhores portas de entrada
- Subir uma API local com rotas `GET` e `POST`
- Usar Pydantic para validar entrada automaticamente
- Abrir a documentação interativa em `/docs`
- Entender o caminho até o Projeto Final (CRUD real com SQLite)

## Explicação (Papo Reto)

Até agora seu código rodava e terminava.  
Com FastAPI, seu código **fica esperando pedidos** (como um garçom).

### Peças centrais

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="EDS API")

class ProdutoIn(BaseModel):
    nome: str
    preco: float

@app.get("/ping")
def ping():
    return {"ok": True}

@app.post("/produtos")
def criar(produto: ProdutoIn):
    return {"criado": True, "produto": produto}
```

### Como rodar

```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```

Abra no navegador:

```text
http://127.0.0.1:8000/docs
```

Isso é ouro: documentação automática + botão de testar.

### Por que FastAPI?
- Validação automática (Pydantic)
- Docs automáticas (Swagger)
- Rápido
- Tipagem Python vira contrato da API
- Perfeito para backend de produto digital, automação e integrações

## Exemplo guiado

Arquivo desta aula:

```text
codigo/modulo_03_avancado/aula_25_fastapi.py
```

### Como rodar o exemplo da aula

O arquivo da aula **mostra** o código completo da API (impresso no terminal) e explica como salvar/rodar.

Fluxo recomendado:
1. Rode o arquivo da aula para ver a explicação
2. Copie o bloco da API para um `main.py`
3. Suba com `uvicorn main:app --reload`
4. Teste em `/docs`

```bash
# Windows
py codigo/modulo_03_avancado/aula_25_fastapi.py

# Linux / Mac
python3 codigo/modulo_03_avancado/aula_25_fastapi.py
```

## Mundo real

- Backend do seu SaaS / micro-SaaS
- API para o frontend (HTML/JS, React, etc.)
- Webhook receiver (Stripe, WhatsApp, Hotmart)
- Serviço interno que outros scripts consomem com `requests` (Aula 22)

No ecossistema EDS:
- NeverLost pode expor status via API no futuro
- Curso + projetos ensinam o mesmo padrão usado em produto real

## Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `ModuleNotFoundError` | Não instalou | `pip install fastapi uvicorn` |
| Porta em uso | Já tem algo no 8000 | Troque a porta ou mate o processo |
| Validação 422 | Body não bate com o modelo | Olhe o detalhe do erro no `/docs` |
| `Address already in use` | `--reload` duplicado | Feche o terminal antigo |
| Achar que precisa de frontend | Não precisa | `/docs` já testa tudo |

## Exercícios

1. Suba a API de exemplo e crie 2 produtos pelo `/docs`.
2. Adicione a rota `GET /produtos/{id}`.
3. Adicione validação: `preco` deve ser `> 0`.
4. (Desafio) Troque a lista em memória por SQLite (juntar Aula 23 + 25).
5. (Desafio) Do outro terminal, consuma sua própria API com `requests` (Aula 22).

## Checklist de domínio

- [ ] Explico o que é rota, método e validação
- [ ] Subo uma API local com FastAPI
- [ ] Uso `/docs` para testar
- [ ] Sei a diferença entre modelo de entrada e resposta
- [ ] Enxergo o Projeto Final como evolução natural desta aula
