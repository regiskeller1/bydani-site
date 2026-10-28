# Conhecimento do projeto: índice

O que o código não conta. Não leia tudo: ache a linha da tarefa e abra só aquele arquivo (e dele,
a seção: `grep -n '^## ' <arquivo>`). [decisoes.md](decisoes.md) é lido em toda sessão.

- [briefing.md](briefing.md): quem é a designer, objetivo, público, tom, páginas, referências, domínio · termos: briefing, A DEFINIR
- [decisoes-design.md](decisoes-design.md): identidade visual, tokens, imagens, tom dos textos · termos: paleta, tipografia, tokens, alt, WebP
- [decisoes-codigo.md](decisoes-codigo.md): stack, páginas, formulário, SEO, metas de performance · termos: framework, Lighthouse, formulário
- [publicacao-seguranca.md](publicacao-seguranca.md): como publicar, checklist, segredos, `SITE_OK` · termos: deploy, rollback, .env, auditoria-publicacoes.log
- [../publicacoes.md](../publicacoes.md): registro de cada publicação (o quê, onde, como voltar)
- Skill: [revisar-pagina](../../.claude/skills/revisar-pagina/SKILL.md) (acessibilidade, peso, SEO, links, responsivo)

## Caminhos

| Caminho | O quê |
|---|---|
| `src/` | código do site (Astro): `pages/`, `components/`, `styles/tokens.css`, `data/site.ts`, `assets/` (imagens-fonte) |
| `assets/` | imagens e fontes usadas pelo site (otimizadas) |
| `assets/originais/` | arquivos pesados de origem da designer (**fora do git**) |
| `.claude/` | hooks, agentes, skills e status line do Claude Code |
| `.githooks/` | trava de segredos do commit |
| `testes/` | testes do guarda |
