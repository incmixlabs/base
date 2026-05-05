import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uiSrcPath = path.resolve(__dirname, '../../packages/ui/src')

const uiSourceExportAliases = {
  '@incmix/ui/charts/renderers': 'charts/chart-renderers.tsx',
  '@incmix/ui/dashboard': 'layouts/dashboard/index.ts',
  '@incmix/ui/declarative/renderer': 'declarative/DeclarativeRenderer.tsx',
  '@incmix/ui/editor/docs': 'editor/live/index.ts',
  '@incmix/ui/elements/props': 'editor/elements/props.ts',
  '@incmix/ui/filter': 'elements/filter/index.ts',
  '@incmix/ui/form/date-next': 'form/date/index.ts',
  '@incmix/ui/form/props': 'editor/form/props.ts',
  '@incmix/ui/layouts/masonry': 'layouts/masonry/Masonry.tsx',
  '@incmix/ui/layouts/props': 'editor/layouts/props.ts',
  '@incmix/ui/media/media-player': 'media/media-player/MediaPlayer.tsx',
  '@incmix/ui/props': 'editor/prop-defs.ts',
  '@incmix/ui/table/tree-ops': 'table/tree/index.ts',
  '@incmix/ui/theme-panel': 'editor/ThemePanel.tsx',
}

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  resolve: {
    alias: [
      ...Object.entries(uiSourceExportAliases).map(([find, source]) => ({
        find,
        replacement: path.resolve(uiSrcPath, source),
      })),
      {
        find: '@',
        replacement: uiSrcPath,
      },
      { find: /^@incmix\/ui\/(.+)$/, replacement: `${uiSrcPath}/$1` },
      { find: '@incmix/ajv', replacement: path.resolve(__dirname, '../../packages/ajv/src/index.ts') },
      { find: '@incmix/core', replacement: path.resolve(__dirname, '../../packages/core/src/index.ts') },
      {
        find: '@incmix/core/declarative-ui.examples',
        replacement: path.resolve(__dirname, '../../packages/core/src/declarative-ui.examples.ts'),
      },
      { find: '@incmix/react', replacement: path.resolve(__dirname, '../../packages/react/src/index.tsx') },
      {
        find: '@incmix/react-runner',
        replacement: path.resolve(__dirname, '../../packages/react-runner/src/index.ts'),
      },
      { find: '@incmix/theme', replacement: path.resolve(__dirname, '../../packages/theme/src/index.ts') },
      { find: '@incmix/ui', replacement: path.resolve(uiSrcPath, 'index.ts') },
    ],
  },
})
