import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const distRoot = join(packageRoot, 'dist')
const directive = "'use client';"

async function collectPublicJsFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'chunks') {
        files.push(...(await collectPublicJsFiles(entryPath)))
      }
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(entryPath)
    }
  }

  return files
}

const patchedFiles = []

for (const file of await collectPublicJsFiles(distRoot)) {
  const contents = await readFile(file, 'utf8')
  if (contents.startsWith(directive)) continue

  await writeFile(file, `${directive}\n${contents}`)
  patchedFiles.push(relative(packageRoot, file))
}

if (patchedFiles.length > 0) {
  console.log(`patched ${patchedFiles.length} public JS entry files with ${directive}`)
}
