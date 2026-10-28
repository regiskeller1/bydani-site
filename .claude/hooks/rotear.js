// PostToolUse (Bash|PowerShell|Read|Edit|Write|Grep|Glob): injeta o conhecimento do domínio que a
// sessão acabou de tocar, UMA vez por sessão (e por subagente, menos Explore e Plan)
//
// domínio = arquivo em docs/conhecimento/ + termos que, no input da ferramenta, contam como tocar
// (caminho, comando, padrão de busca). Mudou aqui, mude a tabela de docs/conhecimento/decisoes.md
//
// também em SessionStart (compact|clear): a compactação tira o texto do contexto, então o estado
// se apaga e o próximo toque injeta de novo
// estado em %TEMP%/site-designer-hooks/<session_id>.json. erro interno sai 0 em silêncio

const fs   = require('fs')
const os   = require('os')
const path = require('path')

const ROOT        = path.resolve(__dirname, '..', '..')
const MAX_CONTEXT = 9500   // o Claude Code corta additionalContext acima de 10.000 caracteres
const STATE_DIR   = path.join(os.tmpdir(), 'site-designer-hooks')

const DOMINIOS = [
    { arquivo: 'decisoes-design.md',      termos: ['assets/', 'design/', 'styles/', 'tokens', '.css', '.scss', 'tailwind', 'fonts/', 'briefing.md'] },
    { arquivo: 'decisoes-codigo.md',      termos: ['src/', 'components/', 'pages/', 'app/', 'package.json', '.tsx', '.jsx', '.astro', '.html', 'npm run', 'npm start'] },
    { arquivo: 'publicacao-seguranca.md', termos: ['deploy', 'vercel', 'netlify', 'wrangler', 'firebase', 'gh-pages', 'dominio', 'domínio', 'site_ok', '.env', 'publicacoes.md'] },
]

function statePath(sessionId) {
    return path.join(STATE_DIR, `${String(sessionId || 'sem-sessao').replace(/[^\w-]/g, '')}.json`)
}

function main() {
    let data
    try { data = JSON.parse(fs.readFileSync(0, 'utf8')) } catch (_) { return }
    const file = statePath(data.session_id)

    if (data.hook_event_name === 'SessionStart') {
        try { fs.unlinkSync(file) } catch (_) {}
        return
    }
    if (['Explore', 'Plan'].includes(data.agent_type)) return

    // só caminho, comando e padrão de busca contam: o conteúdo gravado num Write/Edit não é tocar
    const inp   = data.tool_input || {}
    const texto = [inp.command, inp.file_path, inp.path, inp.pattern, inp.glob].filter(Boolean).join(' ').toLowerCase().replace(/\\/g, '/')
    let state = {}
    try { state = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (_) {}
    const who  = String(data.agent_id || 'main')
    const done = new Set(state[who] || [])

    const chunks = []
    let total = 0
    for (const d of DOMINIOS) {
        if (done.has(d.arquivo) || !d.termos.some(t => texto.includes(t))) continue
        let body
        try { body = fs.readFileSync(path.join(ROOT, 'docs', 'conhecimento', d.arquivo), 'utf8') } catch (_) { continue }
        const chunk = `[rotear] Você tocou o domínio de docs/conhecimento/${d.arquivo}; siga-o:\n\n${body}`
        if (total + chunk.length > MAX_CONTEXT) {
            chunks.push(`[rotear] Abra com Read docs/conhecimento/${d.arquivo} antes de seguir (não coube aqui).`)
        } else {
            chunks.push(chunk)
            total += chunk.length
        }
        done.add(d.arquivo)
    }
    if (!chunks.length) return

    state[who] = [...done]
    fs.mkdirSync(STATE_DIR, { recursive: true })
    fs.writeFileSync(file, JSON.stringify(state))
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: chunks.join('\n\n') } }))
}

try { main() } catch (_) {}
