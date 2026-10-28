// SessionStart: o que vale saber ao abrir o chat, numa saída curta (silêncio se estiver tudo bem)
//
// 1. trava de segredos do commit desativada (git config core.hooksPath .githooks)
// 2. briefing ainda com itens "A DEFINIR"
// 3. publicações autorizadas nas últimas 24 h (.claude/auditoria-publicacoes.log)
// erro interno sai 0 em silêncio: início de sessão não pode travar

const fs   = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const DIA  = 24 * 60 * 60 * 1000

function main() {
    const avisos = []

    try {
        const hooks = execFileSync('git', ['config', '--get', 'core.hooksPath'], { cwd: ROOT, encoding: 'utf8' }).trim()
        if (hooks !== '.githooks') avisos.push('Trava de segredos desativada: rode `git config core.hooksPath .githooks`.')
    } catch (_) {
        avisos.push('Trava de segredos desativada: rode `git config core.hooksPath .githooks`.')
    }

    try {
        const pendentes = (fs.readFileSync(path.join(ROOT, 'docs', 'conhecimento', 'briefing.md'), 'utf8').match(/A DEFINIR/g) || []).length
        if (pendentes) avisos.push(`Briefing com ${pendentes} item(ns) "A DEFINIR" (docs/conhecimento/briefing.md): pergunte ao usuário antes de decidir por conta própria.`)
    } catch (_) {}

    try {
        const linhas = fs.readFileSync(path.join(ROOT, '.claude', 'auditoria-publicacoes.log'), 'utf8').trim().split('\n')
        const recentes = linhas.filter(l => Date.now() - Date.parse(l.split(' | ')[0]) < DIA)
        if (recentes.length) avisos.push(`${recentes.length} publicação(ões) autorizada(s) nas últimas 24 h: .claude/auditoria-publicacoes.log.`)
    } catch (_) {}

    if (avisos.length) process.stdout.write('[abertura]\n- ' + avisos.join('\n- ') + '\n')
}

try { main() } catch (_) {}
