# Site da Designer

Site (portfólio e contato) de uma designer. Stack e hospedagem ainda a definir: ver
[docs/conhecimento/briefing.md](docs/conhecimento/briefing.md).

## Primeiros passos

```bash
git config core.hooksPath .githooks   # ativa a trava de segredos do commit (uma vez por clone)
cp .env.example .env                  # quando houver variáveis
```

Abra o Claude Code nesta pasta. O `CLAUDE.md` e os hooks de `.claude/` já aplicam as regras do
projeto (publicar só com OK, segredo só no `.env`, commit por caminho).

## Estrutura

| Caminho | O quê |
|---|---|
| `CLAUDE.md` | regras do projeto, lidas em toda sessão |
| `docs/conhecimento/` | briefing, decisões (design, código) e publicação; índice em `README.md` |
| `docs/publicacoes.md` | registro de cada publicação |
| `.claude/` | hooks (`abertura`, `guarda`, `rotear`), agentes (`revisor`, `executor`), skill `revisar-pagina` |
| `.githooks/` | trava de segredos do commit |
| `assets/originais/` | arquivos de origem da designer (fora do git) |
| `testes/` | `node testes/guarda.test.js` valida o guarda |
