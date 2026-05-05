import { resolve } from 'node:path'
import { reactCompilerBabelPlugins } from '@incmix/config/react-compiler.js'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    react({
      babel: {
        plugins: reactCompilerBabelPlugins,
      },
    }),
    visualizer({
      filename: 'dist-analyze/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@incmix/theme': resolve(import.meta.dirname, '../theme/src/index.ts'),
    },
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist-analyze',
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
})
