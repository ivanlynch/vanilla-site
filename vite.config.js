import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    root: 'src/pages',
    publicDir: '../../public',
    build: {
        outDir: '../../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/pages/index.html'),
                about: resolve(__dirname, 'src/pages/about.html'),
            },
        },
    },
})