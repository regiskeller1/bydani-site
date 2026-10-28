# Projeto Site da Designer: regras

Valem para **todo chat**, sem o usuário pedir. Estamos criando o site (portfólio e contato) de uma
designer. Quem cuida do código é o usuário; a designer é a cliente e aprova o visual e os textos.

Regra cabe em uma a três linhas; o detalhe mora no link.

@docs/conhecimento/decisoes.md

## 1. Ao iniciar qualquer tarefa

1. As decisões acima já carregaram. As do domínio (`decisoes-design.md`, `decisoes-codigo.md`) e a
   de publicação o hook `rotear` injeta ao tocar o assunto; plano sem tocar caminho: abra pelo índice.
2. **Ache o conhecimento em [docs/conhecimento/README.md](docs/conhecimento/README.md)** e abra só
   o arquivo da tarefa. Quem é a designer, público e tom: [briefing.md](docs/conhecimento/briefing.md).
3. **Briefing ou stack ainda "A DEFINIR"?** Pergunte ao usuário antes de escolher por conta própria
   (framework, hospedagem, domínio, páginas). Registre a resposta como decisão.

## 2. Publicação: só com o OK do usuário

Detalhe e porquês: [publicacao-seguranca.md](docs/conhecimento/publicacao-seguranca.md).

- **Desenvolver e rodar local é livre** (dev server, build, testes). **Publicar (deploy, upload,
  trocar DNS) exige o OK do usuário para aquela ação**, e só então `SITE_OK=publicar` no comando.
  O guarda (`.claude/hooks/guarda.js`) recusa sem ele; subagente nunca publica.
- **Antes de publicar**: build limpo, `revisar-pagina` passada, prévia (preview) vista pelo usuário.
  Anote em [docs/publicacoes.md](docs/publicacoes.md) no mesmo dia (o quê, onde, como voltar).
- **Conteúdo da designer é dela**: texto, imagem e projeto não são inventados nem trocados sem
  pedido. Texto provisório leva a marca `[PROVISÓRIO]` até ela aprovar.
- **Segredo mora só no `.env`** (chaves de formulário, analytics, e-mail): não se lê, não vai para
  código, config ou doc. Variável nova entra no `.env.example` sem valor.
- **Dado de visitante** (envios do formulário de contato) é pessoal: não vai para log, doc ou chat.

## 3. Qualidade do site

- **Responsivo primeiro no celular**; confira 360, 768 e 1280 px.
- **Acessibilidade**: contraste AA, `alt` em toda imagem com sentido, foco visível, navegação por
  teclado, uma `h1` por página.
- **Peso**: imagem otimizada (WebP/AVIF, tamanhos responsivos), nada acima de ~300 KB sem motivo;
  originais pesados ficam em `assets/originais/` (fora do git).
- **SEO básico**: `title` e `description` por página, Open Graph, `sitemap`, `robots`.
- Visual segue os tokens de [decisoes-design.md](docs/conhecimento/decisoes-design.md): cor,
  fonte e espaço saem de variável, nunca valor solto no componente.

## 4. Convenções

- Mensagens, comentários e docs em **português**; identificadores (código, classes, arquivos) em
  inglês. Textos do site em português do Brasil, com acentuação correta.
- Formatação do código: a que o linter/prettier do projeto definir (registrar em `decisoes-codigo.md`
  quando a stack existir). Comentários curtos, em minúsculo, só onde o porquê não é óbvio.
- Mudou o visual ou o comportamento: atualize o doc do domínio. Aprendeu algo não óbvio: uma linha
  em `decisoes-<domínio>.md` com a data.
- **Decisão nova: uma linha** no `decisoes-<domínio>.md` com a data. Doc que o hook injeta
  (`decisoes-*`, `publicacao-seguranca`) acima de ~8 KB se divide (o hook injeta até ~9.500
  caracteres); os outros, acima de ~15 KB.
- **Memória da IA guarda só preferência do usuário e fato desta máquina.** Regra de projeto mora
  no repo; promovida, sai da memória.

## 5. Versionamento (git)

- **Commite ao concluir cada assunto.** Concluído = build passa e `node testes/guarda.test.js`
  (quando mexer em guarda ou hooks). **Push só depois que o repositório remoto existir e o
  usuário confirmar o destino** (privado até a designer liberar).
- **Conventional Commits em português, no imperativo**: `tipo(escopo): descrição` (`feat`, `fix`,
  `docs`, `style`, `chore`, `refactor`; escopo `home`, `portfolio`, `contato`, `design`, `guarda`...).
  Um assunto por commit; a mensagem diz o porquê e o que ainda não foi testado.
- **Commit por caminho** (`git add <arquivo>`, conferindo `git status --short`). Nunca `-A`, `.` nem
  `commit -a` (o guarda recusa). Mensagem multilinha: `git commit -F <arquivo>`.
- **Trava de segredos** (`.githooks/verificar-segredos.js`, ativa com `git config core.hooksPath .githooks`):
  recusa `.env`, `assets/originais/`, arquivo acima de 5 MB e cara de token. Nunca `--no-verify`
  nem `push --force`.
- Autor dos commits: o do `git config` local deste repositório, sem linha de coautoria.

## 6. Subagentes

`revisor` (auditoria só de leitura: acessibilidade, peso, SEO, links, responsivo) e `executor`
(muda arquivo local, entrega o comando de publicação pronto). Busca simples: `Explore`. Nenhum
deles publica.
