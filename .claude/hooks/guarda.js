// PreToolUse (Bash|PowerShell|Read|Edit|Write|NotebookEdit): recusa, ANTES de rodar, o que pode
// publicar o site sem o OK do usuário ou vazar segredo. Regras e porquês:
// docs/conhecimento/publicacao-seguranca.md
//
// 1. publicar (deploy, upload, DNS): passa só com SITE_OK=publicar no comando (o usuário autorizou
//    ESTA ação nesta conversa); subagente nunca publica. Autorizada vai para
//    .claude/auditoria-publicacoes.log
// 2. ler o .env (cat, Get-Content, Read) e gravar valor de chave do .env em arquivo: recusado
// 3. git: add -A / add . / commit -a, --no-verify e push --force: recusados
// 4. rm -rf / Remove-Item -Recurse -Force em assets/originais: recusado (são os únicos originais)
//
// sai 2 com a explicação no stderr para recusar; 0 para deixar passar. erro interno deixa passar.

const fs   = require('fs')
const path = require('path')

const ROOT     = path.resolve(__dirname, '..', '..')
const LOG_FILE = path.join(ROOT, '.claude', 'auditoria-publicacoes.log')
const OK_RE    = /SITE_OK\s*=\s*['"]?([a-z]+)/i

// comandos que publicam ou mexem no domínio (dev server, build e login não entram)
const PUBLICAR = [
    ['vercel (deploy/prod/domínio)',     /\bvercel(?:\.cmd)?\s+(?:deploy|promote|rollback|remove|rm|alias|domains|--prod)\b|\bvercel(?:\.cmd)?\b[^|;&\n]*--prod\b|(?:^|[;&|]\s*)(?:npx\s+)?vercel(?:\.cmd)?\s*($|[|;&])/i],
    ['netlify deploy',                   /\bnetlify(?:\.cmd)?\s+(?:deploy|sites:delete|dns)/i],
    ['wrangler (deploy/publish/pages)',  /\bwrangler(?:\.cmd)?\s+(?:deploy|publish|pages\s+(?:deploy|publish)|delete|rollback)\b/i],
    ['firebase deploy',                  /\bfirebase(?:\.cmd)?\s+(?:deploy|hosting:)/i],
    ['gh-pages / surge',                 /(?:^|[;&|]\s*)(?:npx\s+)?(?:gh-pages|surge)(?:\.cmd)?\b/i],
    ['npm/pnpm/yarn deploy ou publish',  /\b(?:npm|pnpm|yarn|bun)(?:\.cmd)?\s+(?:run\s+)?(?:deploy|publish)\b/i],
    ['upload (scp, rsync, sftp, lftp)',  /(^|[\s;|&(])(?:scp|rsync|sftp|lftp)\b/i],
    ['curl para FTP',                    /\bcurl\b[^|;&\n]*\bftps?:\/\//i],
]

function deny(msg) {
    process.stderr.write(msg + '\n')
    process.exit(2)
}

function envValues() {
    try {
        return fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')
            .map(l => (l.match(/^\s*[A-Za-z_][\w]*\s*=\s*['"]?([^'"\s#]+)/) || [])[1])
            .filter(v => v && v.length >= 12)
    } catch (_) { return [] }
}

function mask(text) {
    return envValues().reduce((t, v) => t.split(v).join('<segredo>'), text)
}

function audit(data, quais, cmd) {
    try {
        const line = [new Date().toISOString(), data.session_id || '-', 'publicar', quais.join(' ; '), mask(cmd).replace(/\s+/g, ' ').slice(0, 400)].join(' | ')
        fs.appendFileSync(LOG_FILE, line + '\n')
    } catch (_) {}
}

// git: commit por caminho, nunca pular a trava de segredos nem reescrever o que foi enviado
function checkGit(cmd) {
    if (!/\bgit\b/.test(cmd)) return null
    if (/\bgit\s+add\s+(?:[^|;&\n]*\s)?(-A|--all|\.)(\s|$)/.test(cmd) || /\bgit\s+commit\b[^|;&\n]*\s-[a-zA-Z]*a/.test(cmd)) {
        return 'Guarda: commit por caminho (git add <arquivo>, conferindo git status --short). "git add -A", "git add ." e "commit -a" levam junto o que não devia (original pesado, segredo). Ver CLAUDE.md §5.'
    }
    if (/--no-verify\b/.test(cmd) && /\bgit\s+(commit|push)\b/.test(cmd)) {
        return 'Guarda: --no-verify pula a trava de segredos (.githooks/verificar-segredos.js). Corrija o que ela apontou; pular só com pedido do usuário, dito na mensagem do commit.'
    }
    if (/\bgit\s+push\b[^|;&\n]*(\s--force(-with-lease)?\b|\s-f\b)/.test(cmd)) {
        return 'Guarda: push --force reescreve o histórico publicado. Faça um commit novo que corrija.'
    }
    return null
}

function readsEnvFile(cmd) {
    return /(^|[\s;|&(])(cat|type|more|less|head|tail|gc|get-content|sed|awk|grep|rg|findstr|select-string|strings|xxd|od|bat|nano|vim?|code|notepad)\b[^|;&\n]*?(^|[\s'"/\\=])\.env(?![\w.])/i.test(cmd)
}

function destroysOriginals(cmd) {
    return /(\brm\s+-[a-z]*[rf][a-z]*|remove-item\b[^|;&\n]*-recurse|\brmdir\b|\bdel\b)[^|;&\n]*assets[\\/]originais/i.test(cmd)
}

// avalia um comando de shell; retorna { recusa?: texto, publica?: [...], autorizado?: bool }
function checkCommand(cmd, data) {
    const git = checkGit(cmd)
    if (git) return { recusa: git }
    if (readsEnvFile(cmd)) {
        return { recusa: 'Guarda: o .env guarda segredos e não se lê pelo terminal. Para saber se uma variável existe: node -e "process.loadEnvFile(\'.env\'); console.log(Boolean(process.env.NOME))". Detalhe: docs/conhecimento/publicacao-seguranca.md#segredos' }
    }
    if (destroysOriginals(cmd)) {
        return { recusa: 'Guarda: assets/originais/ guarda os únicos arquivos de origem da designer (fora do git, sem backup). Não apague; se for preciso, peça ao usuário.' }
    }

    const publica = PUBLICAR.filter(([, re]) => re.test(cmd)).map(([nome]) => nome)
    if (!publica.length) return { publica: [] }

    const ok = (cmd.match(OK_RE) || [])[1]?.toLowerCase()
    if (ok && data.agent_id) {
        return { recusa: `Guarda: subagente não usa SITE_OK. Publicar só pela sessão principal, com o usuário autorizando. Devolva o comando pronto.\n  ${publica.join('\n  ')}` }
    }
    if (ok === 'publicar') return { publica, autorizado: true }

    return {
        recusa: [
            `Guarda: este comando publica o site (${publica.join('; ')}). ${ok ? `SITE_OK=${ok} não é válido (use SITE_OK=publicar).` : 'O comando não traz SITE_OK.'}`,
            '',
            'Antes de repetir:',
            '  1. Diga ao usuário o que sobe, para onde e como voltar (docs/conhecimento/publicacao-seguranca.md#checklist-antes-de-publicar).',
            '  2. Só com o OK dele para ESTA ação, repita com a marca no comando:',
            '     bash: SITE_OK=publicar <comando>    PowerShell: $env:SITE_OK=\'publicar\'; <comando>',
        ].join('\n'),
    }
}

function checkFile(data) {
    const inp  = data.tool_input || {}
    const file = String(inp.file_path || inp.notebook_path || '')
    if (data.tool_name === 'Read') {
        if (path.basename(file) === '.env') {
            return 'Guarda: o .env guarda segredos e não se abre. Para conferir uma variável: node -e "process.loadEnvFile(\'.env\'); console.log(Boolean(process.env.NOME))".'
        }
        return null
    }
    // .env.example é o lugar de listar variáveis, sem valor; o resto não recebe valor do .env
    const content = [inp.content, inp.new_string, inp.new_source].filter(Boolean).join('\n')
    if (envValues().some(v => content.includes(v))) {
        return `Guarda: o texto a gravar em ${file} contém um valor do .env. Segredo mora só no .env: o código lê de process.env (ou do mecanismo de variáveis da stack) e o .env.example lista só os nomes.`
    }
    return null
}

function main() {
    let data
    try { data = JSON.parse(fs.readFileSync(0, 'utf8')) } catch (_) { return }
    const tool = data.tool_name
    if (tool === 'Bash' || tool === 'PowerShell') {
        const cmd = String(data.tool_input?.command || '')
        const res = checkCommand(cmd, data)
        if (res.recusa) deny(res.recusa)
        if (res.autorizado) audit(data, res.publica, cmd)
        return
    }
    if (['Read', 'Write', 'Edit', 'NotebookEdit'].includes(tool)) {
        const msg = checkFile(data)
        if (msg) deny(msg)
    }
}

if (require.main === module) {
    try { main() } catch (_) {}
} else {
    module.exports = { checkCommand, checkFile }
}
