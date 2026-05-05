import { reactCompilerBabelPlugins } from './react-compiler.js'
import { createWorkspaceSourceAliases } from './vite-aliases.js'

const DEFAULT_BFF_ORIGIN = 'http://127.0.0.1:3020'

export function createTanStackStartViteConfig({ rootDir, plugins = [], workspaceSourceAliases } = {}) {
  if (!rootDir) {
    throw new Error('createTanStackStartViteConfig: rootDir is required')
  }
  if (!Array.isArray(plugins)) {
    throw new Error('createTanStackStartViteConfig: plugins must be an array')
  }
  if (workspaceSourceAliases !== undefined && !Array.isArray(workspaceSourceAliases)) {
    throw new Error('createTanStackStartViteConfig: workspaceSourceAliases must be an array when provided')
  }

  return {
    plugins,
    server: {
      proxy: {
        '/api': {
          target: process.env.BFF_ORIGIN ?? DEFAULT_BFF_ORIGIN,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: createWorkspaceSourceAliases(rootDir, {
        aliases: workspaceSourceAliases,
      }),
    },
  }
}

export function createReactCompilerPluginOptions() {
  return {
    babel: {
      plugins: reactCompilerBabelPlugins,
    },
  }
}
