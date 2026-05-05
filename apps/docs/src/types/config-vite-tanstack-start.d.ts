declare module '@incmix/config/vite-tanstack-start.js' {
  import type { PluginItem } from '@babel/core'
  import type { PluginOption, UserConfig } from 'vite'

  interface ReactCompilerPluginOptions {
    babel: {
      plugins: PluginItem[]
    }
  }

  export function createReactCompilerPluginOptions(): ReactCompilerPluginOptions
  export function createTanStackStartViteConfig(config: {
    rootDir: string
    workspaceSourceAliases?: string[]
    plugins?: PluginOption[]
  }): UserConfig
}
