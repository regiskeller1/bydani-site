// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// o workflow do GitHub Pages define SITE_URL e BASE_PATH (usuario.github.io/<repo>/).
// sem eles (build local): domínio a confirmar com o usuário (o e-mail da designer usa bydani.com.br)
export default defineConfig({
  site: process.env.SITE_URL || 'https://bydani.com.br',
  base: process.env.BASE_PATH || '/',
  integrations: [sitemap()],
});
