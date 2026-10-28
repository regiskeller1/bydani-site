---
name: revisar-pagina
description: "Revisar uma ou mais páginas do site antes de mostrar à designer ou publicar: acessibilidade, peso das imagens, SEO, links, responsivo (360/768/1280 px), tokens de design e textos [PROVISÓRIO]. Use quando o usuário pedir para revisar, conferir ou preparar uma página para publicar. Só lê e mede; para corrigir, edite normalmente."
---
# Revisar página

Só leitura e medição local. Não publica (publicar é pedido separado, `SITE_OK=publicar`).

## 1. Preparar

- Build limpo e servidor local da stack (ver `decisoes-codigo.md`). Stack ainda não definida: pare e
  pergunte ao usuário.
- Quais páginas? Sem dizer, as alteradas desde o último commit (`git status --short`, `git diff --stat`).

## 2. Conferir

1. **Acessibilidade**: uma `h1`; hierarquia de títulos sem pulo; `alt` descritivo em toda imagem
   com sentido (decorativa = `alt=""`); contraste AA do texto sobre o fundo; foco visível; dá para
   navegar tudo só com teclado; botão/link com nome claro (nada de "clique aqui").
2. **Peso**: imagem em WebP/AVIF com tamanhos responsivos e `width`/`height` (evita salto de
   layout); nada acima de ~300 KB sem motivo; imagem fora da primeira dobra com `loading="lazy"`;
   fontes com subset e `font-display: swap`.
3. **SEO**: `title` (até ~60 caracteres) e `description` (até ~155) únicos por página; Open Graph
   com imagem; `lang="pt-BR"`; canonical; `sitemap` e `robots` presentes.
4. **Links**: internos e externos respondem; `target="_blank"` com `rel="noopener noreferrer"`;
   e-mail/WhatsApp com formato certo.
5. **Responsivo**: 360, 768 e 1280 px sem rolagem horizontal, texto legível, alvo de toque ≥ 44 px.
6. **Design**: cor, fonte e espaço vêm dos tokens (`decisoes-design.md`); nenhum valor solto.
7. **Conteúdo**: nenhum `[PROVISÓRIO]`, "lorem ipsum" ou TODO em página que vai à designer/ao ar.
8. **Segredo e dado**: nada de chave no código do front; formulário sem log de dado do visitante.

Medir quando der: Lighthouse no mobile (meta ≥ 90 nas quatro categorias).

## 3. Devolver

Lista por gravidade (bloqueia publicar / corrigir logo / melhoria), cada item com `arquivo:linha`
ou URL local, o que se viu e a sugestão. Achado sem prova vai como "não confirmado". Decisão de
design (cor, layout) vira pergunta, não correção.
