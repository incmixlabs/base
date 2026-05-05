import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { reactCompilerBabelPlugins } from '@incmix/config/react-compiler.js'
import type { StorybookConfig } from '@storybook/react-vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const analyze = process.env.ANALYZE === 'true'
const storybookDocsBlocksPath = fileURLToPath(import.meta.resolve('@storybook/addon-docs/blocks'))
const autoformSrcPath = resolve(__dirname, '../../../packages/autoform/src')
const uiSrcPath = resolve(__dirname, '../../../packages/ui/src')

const config: StorybookConfig = {
  stories: [
    '../../../packages/ajv/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/autoform/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/charts/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/elements/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/form/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/layouts/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/media/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/theme/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/typography/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/ui/src/**/*.mdx',
  ],
  addons: [getAbsolutePath('@storybook/addon-docs')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: false,
  },
  viteFinal: async config => {
    const workspaceAliases = [
      { find: '@', replacement: uiSrcPath },
      { find: /^@incmix\/autoform\/(.+)$/, replacement: `${autoformSrcPath}/$1` },
      { find: '@incmix/autoform', replacement: resolve(autoformSrcPath, 'index.tsx') },
      { find: /^@incmix\/ui\/(.+)$/, replacement: `${uiSrcPath}/$1` },
      { find: '@incmix/ajv', replacement: resolve(__dirname, '../../../packages/ajv/src/index.ts') },
      {
        find: '@incmix/core/declarative-ui.examples',
        replacement: resolve(__dirname, '../../../packages/core/src/declarative-ui.examples.ts'),
      },
      { find: '@incmix/core', replacement: resolve(__dirname, '../../../packages/core/src/index.ts') },
      { find: '@incmix/react', replacement: resolve(__dirname, '../../../packages/react/src/index.tsx') },
      { find: '@incmix/react-runner', replacement: resolve(__dirname, '../../../packages/react-runner/src/index.ts') },
      { find: '@incmix/theme', replacement: resolve(__dirname, '../../../packages/theme/src/index.ts') },
      { find: '@incmix/ui', replacement: resolve(uiSrcPath, 'index.ts') },
      { find: '@storybook/addon-docs/blocks', replacement: storybookDocsBlocksPath },
    ]

    config.resolve = {
      ...config.resolve,
      alias: Array.isArray(config.resolve?.alias)
        ? [...config.resolve.alias, ...workspaceAliases]
        : [
            ...Object.entries(config.resolve?.alias ?? {}).map(([find, replacement]) => ({ find, replacement })),
            ...workspaceAliases,
          ],
    }

    config.plugins = [
      ...(config.plugins ?? []),
      vanillaExtractPlugin(),
      react({
        babel: {
          plugins: reactCompilerBabelPlugins,
        },
      }),
      ...(analyze
        ? [
            visualizer({
              filename: 'storybook-static/stats.html',
              template: 'treemap',
              gzipSize: true,
              brotliSize: true,
              open: false,
            }),
          ]
        : []),
    ]

    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [
        ...(config.optimizeDeps?.include ?? []),
        '@base-ui/react/tabs',
        '@base-ui/react/progress',
        '@base-ui/react/dialog',
        '@base-ui/react/popover',
        '@base-ui/react/tooltip',
        '@base-ui/react/menu',
        '@base-ui/react/button',
        '@base-ui/react/switch',
        '@base-ui/react/checkbox',
        '@base-ui/react/checkbox-group',
        '@base-ui/react/radio',
        '@base-ui/react/radio-group',
        '@base-ui/react/select',
        '@base-ui/react/slider',
        '@base-ui/react/separator',
        '@base-ui/react/alert-dialog',
        '@base-ui/react/context-menu',
        '@base-ui/react/direction-provider',
        '@base-ui/react/merge-props',
        '@base-ui/react/use-render',
      ],
    }

    return config
  },
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
