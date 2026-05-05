import { createReactCompilerPluginOptions, createTanStackStartViteConfig } from '@bwalkt/config/vite-tanstack-start.js'
import mdx from '@mdx-js/rollup'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'

const analyze = process.env.ANALYZE === 'true'
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

export default defineConfig(
  createTanStackStartViteConfig({
    rootDir: import.meta.dirname,
    workspaceSourceAliases: ['@'],
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
  }),
)
