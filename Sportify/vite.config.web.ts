import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import tsConfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    envCompatible(),
    tsConfigPaths(),
    svgr(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
  },
});
