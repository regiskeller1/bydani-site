"""Status line: repo e branch, contexto até a compactação, cache e limite de 5 h.

    otclient vh/feat/x | ctx 120k/200k 60% | cache frio | 5h 41%

- **ctx**: tokens da última resposta contra o ponto de compactação
  (CLAUDE_CODE_AUTO_COMPACT_WINDOW), não contra a janela do modelo: com 1M de janela o
  `used_percentage` pronto mostraria 12% quando já está perto de compactar. Verde até 60%,
  amarelo até 85%, vermelho depois.
- **cache frio**: o prefixo da conversa saiu do cache (pausa longa); a próxima mensagem
  reprocessa o contexto inteiro a preço cheio. Só aparece quando vale avisar.
- **5h**: uso do limite de 5 horas da assinatura, quando o Claude Code informa.

Só aparece no Claude Code de terminal (`claude` no terminal integrado): o painel da extensão
do VS Code não desenha status line (conferido em 20/out/2026).

Lê a branch do `.git/HEAD` direto (sem abrir `git`) para rodar rápido a cada atualização.
Qualquer erro imprime o que já montou: a status line nunca quebra a sessão.
"""
import json
import os
import sys
import time

GREEN, YELLOW, RED, DIM, RESET = '\033[32m', '\033[33m', '\033[31m', '\033[2m', '\033[0m'


def git_branch(path):
    """(nome do repo, branch) subindo do diretório até achar `.git`."""
    path = os.path.abspath(path or '.')
    while True:
        git = os.path.join(path, '.git')
        if os.path.isfile(git):  # worktree/submódulo: "gitdir: <caminho>"
            with open(git, encoding='utf-8') as f:
                line = f.read().strip()
            if line.startswith('gitdir:'):
                git = os.path.join(path, line[7:].strip())
        if os.path.isdir(git):
            with open(os.path.join(git, 'HEAD'), encoding='utf-8') as f:
                head = f.read().strip()
            ref = head[16:] if head.startswith('ref: refs/heads/') else head[:7]
            return os.path.basename(path), ref
        parent = os.path.dirname(path)
        if parent == path:
            return None, None
        path = parent


def color(pct):
    return GREEN if pct < 60 else YELLOW if pct < 85 else RED


def main(parts):
    data = json.loads(sys.stdin.buffer.read().decode('utf-8', errors='replace') or '{}')

    try:
        ws = data.get('workspace') or {}
        repo, branch = git_branch(ws.get('current_dir') or data.get('cwd'))
        if repo:
            parts.append(f'{repo} {branch}')
    except Exception:
        pass

    cw = data.get('context_window') or {}
    usage = cw.get('current_usage') or {}
    used = sum(int(usage.get(k) or 0) for k in
               ('input_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens'))
    limit = int(os.environ.get('CLAUDE_CODE_AUTO_COMPACT_WINDOW') or cw.get('context_window_size') or 200000)
    limit = min(limit, int(cw.get('context_window_size') or limit))
    if used:
        pct = round(used * 100 / limit)
        parts.append(f'{color(pct)}ctx {used // 1000}k/{limit // 1000}k {pct}%{RESET}')
    else:
        parts.append(f'{DIM}ctx --{RESET}')

    cache = data.get('prompt_cache') or {}
    expires = cache.get('expires_at')
    if cache.get('caching_observed') and (not cache.get('warm') or (expires and time.time() > expires)):
        parts.append(f'{YELLOW}cache frio{RESET}')

    five = ((data.get('rate_limits') or {}).get('five_hour') or {}).get('used_percentage')
    if five is not None:
        parts.append(f'{color(five)}5h {round(five)}%{RESET}')


if __name__ == '__main__':
    out = []
    try:
        main(out)
    except Exception:
        pass
    sys.stdout.buffer.write(' | '.join(out).encode('utf-8'))
