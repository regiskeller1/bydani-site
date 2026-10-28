# Decisões: código (stack, estrutura, formulário, SEO, performance)

Injetado ao tocar `src/`, `components/`, `pages/`, `package.json` e arquivos de página.

## Stack

- **Astro 7, estático, CSS puro com tokens** (escolha do usuário): otimiza imagem (AVIF/WebP) e gera
  sitemap; cresce fácil se vier portfólio. Pacotes: `@astrojs/sitemap` e Fontsource (fontes locais) (28/out/2026)
- **Hospedagem: A DEFINIR.** `site` no `astro.config.mjs` e `public/robots.txt` assumem
  `https://bydani.com.br` (domínio do e-mail dela); confirmar antes de publicar (28/out/2026)
- **Imagens-fonte do site ficam em `src/assets/`** (o Astro só otimiza o que é importado de `src/`);
  originais pesados seguem em `assets/originais/`, fora do git (28/out/2026)
- **Conteúdo e contatos num lugar só**: `src/data/site.ts` (texto copiado do bio.site dela) (28/out/2026)
- **Animação de entrada**: `[data-reveal]` + IntersectionObserver; sem JS tudo aparece. Captura
  headless dentro de iframe pega a animação no meio: use `--force-prefers-reduced-motion` (28/out/2026)
- **`package.json` sem `"type": "module"`**: os hooks (`.claude/hooks/*.js`, `.githooks/*.js`) são
  CommonJS e quebram com ele (o guarda inclusive). Config do Astro fica em `.mjs` (28/out/2026)
- **Sem dependência por conveniência**: cada pacote novo tem motivo dito no commit (28/out/2026)

## Páginas e funções

- **Uma página só por ora** (`src/pages/index.astro`): apresentação + contatos + botão fixo de
  WhatsApp. Portfólio, sobre etc. ficam para depois, se pedirem (28/out/2026)
- **Formulário de contato**: serviço e destino do e-mail A DEFINIR; chave no `.env`, proteção
  contra spam (honeypot ou captcha leve); dado do visitante não é registrado em log (28/out/2026)

## Qualidade

- **Metas**: Lighthouse ≥ 90 em desempenho, acessibilidade, boas práticas e SEO, no mobile (28/out/2026)
- **Antes de publicar**: skill `revisar-pagina` em cada página alterada (28/out/2026)
