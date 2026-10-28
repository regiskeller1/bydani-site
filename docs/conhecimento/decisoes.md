# Decisões deliberadas: não "corrigir" achando que é bug

Carregado em toda sessão (importado pelo CLAUDE.md). Parece bug? Foi escolhido assim; reabrir
exige pedido do usuário. Uma linha por decisão, com a data.

## Onde está cada decisão

As linhas de cada domínio moram no arquivo dele. O hook `rotear.js` injeta o arquivo sozinho na
primeira vez que a sessão toca um termo da coluna do meio. Assunto sem termo tocado (plano,
discussão): **abra o arquivo** antes de decidir.

| Arquivo | Carrega sozinho ao tocar | Assuntos |
|---|---|---|
| [decisoes-design.md](decisoes-design.md) | `assets/`, `design/`, `styles/`, `tokens`, `.css`, `.scss`, `tailwind`, `fonts/` | identidade visual, tokens, tipografia, imagens, tom dos textos |
| [decisoes-codigo.md](decisoes-codigo.md) | `src/`, `components/`, `pages/`, `app/`, `package.json`, `.tsx`, `.jsx`, `.astro`, `.html` | stack, estrutura, formulário, SEO, performance |
| [publicacao-seguranca.md](publicacao-seguranca.md) | `deploy`, `vercel`, `netlify`, `wrangler`, `firebase`, `dominio`, `SITE_OK`, `.env` | publicar, hospedagem, domínio, segredos |

Decisão nova: **uma linha** no arquivo do domínio. Domínio novo: arquivo novo, linha nesta tabela
e em `DOMINIOS` do `.claude/hooks/rotear.js`. Arquivo acima de ~8 KB não cabe na injeção: divida.

## Valem para todo domínio

- **Publicar só com o usuário autorizando a ação**; o guarda impõe com `SITE_OK=publicar` (28/out/2026) → [publicacao-seguranca.md](publicacao-seguranca.md)
- **Conteúdo é da designer**: texto e imagem não são inventados; provisório leva `[PROVISÓRIO]` (28/out/2026)
- **Segredo mora só no `.env`**; `.env.example` lista as variáveis sem valor (28/out/2026)
- **Stack e hospedagem não foram escolhidas**: perguntar ao usuário antes de assumir (28/out/2026)
- **Público dos docs: o usuário (dev) e, depois, quem mantiver o site.** Doc diz o porquê, não só o quê (28/out/2026)
