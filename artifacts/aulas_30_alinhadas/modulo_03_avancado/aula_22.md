# Aula 22 — HTTP e requests: seu programa conversando com a internet

## Objetivo
Ao final desta aula você consegue:
- Explicar o que é uma requisição HTTP (método, URL, status, corpo)
- Fazer `GET` e `POST` com a biblioteca `requests`
- Ler JSON de uma API
- Tratar erros de rede e status HTTP (404, 500, timeout)
- Entender quando usar requests no mundo real (integrações, scrapers simples, automações)

## Explicação (Papo Reto)

HTTP é o protocolo da web. Seu navegador faz HTTP o tempo todo. Agora o **seu código** também vai fazer.

### Peças que importam

- **URL**: endereço do recurso (`https://api.exemplo.com/produtos`)
- **Método**:
  - `GET` → buscar
  - `POST` → criar / enviar
  - `PUT` / `PATCH` → atualizar
  - `DELETE` → apagar
- **Status code**:
  - `200` ok
  - `201` criado
  - `400` erro do cliente
  - `404` não encontrado
  - `500` erro do servidor
- **Headers**: metadados (tipo de conteúdo, autenticação)
- **Body**: o conteúdo (geralmente JSON)

### Por que `requests`?
A biblioteca padrão (`urllib`) funciona, mas é verbosa. `requests` deixa o código legível:

```python
r = requests.get("https://api.github.com")
print(r.status_code)
print(r.json())
```

Instalação:

```bash
pip install requests
```

## Exemplo guiado

Arquivo desta aula:

```text
codigo/modulo_03_avancado/aula_22_requests_http.py
```

### Como rodar

```bash
# Windows
py codigo/modulo_03_avancado/aula_22_requests_http.py

# Linux / Mac
python3 codigo/modulo_03_avancado/aula_22_requests_http.py
```

O exemplo:
1. Explica os conceitos HTTP
2. Tenta um `GET` real (se `requests` estiver instalado)
3. Mostra como ler JSON
4. Mostra o padrão de tratamento de erro

Se `requests` não estiver instalado, o script ainda roda e mostra os conceitos — não trava.

## Mundo real

- Buscar cotação, clima, CEP, dados públicos
- Integrar com APIs de pagamento, CRM, WhatsApp, OpenAI
- Enviar dados do seu sistema para outro sistema
- Testar a API que **você** vai criar na Aula 25 (FastAPI)

Fluxo típico de produto digital:
1. Você expõe uma API (FastAPI)
2. Outro sistema (ou seu próprio frontend) consome com `requests`

## Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `ModuleNotFoundError: requests` | Não instalou | `pip install requests` (dentro do venv) |
| `Timeout` / demora infinita | Rede lenta ou API travada | Use `timeout=10` |
| `JSONDecodeError` | Resposta não é JSON | Confira `r.headers` e `r.text` |
| Achar que `200` é o único sucesso | POST pode retornar `201` | Aceite faixa 200–299 |
| Expor token no código | Segurança | Use variável de ambiente |

## Exercícios

1. Faça um `GET` em `https://httpbin.org/get` e imprima o JSON.
2. Faça um `POST` em `https://httpbin.org/post` enviando `{"curso": "Python Papo Reto", "autor": "EDS"}`.
3. Trate o caso de URL inválida com `try/except` e mensagem clara.
4. (Desafio) Monte uma função `buscar_cep(cep: str) -> dict` usando uma API pública de CEP e retorne bairro e cidade.
5. (Desafio) Adicione `timeout` e retry simples (tentar de novo 1 vez se falhar).

## Checklist de domínio

- [ ] Explico GET vs POST e status code sem olhar a aula
- [ ] Instalo e uso `requests` corretamente
- [ ] Leio JSON de uma resposta
- [ ] Trato timeout e erro de rede
- [ ] Sei que essa aula prepara o terreno para consumir a API da Aula 25
