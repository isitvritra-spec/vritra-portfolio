import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://isitvritra.com',
    output: 'static',
    build: {
        assets: 'assets'
    },
    vite: {
      build: {
          cssMinify: true
      },

      plugins: [tailwindcss()]
    }
});