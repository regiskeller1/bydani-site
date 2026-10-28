# Registro de publicações

Uma entrada por publicação, no mesmo dia: data, o que subiu (commit), onde (URL/ambiente), quem
autorizou e como voltar. Mais recente no topo.

## Como publicar a prévia no GitHub Pages

Só com o OK do usuário para aquela publicação (ver
[publicacao-seguranca.md](conhecimento/publicacao-seguranca.md)). No Git Bash, da raiz do repo:

```sh
MSYS_NO_PATHCONV=1 SITE_URL=https://regiskeller1.github.io BASE_PATH=/bydani-site/ npx astro build
R=https://github.com/regiskeller1/bydani-site.git; C=$(git rev-parse --short HEAD); T=$(mktemp -d)
# a gh-pages guarda só o build; clona para empilhar commit novo (nada de push --force)
git clone -q --depth 1 --branch gh-pages "$R" "$T" || git init -q -b gh-pages "$T"
git -C "$T" rm -r -q --ignore-unmatch -- _astro      # tira os arquivos com hash antigo
cp -r dist/. "$T" && touch "$T/.nojekyll"             # .nojekyll: senão o Pages esconde _astro/
git -C "$T" add -- .nojekyll _astro favicon.svg index.html robots.txt sitemap-0.xml sitemap-index.xml
git -C "$T" commit -qm "deploy: main $C"
SITE_OK=publicar git -C "$T" push "$R" gh-pages
```

Arquivo novo na raiz de `public/` ou rota nova em `src/pages/`: acrescente na linha do `add`.

**Como voltar:** refazer o build a partir do commit anterior do `main` (`git checkout <commit>`) e
enviar de novo; ou despublicar em Settings → Pages do repositório.

## Publicações

- **28/out/2026**: prévia para a designer aprovar. `main` f274cf1 → branch `gh-pages`, em
  https://regiskeller1.github.io/bydani-site/ (repo público `regiskeller1/bydani-site`). Autorizado
  pelo usuário ("sobe no github pages pra eu mandar pra ela"). Antes: build limpo, `revisar-pagina`
  ok, Lighthouse mobile 95/100/100/100. Conteúdo ainda **não aprovado** pela designer. Conferido
  depois: página, CSS, favicon e sitemap respondem 200; visual igual à prévia local.
  Voltar: Settings → Pages → despublicar, ou enviar build de commit anterior.
