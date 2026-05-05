import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const distRoot = join(packageRoot, 'dist')

const forbiddenDependencyPatterns = [
  '@antv/g2',
  '@uiw/react-codemirror',
  '@codemirror/',
  'chrono-node',
  'country-state-city',
  'react-dropzone',
  '@ncdai/react-wheel-picker',
  '@tanstack/react-virtual',
]

const guardedEntries = [
  { name: 'root', file: 'index.js', maxGzipBytes: 300_000 },
  { name: 'elements', file: 'elements.js', maxGzipBytes: 240_000 },
  { name: 'layouts', file: 'layouts.js', maxGzipBytes: 285_000 },
  { name: 'form', file: 'form.js', maxGzipBytes: 285_000 },
  { name: 'table', file: 'table.js', maxGzipBytes: 265_000 },
  { name: 'table/basic', file: 'table/basic.js', maxGzipBytes: 265_000 },
]

function resolveRelativeModule(fromFile, specifier) {
  if (!specifier.startsWith('.')) return undefined
  const base = normalize(join(dirname(fromFile), specifier))
  if (base.endsWith('.js')) return existsSync(base) ? base : undefined
  const filePath = `${base}.js`
  if (existsSync(filePath)) return filePath
  const indexPath = join(base, 'index.js')
  if (existsSync(indexPath)) return indexPath
  return undefined
}

function readFileContents(file, contentsByFile) {
  if (!contentsByFile.has(file)) {
    contentsByFile.set(file, readFileSync(file, 'utf8'))
  }

  return contentsByFile.get(file) ?? ''
}

function getRelativeImports(file, contentsByFile) {
  const contents = readFileContents(file, contentsByFile)
  const imports = new Set()
  const patterns = [
    /\bimport\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\bexport\s+[^'"]*?\s+from\s+['"]([^'"]+)['"]/g,
    /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]

  for (const pattern of patterns) {
    for (const match of contents.matchAll(pattern)) {
      const resolved = resolveRelativeModule(file, match[1])
      if (resolved) {
        imports.add(resolved)
      }
    }
  }

  return imports
}

function collectReachableFiles(entryFile, contentsByFile) {
  const files = new Set()
  const pending = [entryFile]

  while (pending.length > 0) {
    const file = pending.pop()
    if (!file || files.has(file)) continue
    files.add(file)

    for (const importedFile of getRelativeImports(file, contentsByFile)) {
      pending.push(importedFile)
    }
  }

  return [...files]
}

function checkForbiddenDependencies(entry, files, contentsByFile) {
  const failures = []

  for (const file of files) {
    const contents = readFileContents(file, contentsByFile)
    for (const dependency of forbiddenDependencyPatterns) {
      if (contents.includes(dependency)) {
        failures.push(`${entry.name}: ${dependency} is reachable via ${file.replace(`${packageRoot}/`, '')}`)
      }
    }
  }

  return failures
}

function getGzipBudgetUsage(files, contentsByFile) {
  return files.reduce(
    (usage, file) => {
      const contents = readFileContents(file, contentsByFile)
      usage.rawBytes += Buffer.byteLength(contents)
      usage.gzipBytes += gzipSync(contents).byteLength
      return usage
    },
    { rawBytes: 0, gzipBytes: 0 },
  )
}

const failures = []
const contentsByFile = new Map()

for (const entry of guardedEntries) {
  const entryFile = join(distRoot, entry.file)
  if (!existsSync(entryFile)) {
    failures.push(`${entry.name}: missing ${entry.file}`)
    continue
  }

  const reachableFiles = collectReachableFiles(entryFile, contentsByFile)
  failures.push(...checkForbiddenDependencies(entry, reachableFiles, contentsByFile))

  const usage = getGzipBudgetUsage(reachableFiles, contentsByFile)
  if (usage.gzipBytes > entry.maxGzipBytes) {
    failures.push(`${entry.name}: ${usage.gzipBytes} gzip bytes exceeds ${entry.maxGzipBytes} gzip byte budget`)
  }

  console.log(
    `${entry.name}: ${reachableFiles.length} JS files, ${usage.gzipBytes} gzip bytes, ${usage.rawBytes} raw bytes`,
  )
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}
