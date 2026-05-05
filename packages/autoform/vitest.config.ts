import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uiSrcPath = path.resolve(__dirname, '../ui/src')

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['../ui/src/test/setup.ts'],
    css: true,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: uiSrcPath,
      },
      {
        find: '@incmix/core/declarative-ui.examples',
        replacement: path.resolve(__dirname, '../core/src/declarative-ui.examples.ts'),
      },
      { find: /^@incmix\/autoform\/(.+)$/, replacement: path.resolve(__dirname, 'src/$1') },
      { find: '@incmix/autoform', replacement: path.resolve(__dirname, 'src/index.tsx') },
      { find: /^@incmix\/ui\/(.+)$/, replacement: path.resolve(uiSrcPath, '$1') },
      { find: '@incmix/ajv', replacement: path.resolve(__dirname, '../ajv/src/index.ts') },
      { find: '@incmix/core', replacement: path.resolve(__dirname, '../core/src/index.ts') },
      { find: '@incmix/react', replacement: path.resolve(__dirname, '../react/src/index.tsx') },
      { find: '@incmix/theme', replacement: path.resolve(__dirname, '../theme/src/index.ts') },
      { find: '@incmix/ui', replacement: path.resolve(uiSrcPath, 'index.ts') },
    ],
  },
})
