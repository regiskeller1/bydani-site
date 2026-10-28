# Decisões: design (identidade visual, tokens, imagens, tom)

Injetado ao tocar `assets/`, `design/`, estilos e tokens. Quem é a designer e o público:
[briefing.md](briefing.md).

## Identidade

- **Paleta e tipografia tiradas das artes dela** (5 últimos posts, bio.site e proposta comercial 2026), a
  pedido do usuário; tokens únicos em `src/styles/tokens.css`. A designer ainda não aprovou (28/out/2026)
- **Paleta**: magenta `#ef0066`, vinho `#2e0716`, creme `#fff1cd`, lima `#e0e385`, laranja `#ff6738`,
  rosa-claro `#f291c5`, lavanda `#c7c9f7`. Creme/lima sobre magenta só em texto grande (contraste 3,8) (28/out/2026)
- **Fontes** (equivalentes livres das dela): Anton (títulos condensados), Fraunces SOFT 900 (serifa
  "fofa" e itálico), Outfit (texto). Self-host via Fontsource, sem Google Fonts (28/out/2026)
- **Elementos**: estrela de 5 pontas, rabiscos grossos, borda de renda, xadrez, fita adesiva, etiqueta
  recortada (ticket), cartão vinho com título vazando, granulado e borda "felpuda" (filtro SVG `#fuzzy`) (28/out/2026)
- **Logo**: recorte do banner do bio.site (`src/assets/logo-bydani.png`, 330 px, raster). Pedir à
  designer o arquivo vetorial (SVG/PDF) para trocar (28/out/2026)
- **Site de uma página, direcional** (WhatsApp, e-mail, Instagram), animado; não é a vitrine de
  portfólio prevista antes. Movimento respeita `prefers-reduced-motion` (28/out/2026)

## Imagens

- **Originais pesados ficam em `assets/originais/` (fora do git)**; o site usa as versões
  otimizadas (WebP/AVIF, tamanhos responsivos) (28/out/2026)
- **Toda imagem de projeto tem `alt` descritivo** (o que mostra, não "imagem do projeto") (28/out/2026)

## Texto

- **Tom e idioma: português do Brasil; tom a confirmar no briefing.** Texto provisório leva
  `[PROVISÓRIO]` até a designer aprovar (28/out/2026)
