# Aula 09 — Tratamento de erros (try/except)

## Objetivo
Ao final desta aula você consegue:
- Explicar **com suas palavras** o conceito central desta aula
- Rodar o exemplo sem copiar cego
- Criar uma variação simples para um caso seu
- Reconhecer o erro mais comum e sair dele rápido

## Explicação (Papo Reto)

`try/except` evita que o programa morra. Capture o erro específico quando puder. Mostre mensagem clara para o usuário.

## Exemplo guiado

Arquivo desta aula:

```text
codigo/modulo_01_iniciante/aula_09_tratamento_de_erros.py
```

### Como rodar

```bash
# Windows
py codigo/modulo_01_iniciante/aula_09_tratamento_de_erros.py

# Linux / Mac
python3 codigo/modulo_01_iniciante/aula_09_tratamento_de_erros.py
```

1. Abra o arquivo no editor
2. Rode no terminal (a partir da raiz do curso)
3. Responda:
   - O que entra?
   - O que sai?
   - O que muda (memória, tela ou disco)?

## Mundo real

Use esta aula como peça de lego. Sozinha ela resolve um pedaço. Junto com as próximas, vira automação, API ou ferramenta de verdade.

## Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| except genérico demais | Engoliu erro real | Capture exceções específicas |
| Programa ainda quebra | Erro fora do try | Envolva o trecho certo |

## Exercícios

1. Reescreva o exemplo com nomes e valores seus (sem olhar).
2. Quebre o código de propósito e explique a mensagem de erro.
3. Crie uma variação mínima para um problema real do seu dia.
4. Escreva 5 linhas resumindo o que aprendeu.

## Checklist de domínio

- [ ] Explico o conceito sem olhar a aula
- [ ] Rodo o exemplo do zero
- [ ] Crio uma variação minha
- [ ] Sei qual erro eu mais cometo e como evitar
