import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    adapter: node({
        mode: 'standalone'
    }),
    site: 'https://isitvritra.com',
    output: 'server', // Changed to 'server' to support API routes (hybrid was removed)
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