// testa as regras do guarda sem rodar nada: node testes/guarda.test.js
const assert = require('assert')
const path   = require('path')
const { checkCommand } = require(path.join(__dirname, '..', '.claude', 'hooks', 'guarda.js'))

const main = {}
const sub  = { agent_id: 'x' }
const recusa = (cmd, data = main) => Boolean(checkCommand(cmd, data).recusa)

const casos = [
    // desenvolvimento local passa
    ['npm run dev', false],
    ['npm run build', false],
    ['npm install -g vercel', false],
    ['npm i -D gh-pages', false],
    ['vercel dev', false],
    ['git status --short', false],
    ['git add src/index.html', false],
    // publicar sem OK é recusado
    ['vercel --prod', true],
    ['vercel deploy', true],
    ['npx vercel', true],
    ['netlify deploy --prod', true],
    ['npx wrangler pages deploy dist', true],
    ['firebase deploy', true],
    ['npm run deploy', true],
    ['rsync -av dist/ user@host:/var/www', true],
    ['npx gh-pages -d dist', true],
    // com OK passa
    ['SITE_OK=publicar vercel --prod', false],
    ["$env:SITE_OK='publicar'; netlify deploy --prod", false],
    // OK inválido
    ['SITE_OK=sim vercel --prod', true],
    // git
    ['git add -A', true],
    ['git add .', true],
    ['git commit -am "x"', true],
    ['git commit --no-verify -m x', true],
    ['git push --force', true],
    // segredo e originais
    ['cat .env', true],
    ['Get-Content .env', true],
    ['cat .env.example', false],
    ['rm -rf assets/originais', true],
    ['rm -rf dist', false],
]
for (const [cmd, esperado] of casos) {
    assert.strictEqual(recusa(cmd), esperado, `${cmd}: esperado ${esperado ? 'recusa' : 'passa'}`)
}
// subagente nunca publica, nem com OK
assert.ok(recusa('SITE_OK=publicar vercel --prod', sub), 'subagente com SITE_OK deve ser recusado')
console.log(`ok: ${casos.length + 1} casos`)
