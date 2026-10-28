// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // domínio a confirmar com o usuário (o e-mail da designer usa bydani.com.br); afeta só sitemap e og:image
  site: 'https://bydani.com.br',
  integrations: [sitemap()],
});
