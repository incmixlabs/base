import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  resolve: {
    alias: [
      {
        find: '@incmix/core/declarative-ui.examples',
        replacement: path.resolve(__dirname, '../core/src/declarative-ui.examples.ts'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        find: '@incmix/core',
        replacement: path.resolve(__dirname, '../core/src/index.ts'),
      },
      {
        find: '@incmix/react-runner',
        replacement: path.resolve(__dirname, '../react-runner/src/index.ts'),
      },
      {
        find: '@incmix/ajv',
        replacement: path.resolve(__dirname, '../ajv/src/index.ts'),
      },
      {
        find: '@incmix/theme',
        replacement: path.resolve(__dirname, '../theme/src/index.ts'),
      },
    ],
  },
})
