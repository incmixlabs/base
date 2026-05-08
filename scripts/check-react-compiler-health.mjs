#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const rootDir = path.resolve(import.meta.dirname, '..')

const requiredCompilerWiring = [
  {
    file: 'packages/config/react-compiler.js',
    contains: ['babel-plugin-react-compiler', 'reactCompilerBabelPlugins'],
  },
  {
    file: 'apps/storybook/.storybook/main.ts',
    contains: ['reactCompilerBabelPlugins'],
  },
  {
    file: 'packages/ui/vite.analyze.config.ts',
    contains: ['reactCompilerBabelPlugins'],
  },
]

const expectedOptOuts = [
  ['packages/ui/src/elements/progress/Progress.tsx', 'Progress'],
  ['packages/ui/src/elements/sheet/Sheet.tsx', 'SheetContent'],
  ['packages/ui/src/form/FileUpload.tsx', 'FileUpload'],
  ['packages/ui/src/form/Rating.tsx', 'Rating'],
  ['packages/ui/src/layouts/masonry/Masonry.tsx', 'useResizeObserver'],
  ['packages/ui/src/layouts/masonry/Masonry.tsx', 'useThrottle'],
  ['packages/ui/src/lib/compose-refs.ts', 'useComposedRefs'],
  ['packages/ui/src/media/media-player/MediaPlayer.tsx', 'MediaPlayerSeekTooltip'],
]

const sourceRoots = ['apps', 'packages']
const sourceExtensions = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx'])
const ignoredDirectories = new Set([
  '.git',
  '.tanstack',
  'coverage',
  'dist',
  'dist-analyze',
  'node_modules',
  'storybook-static',
])

const failures = []

for (const check of requiredCompilerWiring) {
  const absolutePath = path.join(rootDir, check.file)
  if (!existsSync(absolutePath)) {
    failures.push(`Missing React Compiler wiring file: ${check.file}`)
    continue
  }

  const content = readFileSync(absolutePath, 'utf8')
  for (const expectedText of check.contains) {
    if (!content.includes(expectedText)) {
      failures.push(`Expected ${check.file} to contain ${JSON.stringify(expectedText)}`)
    }
  }
}

const actualOptOuts = findUseNoMemoDirectives()
const expectedKeys = new Set(expectedOptOuts.map(([file, owner]) => toKey(file, owner)))
const actualKeys = new Set(actualOptOuts.map(optOut => toKey(optOut.file, optOut.owner)))

for (const expectedKey of expectedKeys) {
  if (!actualKeys.has(expectedKey)) {
    failures.push(`Missing expected React Compiler opt-out: ${expectedKey}`)
  }
}

for (const optOut of actualOptOuts) {
  const actualKey = toKey(optOut.file, optOut.owner)
  if (!expectedKeys.has(actualKey)) {
    failures.push(`Unexpected React Compiler opt-out: ${actualKey} at ${optOut.file}:${optOut.line}`)
  }
}

if (failures.length > 0) {
  console.error('React Compiler healthcheck failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`React Compiler healthcheck passed (${actualOptOuts.length} scoped opt-outs).`)

function findUseNoMemoDirectives() {
  return sourceRoots.flatMap(sourceRoot => {
    const absoluteSourceRoot = path.join(rootDir, sourceRoot)
    return existsSync(absoluteSourceRoot) ? scanDirectory(absoluteSourceRoot) : []
  })
}

function scanDirectory(directory) {
  const entries = readdirSync(directory)
  const optOuts = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry)
    const stats = statSync(absolutePath)

    if (stats.isDirectory()) {
      if (!ignoredDirectories.has(entry)) {
        optOuts.push(...scanDirectory(absolutePath))
      }
      continue
    }

    if (!stats.isFile() || !sourceExtensions.has(path.extname(entry))) {
      continue
    }

    const relativePath = toRepoPath(absolutePath)
    const lines = readFileSync(absolutePath, 'utf8').split(/\r?\n/)
    for (const [index, line] of lines.entries()) {
      if (!/['"]use no memo['"]/.test(line)) {
        continue
      }

      optOuts.push({
        file: relativePath,
        line: index + 1,
        owner: findNearestOwner(lines, index),
      })
    }
  }

  return optOuts
}

function findNearestOwner(lines, directiveIndex) {
  for (let index = directiveIndex; index >= 0 && directiveIndex - index < 160; index -= 1) {
    const line = lines[index]
    const functionMatch = line.match(/\bfunction\s+([A-Za-z_$][\w$]*)(?:<[^>{}]+>)?\s*\(/)
    if (functionMatch) {
      return functionMatch[1]
    }

    const forwardRefMatch = line.match(/\b(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*React\.forwardRef\b/)
    if (forwardRefMatch) {
      return forwardRefMatch[1]
    }
  }

  return '<unknown>'
}

function toRepoPath(absolutePath) {
  return path.relative(rootDir, absolutePath).split(path.sep).join('/')
}

function toKey(file, owner) {
  return `${file}#${owner}`
}
