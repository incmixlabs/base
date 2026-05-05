import { resolve } from 'node:path'

const workspaceSourceAliasMap = {
  '@': '../../packages/ui/src',
}

const defaultWorkspaceSourceAliases = Object.keys(workspaceSourceAliasMap)

/**
 * Creates Vite resolve.alias mappings to workspace source files for local dev.
 * This intentionally bypasses package build output so app changes pick up UI
 * package edits immediately during Vite HMR.
 *
 * `fromDir` is expected to be an app directory under the workspace root, such
 * as `apps/docs` or `apps/presspoint`.
 *
 * @param {string} fromDir
 * @param {{ aliases?: string[] }} [options]
 * @returns {Record<string, string>}
 */
export function createWorkspaceSourceAliases(fromDir, options = {}) {
  const aliases = options.aliases ?? defaultWorkspaceSourceAliases

  return Object.fromEntries(
    aliases.map(alias => {
      const target = workspaceSourceAliasMap[alias]
      if (!target) {
        throw new Error(`createWorkspaceSourceAliases: unsupported alias "${alias}"`)
      }

      return [alias, resolve(fromDir, target)]
    }),
  )
}
