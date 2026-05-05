import { access, readFile, realpath } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

async function fileExists(url) {
  try {
    await access(url)
    return true
  } catch {
    return false
  }
}

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context)
  } catch (error) {
    if (error?.code === 'ERR_MODULE_NOT_FOUND' && error.url) {
      const jsUrl = new URL(`${error.url}.js`)
      if (await fileExists(jsUrl)) {
        return {
          shortCircuit: true,
          url: jsUrl.href,
        }
      }
    }

    if (error?.code !== 'ERR_UNSUPPORTED_DIR_IMPORT' || !error.url) throw error

    const packageDirectoryUrl = new URL(error.url.endsWith('/') ? error.url : `${error.url}/`)
    const packageJsonUrl = new URL('package.json', packageDirectoryUrl)

    try {
      const packageJson = JSON.parse(await readFile(packageJsonUrl, 'utf8'))
      const entry = packageJson.module ?? packageJson.main
      if (typeof entry === 'string') {
        const realPackageDirectoryUrl = pathToFileURL(`${await realpath(packageDirectoryUrl)}/`)
        return {
          shortCircuit: true,
          url: new URL(entry, realPackageDirectoryUrl).href,
        }
      }
    } catch {
      throw error
    }

    throw error
  }
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.css')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default undefined',
    }
  }

  if (url.endsWith('.json')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${await readFile(new URL(url), 'utf8')}`,
    }
  }

  return nextLoad(url, context)
}
