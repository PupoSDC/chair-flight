/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { default as react } from '@vitejs/plugin-react';
import { default as reactNative } from 'vitest-react-native';
import { default as viteTsConfigPaths } from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    reactNative(),
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
