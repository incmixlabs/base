import { resolve } from 'node:path'
import { createReactCompilerPluginOptions, createTanStackStartViteConfig } from '@incmix/config/vite-tanstack-start.js'
import mdx from '@mdx-js/rollup'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'

const analyze = process.env.ANALYZE === 'true'
const uiSrcPath = resolve(import.meta.dirname, '../../packages/ui/src')
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
const analysisPlugins: PluginOption[] = analyze
  ? [
      visualizer({
        filename: 'dist/stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: false,
      }),
    ]
  : []

const config = createTanStackStartViteConfig({
  rootDir: import.meta.dirname,
  workspaceSourceAliases: ['@', '@incmix/core', '@incmix/react-runner'],
  plugins: [
    mdx(),
    tanstackStart({
      tsr: {
        appDirectory: 'src',
        routesDirectory: 'src/routes',
        generatedRouteTree: 'src/routeTree.gen.ts',
      },
    } as any),
    react(createReactCompilerPluginOptions()),
    vanillaExtractPlugin(),
    ...analysisPlugins,
  ],
})

config.resolve.alias = [
  ...Object.entries(config.resolve?.alias ?? {}).map(([find, replacement]) => ({ find, replacement })),
  ...Object.entries(uiSourceExportAliases).map(([find, source]) => ({
    find,
    replacement: resolve(uiSrcPath, source),
  })),
  { find: /^@incmix\/ui\/(.+)$/, replacement: `${uiSrcPath}/$1` },
  { find: '@incmix/ajv', replacement: resolve(import.meta.dirname, '../../packages/ajv/src/index.ts') },
  { find: '@incmix/react', replacement: resolve(import.meta.dirname, '../../packages/react/src/index.tsx') },
  { find: '@incmix/theme', replacement: resolve(import.meta.dirname, '../../packages/theme/src/index.ts') },
  { find: '@incmix/ui', replacement: resolve(uiSrcPath, 'index.ts') },
]

export default defineConfig(config)
