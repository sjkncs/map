import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@root': fileURLToPath(new URL('..', import.meta.url)),
      },
    },
  },
})
