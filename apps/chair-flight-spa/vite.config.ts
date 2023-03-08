/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { default as react } from '@vitejs/plugin-react';
import { default as viteTsConfigPaths } from 'vite-tsconfig-paths';
import { default as svgr } from 'vite-plugin-svgr';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/chair-flight-spa',

  server: {
    port: 4401,
    host: 'localhost',
  },

  preview: {
    port: 4501,
    host: 'localhost',
  },

  plugins: [
    react(),
    svgr(),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },

  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `app-assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'app-assets/js/[name]-[hash].js',
        entryFileNames: 'app-assets/js/[name]-[hash].js',
      },
    },
  },
});
