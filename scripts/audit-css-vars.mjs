#!/usr/bin/env node
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

const sourceRoots = ['packages/ui/src', 'packages/ui/uno.config.ts', 'packages/theme/src', 'packages/config']
const outputPath = path.join(repoRoot, 'docs/css-vars.md')
const sourceExtensions = new Set(['.css', '.js', '.mjs', '.cjs', '.ts', '.tsx'])
const cssVarPattern = /--[A-Za-z_][A-Za-z0-9_-]*/g

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/')
}

function walkSource(root, out = []) {
  const fullRoot = path.join(repoRoot, root)
  const stats = statSync(fullRoot)

  if (stats.isFile()) {
    if (sourceExtensions.has(path.extname(fullRoot))) out.push(fullRoot)
    return out
  }

  for (const entry of readdirSync(fullRoot)) {
    if (entry === 'dist' || entry === 'node_modules' || entry === '.turbo' || entry === 'coverage') continue

    const fullPath = path.join(fullRoot, entry)
    const entryStats = statSync(fullPath)
    if (entryStats.isDirectory()) {
      walkSource(toPosix(path.relative(repoRoot, fullPath)), out)
      continue
    }

    if (sourceExtensions.has(path.extname(entry))) out.push(fullPath)
  }

  return out
}

function fileScope(relativePath) {
  if (/(^|\/)storybook\//.test(relativePath) || /\.stories\.[jt]sx?$/.test(relativePath)) return 'storybook'
  if (/(^|\/)__tests__\//.test(relativePath) || /\.test\.[jt]sx?$/.test(relativePath)) return 'test'
  if (relativePath.includes('/scripts/') || /(^|\/)[^.]+\.config\.[cm]?[jt]s$/.test(relativePath)) return 'tooling'
  return 'production'
}

function readSourceFiles() {
  return sourceRoots
    .flatMap(root => walkSource(root))
    .map(fullPath => {
      const relativePath = toPosix(path.relative(repoRoot, fullPath))
      return {
        fullPath,
        relativePath,
        scope: fileScope(relativePath),
        text: readFileSync(fullPath, 'utf8'),
      }
    })
}

function addLocation(locations, file, line) {
  const existing = locations.get(file)
  if (existing) {
    existing.add(line)
    return
  }

  locations.set(file, new Set([line]))
}

function isDeclaration(file, line, start, name) {
  const before = line.slice(0, start)
  const linePrefix = before.slice(Math.max(0, before.length - 80))
  if (/(?:cssDeclaration|property|setProperty)\(\s*['"`][^'"`]*$/.test(linePrefix)) return true

  if (file.scope === 'test') return false

  const after = line.slice(start + name.length)
  if (/^\s*['"`\]]?\s*:/.test(after)) return true

  return false
}

function isVarReference(line, start) {
  const before = line.slice(0, start)
  const lastVarCall = before.lastIndexOf('var(')
  if (lastVarCall === -1) return false

  const between = before.slice(lastVarCall + 'var('.length)
  return !between.includes(')')
}

function collectExactVars(files) {
  const vars = new Map()

  for (const file of files) {
    const lines = file.text.split(/\r?\n/)
    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return

      for (const match of line.matchAll(cssVarPattern)) {
        const name = match[0]
        const start = match.index ?? 0
        if (line.slice(start + name.length, start + name.length + 2) === '${') continue

        const entry = vars.get(name) ?? {
          name,
          definedAt: new Map(),
          referencedAt: new Map(),
          mentionedAt: new Map(),
        }

        const lineNumber = lineIndex + 1
        if (isDeclaration(file, line, start, name)) {
          addLocation(entry.definedAt, file.relativePath, lineNumber)
        } else if (isVarReference(line, start)) {
          addLocation(entry.referencedAt, file.relativePath, lineNumber)
        } else {
          addLocation(entry.mentionedAt, file.relativePath, lineNumber)
        }

        vars.set(name, entry)
      }
    })
  }

  return vars
}

function normalizeTemplatePattern(value) {
  return value.replace(/\$\{[^}]+\}/g, '<dynamic>')
}

function collectDynamicPatterns(files) {
  const patterns = new Map()

  for (const file of files) {
    const lines = file.text.split(/\r?\n/)
    lines.forEach((line, lineIndex) => {
      if (!line.includes('--')) return

      const candidates = [
        ...line.matchAll(/--[A-Za-z_][A-Za-z0-9_-]*(?:\$\{[^}]+\}[A-Za-z0-9_-]*)+/g),
        ...line.matchAll(/var\(--[A-Za-z_][A-Za-z0-9_-]*['"`]\s*,/g),
        ...line.matchAll(/joinClass\(['"`]var\(--[A-Za-z_][A-Za-z0-9_-]*/g),
      ].map(match => normalizeTemplatePattern(match[0].replace(/^joinClass\(['"`]var\(/, '').replace(/^var\(/, '')))

      for (const pattern of candidates) {
        const normalized = pattern.replace(/[,'"`]+$/g, '')
        const entry = patterns.get(normalized) ?? new Map()
        addLocation(entry, file.relativePath, lineIndex + 1)
        patterns.set(normalized, entry)
      }
    })
  }

  return patterns
}

function formatLocationMap(locations) {
  if (locations.size === 0) return ''

  return [...locations.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([file, lines]) => `${file}:${[...lines].sort((left, right) => left - right).join(',')}`)
    .join('<br>')
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(cell => String(cell).replace(/\|/g, '\\|')).join(' | ')} |`),
  ].join('\n')
}

function buildReport({ vars, dynamicPatterns, files }) {
  const exactEntries = [...vars.values()]
    .filter(entry => entry.definedAt.size > 0 || entry.referencedAt.size > 0)
    .sort((left, right) => left.name.localeCompare(right.name))
  const exactDefinitionsWithoutAfPrefix = exactEntries.filter(
    entry =>
      !entry.name.startsWith('--af-') &&
      [...entry.definedAt.keys()].some(file => !['test', 'storybook'].includes(fileScope(file))),
  )

  const exactRows = exactEntries.map(entry => [
    `\`${entry.name}\``,
    formatLocationMap(entry.definedAt),
    formatLocationMap(entry.referencedAt),
  ])

  const dynamicEntries = [...dynamicPatterns.entries()].sort(([left], [right]) => left.localeCompare(right))
  const dynamicRows = dynamicEntries.map(([pattern, locations]) => [`\`${pattern}\``, formatLocationMap(locations)])
  const dynamicPatternsWithoutAfPrefix = dynamicEntries.filter(([pattern]) => !pattern.startsWith('--af-'))
  const missingPrefixRows = exactDefinitionsWithoutAfPrefix.map(entry => [
    `\`${entry.name}\``,
    formatLocationMap(entry.definedAt),
    formatLocationMap(entry.referencedAt),
  ])
  const dynamicMissingPrefixRows = dynamicPatternsWithoutAfPrefix.map(([pattern, locations]) => [
    `\`${pattern}\``,
    formatLocationMap(locations),
  ])

  return `# CSS Variable Audit

Generated by \`pnpm audit:css-vars\`.

## Scope

- Source roots: \`${sourceRoots.join('`, `')}\`
- File extensions: \`${[...sourceExtensions].join('`, `')}\`
- Files scanned: ${files.length}
- Exact CSS variables listed: ${exactEntries.length}
- Dynamic CSS variable patterns listed: ${dynamicRows.length}
- Exact production/tooling defined variables missing \`--af-\` prefix: ${exactDefinitionsWithoutAfPrefix.length}
- Dynamic variable patterns missing \`--af-\` prefix: ${dynamicPatternsWithoutAfPrefix.length}

## Notes

- A variable is listed as defined when it appears as a custom property declaration, style object key, \`property(...)\`, \`cssDeclaration(...)\`, or \`setProperty(...)\`.
- A variable is listed as referenced when it appears inside \`var(--...)\`.
- Template-built variable names cannot always be expanded safely, so those are listed separately under dynamic patterns.
- Prefix checks apply to variables this scanner sees as defined in production/tooling repository source. Non-\`--af-\` definitions are listed below for cleanup review.

## Defined Variables Missing \`--af-\` Prefix

${missingPrefixRows.length > 0 ? markdownTable(['Variable', 'Defined at', 'Referenced at'], missingPrefixRows) : '_No exact defined variables missing the `--af-` prefix._'}

## Dynamic Patterns Missing \`--af-\` Prefix

${dynamicMissingPrefixRows.length > 0 ? markdownTable(['Pattern', 'Locations'], dynamicMissingPrefixRows) : '_No dynamic patterns missing the `--af-` prefix._'}

## Exact CSS Variables

${markdownTable(['Variable', 'Defined at', 'Referenced at'], exactRows)}

## Dynamic CSS Variable Patterns

${dynamicRows.length > 0 ? markdownTable(['Pattern', 'Locations'], dynamicRows) : '_No dynamic patterns found._'}
`
}

const files = readSourceFiles()
const vars = collectExactVars(files)
const dynamicPatterns = collectDynamicPatterns(files)
const report = buildReport({ vars, dynamicPatterns, files })

writeFileSync(outputPath, report)

console.log(`Wrote ${toPosix(path.relative(repoRoot, outputPath))}`)
console.log(`Files scanned: ${files.length}`)
console.log(
  `Exact CSS variables: ${[...vars.values()].filter(entry => entry.definedAt.size > 0 || entry.referencedAt.size > 0).length}`,
)
console.log(`Dynamic CSS variable patterns: ${dynamicPatterns.size}`)
