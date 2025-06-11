// vite.config.ts
import { defineConfig } from 'vite'; // ✅ Only use Vite config here
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import tsConfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    envCompatible(),
    tsConfigPaths(),
    svgr(),
    electron({
      main: {
        entry: 'electron-main/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron-main/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test' ? undefined : {},
    }),
  ],
});
