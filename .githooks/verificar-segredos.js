// pre-commit: recusa o commit se algum arquivo preparado (staged) trouxer segredo, original pesado
// ou arquivo grande demais para um site
// ativar uma vez por clone: git config core.hooksPath .githooks
// pular (só se tiver certeza, e diga no commit por quê): git commit --no-verify
//
// recusa:
// 1. caminho proibido: .env, assets/originais/, log de publicações
// 2. qualquer valor do .env (12+ caracteres) dentro de um arquivo
// 3. Bearer/sk- de cara de token, chave longa ao lado de api-key/token/password/secret
// 4. arquivo acima de 5 MB (otimize a imagem/vídeo ou guarde em assets/originais/)

const fs               = require('fs')
const path             = require('path')
const { execFileSync } = require('child_process')

const ROOT      = path.resolve(__dirname, '..')
const MAX_BYTES = 5 * 1024 * 1024

const PROIBIDOS = [
    /^\.env$/,
    /^\.env\.(?!example$)[^/]+$/,
    /^assets\/originais\//,
    /^\.claude\/auditoria-publicacoes\.log$/,
]

const SEGREDOS = [
    ['token Bearer', /Bearer\s+[A-Za-z0-9_\-.]{20,}/],
    ['chave sk-', /\bsk-[A-Za-z0-9_\-]{20,}/],
    ['chave ao lado de api-key/token/password/secret', /(api[_-]?key|token|password|senha|secret)["']?\s*[:=]\s*["'][A-Za-z0-9_\-]{24,}["']/i],
]

function envValues() {
    try {
        return fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n')
            .map(l => (l.match(/^\s*[A-Za-z_]\w*\s*=\s*['"]?([^'"\s#]+)/) || [])[1])
            .filter(v => v && v.length >= 12)
    } catch (_) { return [] }
}

function main() {
    const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], { cwd: ROOT, encoding: 'utf8' })
        .split('\0').filter(Boolean)
    const valores = envValues()
    const erros = []

    for (const f of staged) {
        const rel = f.replace(/\\/g, '/')
        if (PROIBIDOS.some(re => re.test(rel))) {
            erros.push(`${rel}: caminho que não se versiona (segredo ou original pesado). Tire com: git rm --cached "${rel}"`)
            continue
        }
        let s
        try { s = execFileSync('git', ['show', `:${f}`], { cwd: ROOT, maxBuffer: 256 * 1024 * 1024 }) } catch (_) { continue }
        if (s.length > MAX_BYTES) {
            erros.push(`${rel}: ${(s.length / 1048576).toFixed(1)} MB (limite 5 MB). Otimize ou guarde em assets/originais/`)
            continue
        }
        if (s.includes(0)) continue   // binário (imagem, fonte): só o tamanho conta
        s.toString('utf8').split('\n').forEach((linha, i) => {
            if (valores.some(v => linha.includes(v))) erros.push(`${rel}:${i + 1}: contém um valor do .env`)
            for (const [nome, re] of SEGREDOS) if (re.test(linha)) erros.push(`${rel}:${i + 1}: ${nome}`)
        })
    }

    if (erros.length) {
        console.error('\n  ✗  Commit recusado: segredo, original pesado ou arquivo grande nos arquivos preparados.\n')
        erros.slice(0, 30).forEach(e => console.error('     ' + e))
        if (erros.length > 30) console.error(`     … e mais ${erros.length - 30}`)
        console.error('\n  Segredo mora só no .env; originais da designer ficam em assets/originais/ (fora do git).')
        console.error('  Regras: docs/conhecimento/publicacao-seguranca.md#segredos\n')
        process.exit(1)
    }
}

main()
