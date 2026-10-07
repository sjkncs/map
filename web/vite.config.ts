import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { GLOBAL_CONFIG } from '../config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@root': fileURLToPath(new URL('..', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: GLOBAL_CONFIG.devPort,
    strictPort: true,
    open: true,
    watch: {
      ignored: ['**/services/map.ts'],
    },
  },
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          tensorflow: [
            '@tensorflow/tfjs-core',
            '@tensorflow/tfjs-layers',
            '@tensorflow/tfjs-backend-webgl',
          ],
        },
      },
    },
  },
})
