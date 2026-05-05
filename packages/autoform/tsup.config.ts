import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
    'editor/index': 'src/editor/index.ts',
    'stories/autoform-ui-schema-contract.example': 'src/stories/autoform-ui-schema-contract.example.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  esbuildPlugins: [vanillaExtractPlugin()],
  esbuildOptions(options) {
    options.banner = { js: "'use client';" }
  },
})
