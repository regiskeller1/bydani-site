# Publicação e segurança

Injetado ao tocar comando de deploy, hospedagem, domínio, `SITE_OK` ou `.env`.

## Publicar

- **Desenvolver e rodar local é livre** (dev server, build, testes, prévia local).
- **Publicar exige o OK do usuário para aquela ação**: deploy (`vercel`, `netlify deploy`,
  `wrangler`, `firebase deploy`, `gh-pages`, `npm run deploy`), upload (`scp`, `rsync`, `sftp`) e
  qualquer troca de DNS/domínio. O guarda recusa sem `SITE_OK=publicar` no comando
  (bash: `SITE_OK=publicar <comando>`; PowerShell: `$env:SITE_OK='publicar'; <comando>`).
- **Subagente nunca publica**: entrega o comando pronto e a sessão principal pede o OK.
- **Publicação autorizada vai para `.claude/auditoria-publicacoes.log`** (local, fora do git).

## Checklist antes de publicar

1. Build limpo, sem aviso novo.
2. `revisar-pagina` nas páginas alteradas (acessibilidade, peso, SEO, links, responsivo).
3. Prévia (preview) vista pelo usuário; conteúdo aprovado pela designer, sem `[PROVISÓRIO]`.
4. Dizer ao usuário: o que sobe, para onde e **como voltar** (rollback da hospedagem ou commit anterior).
5. Depois: abrir a URL publicada, conferir, e anotar em [../publicacoes.md](../publicacoes.md).

## Segredos

- **`.env` mora só na máquina** (gitignored); `.env.example` lista as variáveis sem valor. O guarda
  recusa ler o `.env` e gravar valor de chave em arquivo.
- **O que vai para o navegador é público**: variável exposta ao front (`PUBLIC_`, `NEXT_PUBLIC_`)
  nunca é segredo.
- **Dado de visitante** (formulário) é pessoal: fora de log, doc e chat.
- A trava do commit (`.githooks/verificar-segredos.js`) recusa `.env`, `assets/originais/`, arquivo
  acima de 5 MB e cara de token.
