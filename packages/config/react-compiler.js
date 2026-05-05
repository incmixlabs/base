/**
 * Shared React Compiler (babel-plugin-react-compiler) configuration.
 *
 * Usage in Vite configs:
 *   import { reactCompilerBabelPlugins } from '@incmix/config/react-compiler.js'
 *   react({ babel: { plugins: reactCompilerBabelPlugins } })
 */

/** @type {import('@vitejs/plugin-react').Options['babel']['plugins']} */
export const reactCompilerBabelPlugins = [['babel-plugin-react-compiler', {}]]
