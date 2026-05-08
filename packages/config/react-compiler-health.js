import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const defaultSourceRoots = ['apps', 'packages']
const defaultSourceExtensions = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx'])
const defaultIgnoredDirectories = new Set([
  '.git',
  '.tanstack',
  'coverage',
  'dist',
  'dist-analyze',
  'node_modules',
  'storybook-static',
])
const useNoMemoDirectivePattern = /^\s*['"]use no memo['"]\s*;?\s*$/

export function runReactCompilerHealthcheck({
  rootDir,
  requiredCompilerWiring,
  expectedOptOuts,
  sourceRoots = defaultSourceRoots,
  sourceExtensions = defaultSourceExtensions,
  ignoredDirectories = defaultIgnoredDirectories,
}) {
  const resolvedRootDir = path.resolve(rootDir)
  const failures = []

  for (const check of requiredCompilerWiring) {
    const absolutePath = path.join(resolvedRootDir, check.file)
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

  const actualOptOuts = findUseNoMemoDirectives({
    rootDir: resolvedRootDir,
    sourceRoots,
    sourceExtensions,
    ignoredDirectories,
  })
  for (const optOut of actualOptOuts) {
    if (optOut.owner === '<unknown>') {
      failures.push(`Could not infer React Compiler opt-out owner at ${optOut.file}:${optOut.line}`)
    }
  }

  const expectedKeys = new Set(expectedOptOuts.map(([file, owner]) => toKey(file, owner)))
  const actualKeys = new Set(
    actualOptOuts.filter(optOut => optOut.owner !== '<unknown>').map(optOut => toKey(optOut.file, optOut.owner)),
  )

  for (const expectedKey of expectedKeys) {
    if (!actualKeys.has(expectedKey)) {
      failures.push(`Missing expected React Compiler opt-out: ${expectedKey}`)
    }
  }

  for (const optOut of actualOptOuts) {
    if (optOut.owner === '<unknown>') {
      continue
    }

    const actualKey = toKey(optOut.file, optOut.owner)
    if (!expectedKeys.has(actualKey)) {
      failures.push(`Unexpected React Compiler opt-out: ${actualKey} at ${optOut.file}:${optOut.line}`)
    }
  }

  if (failures.length > 0) {
    throw new Error(['React Compiler healthcheck failed:', ...failures.map(failure => `- ${failure}`)].join('\n'))
  }

  console.log(`React Compiler healthcheck passed (${actualOptOuts.length} scoped opt-outs).`)
}

function findUseNoMemoDirectives({ rootDir, sourceRoots, sourceExtensions, ignoredDirectories }) {
  return sourceRoots.flatMap(sourceRoot => {
    const absoluteSourceRoot = path.join(rootDir, sourceRoot)
    return existsSync(absoluteSourceRoot)
      ? scanDirectory({
          directory: absoluteSourceRoot,
          rootDir,
          sourceExtensions,
          ignoredDirectories,
        })
      : []
  })
}

function scanDirectory({ directory, rootDir, sourceExtensions, ignoredDirectories }) {
  const entries = readdirSync(directory)
  const optOuts = []

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry)
    const stats = lstatSync(absolutePath)
    if (stats.isSymbolicLink()) {
      continue
    }

    if (stats.isDirectory()) {
      if (!ignoredDirectories.has(entry)) {
        optOuts.push(
          ...scanDirectory({
            directory: absolutePath,
            rootDir,
            sourceExtensions,
            ignoredDirectories,
          }),
        )
      }
      continue
    }

    if (!stats.isFile() || !sourceExtensions.has(path.extname(entry))) {
      continue
    }

    const relativePath = toRepoPath(rootDir, absolutePath)
    const lines = readFileSync(absolutePath, 'utf8').split(/\r?\n/)
    for (const [index, line] of lines.entries()) {
      if (!useNoMemoDirectivePattern.test(line)) {
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

    const arrowFunctionMatch = line.match(
      /\b(?:export\s+)?const\s+([A-Za-z_$][\w$]*)(?:\s*:\s*[^=]+)?\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/,
    )
    if (arrowFunctionMatch) {
      return arrowFunctionMatch[1]
    }
  }

  return '<unknown>'
}

function toRepoPath(rootDir, absolutePath) {
  return path.relative(rootDir, absolutePath).split(path.sep).join('/')
}

function toKey(file, owner) {
  return `${file}#${owner}`
}
