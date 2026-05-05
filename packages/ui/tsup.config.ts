import { readdirSync } from 'node:fs'
import { basename, extname, join, posix } from 'node:path'
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin'
import { defineConfig } from 'tsup'

const externalFontUrlsPlugin = {
  name: 'external-font-urls',
  setup(build: { onResolve: (options: { filter: RegExp }, callback: (args: { path: string }) => unknown) => void }) {
    build.onResolve({ filter: /^@incmix\/ui\/fonts\// }, args => ({
      path: args.path,
      external: true,
    }))
  },
}

function entriesFromDirectory(directory: string, outputPrefix: string) {
  return Object.fromEntries(
    readdirSync(directory)
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
      .filter(file => !file.includes('.test.'))
      .map(file => {
        const extension = extname(file)
        const name = basename(file, extension)
        return [posix.join(outputPrefix, name), join(directory, file)]
      }),
  )
}

const lightEntries = {
  index: 'src/index.ts',
  dashboard: 'src/layouts/dashboard/index.ts',
  elements: 'src/elements/index.ts',
  'elements/avatar/Avatar': 'src/elements/avatar/Avatar.tsx',
  'elements/badge/Badge': 'src/elements/badge/Badge.tsx',
  'elements/button/Button': 'src/elements/button/Button.tsx',
  'elements/button/Icon': 'src/elements/button/Icon.tsx',
  'elements/button/IconButton': 'src/elements/button/IconButton.tsx',
  'elements/card/Card': 'src/elements/card/Card.tsx',
  'elements/props': 'src/editor/elements/props.ts',
  form: 'src/form/index.ts',
  'form/props': 'src/editor/form/props.ts',
  hooks: 'src/hooks/index.ts',
  layouts: 'src/layouts/index.ts',
  'layouts/app-shell/AppShell': 'src/layouts/app-shell/AppShell.tsx',
  'layouts/dashboard': 'src/layouts/dashboard/index.ts',
  'layouts/masonry': 'src/layouts/masonry/Masonry.tsx',
  'layouts/props': 'src/editor/layouts/props.ts',
  'layouts/section/Section': 'src/layouts/section/Section.tsx',
  'layouts/sidebar/Sidebar': 'src/layouts/sidebar/Sidebar.tsx',
  'layouts/sidebar/SidebarWrapperShell': 'src/layouts/sidebar/SidebarWrapperShell.tsx',
  'layouts/sidebar/sidebar-wrapper.types': 'src/layouts/sidebar/sidebar-wrapper.types.ts',
  props: 'src/editor/prop-defs.ts',
  'status-page': 'src/status-page/index.ts',
  table: 'src/table/index.ts',
  'table/basic': 'src/table/basic.ts',
  theme: 'src/theme/index.ts',
  'theme-panel': 'src/editor/ThemePanel.tsx',
  'theme/contract': 'src/theme/contract/theme-contract.ts',
  typography: 'src/typography/index.ts',
  'typography/heading/Heading': 'src/typography/heading/Heading.tsx',
  'typography/text/Text': 'src/typography/text/Text.tsx',
  'utils/date': 'src/utils/date.ts',
  widgets: 'src/widgets/index.ts',
  ...entriesFromDirectory('src/hooks', 'hooks'),
  ...entriesFromDirectory('src/lib', 'lib'),
}

const featureEntries = {
  'blocks/diagrammer': 'src/blocks/diagrammer/index.ts',
  'blocks/diagrammer/db': 'src/blocks/diagrammer/db/index.ts',
  'blocks/diagrammer/rules': 'src/blocks/diagrammer/rules/index.ts',
  'blocks/kanban': 'src/blocks/kanban/index.ts',
  charts: 'src/charts/index.ts',
  'charts/core': 'src/charts/core.ts',
  'charts/renderers': 'src/charts/chart-renderers.tsx',
  composites: 'src/composites/index.ts',
  'compose/sidebar': 'src/compose/sidebar.ts',
  'compose/view': 'src/compose/view.tsx',
  declarative: 'src/declarative/index.ts',
  'declarative/jsx-authoring': 'src/declarative/jsx-authoring.ts',
  'declarative/renderer': 'src/declarative/DeclarativeRenderer.tsx',
  'declarative/runtime': 'src/declarative/runtime.ts',
  editor: 'src/editor/index.ts',
  'editor/autoform': 'src/editor/autoform/index.ts',
  'editor/catalog': 'src/editor/catalog.ts',
  'editor/docs': 'src/editor/live/index.ts',
  'editor/live': 'src/editor/live/index.ts',
  filter: 'src/elements/filter/index.ts',
  'form/date': 'src/form/date/index.ts',
  'form/file-upload': 'src/form/file-upload.ts',
  'form/location': 'src/form/location.ts',
  'form/phone': 'src/form/phone.ts',
  'media/media-player': 'src/media/media-player/MediaPlayer.tsx',
  'table/infinite': 'src/table/infinite/index.ts',
  'table/summary-chart': 'src/table/summary-chart.ts',
  'table/tree': 'src/table/tree.ts',
  'table/tree-ops': 'src/table/tree/index.ts',
  'table/view': 'src/table/view.ts',
}

const commonOptions = {
  format: ['esm'],
  dts: false,
  splitting: true,
  sourcemap: true,
  treeshake: true,
  metafile: true,
  external: ['react', 'react-dom', '@incmix/ui/fonts/*'],
  esbuildPlugins: [vanillaExtractPlugin(), externalFontUrlsPlugin],
  esbuildOptions(options) {
    options.banner = { js: "'use client';" }
    options.chunkNames = 'chunks/[name]-[hash]'
  },
} satisfies Parameters<typeof defineConfig>[0]

export default defineConfig([
  {
    ...commonOptions,
    entry: lightEntries,
    clean: true,
  },
  {
    ...commonOptions,
    entry: featureEntries,
    clean: false,
  },
])
