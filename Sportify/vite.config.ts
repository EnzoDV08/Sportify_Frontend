import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// ✅ Use dynamic ESM-safe import for vite-tsconfig-paths
export default defineConfig(async () => {
  const { default: tsConfigPaths } = await import('vite-tsconfig-paths')

  return {
    plugins: [
      react(),
      tsConfigPaths(), // ✅ Now safe with ESM-only
      svgr(),
      electron({
        main: {
          entry: 'electron/main.ts',
        },
        preload: {
          input: path.join(__dirname, 'electron/preload.ts'),
        },
        renderer: process.env.NODE_ENV === 'test' ? undefined : {},
      }),
    ],
  }
})
