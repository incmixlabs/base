#!/usr/bin/env node
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isVarReference, sourceWindow, windowOffset } from './lib/source-window.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

const sourceRoots = ['packages/ui/src', 'packages/ui/uno.config.ts', 'packages/theme/src', 'packages/config']
const outputPath = path.join(repoRoot, 'docs/css-vars.md')
const sourceExtensions = new Set(['.css', '.js', '.mjs', '.cjs', '.ts', '.tsx'])
const cssVarPattern = /--[A-Za-z_][A-Za-z0-9_-]*/g
const ownershipBuckets = {
  af: 'AF-owned',
  publicTheme: 'Public theme surface',
  external: 'External/tooling',
  suspicious: 'Suspicious unowned',
}
const externalPrefixes = [
  { prefix: '--tw-', reason: 'Tailwind animation/runtime variable' },
  { prefix: '--un-', reason: 'UnoCSS runtime variable' },
  { prefix: '--radix-', reason: 'Radix UI runtime variable' },
]
const publicThemePrefixes = [
  { prefix: '--breakpoint-', reason: 'breakpoint token' },
  { prefix: '--chart-', reason: 'chart color token' },
  { prefix: '--code-', reason: 'typography code token' },
  { prefix: '--color-', reason: 'semantic color token' },
  { prefix: '--container-', reason: 'container size token' },
  { prefix: '--default-', reason: 'typography default token' },
  { prefix: '--em-', reason: 'typography emphasis token' },
  { prefix: '--font-size-', reason: 'font size token' },
  { prefix: '--font-weight-', reason: 'font weight token' },
  { prefix: '--heading-', reason: 'typography heading token' },
  { prefix: '--kbd-', reason: 'typography kbd token' },
  { prefix: '--letter-spacing-', reason: 'letter spacing token' },
  { prefix: '--line-height-', reason: 'line height token' },
  { prefix: '--quote-', reason: 'typography quote token' },
  { prefix: '--radius-', reason: 'radius token' },
  { prefix: '--shadow-', reason: 'shadow token' },
  { prefix: '--spacing-', reason: 'spacing token' },
  { prefix: '--strong-', reason: 'typography strong token' },
  { prefix: '--tab-', reason: 'typography tab token' },
  { prefix: '--theme-', reason: 'theme runtime bridge token' },
]
const publicThemeExact = new Map([
  ['--font-geist', 'font family token'],
  ['--font-geist-mono', 'font family token'],
  ['--font-mono', 'font family token'],
  ['--font-sans', 'font family token'],
  ['--font-serif', 'font family token'],
  ['--letter-spacing', 'letter spacing token'],
  ['--radius', 'radius base token'],
  ['--ring', 'focus ring token'],
  ['--scaling', 'theme scaling token'],
  ['--spacing', 'spacing base token'],
])
const hueNames = [
  'amber',
  'blue',
  'brown',
  'crimson',
  'cyan',
  'gold',
  'grass',
  'gray',
  'green',
  'indigo',
  'iris',
  'jade',
  'lime',
  'mint',
  'orange',
  'pink',
  'plum',
  'purple',
  'red',
  'ruby',
  'sand',
  'sky',
  'slate',
  'teal',
  'tomato',
  'violet',
  'yellow',
]
const huePrefixes = hueNames.map(hue => `--${hue}-`)

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

function isDeclaration(file, lines, lineIndex, start, name) {
  const line = lines[lineIndex]
  const source = sourceWindow(lines, lineIndex)
  const sourceIndex = windowOffset(lines, lineIndex, start)

  if (isVarReference(source, sourceIndex)) return false

  const before = source.slice(Math.max(0, sourceIndex - 120), sourceIndex)
  if (/(?:cssDeclaration|property|setProperty)\(\s*['"`][\s\S]*$/.test(before)) return true

  if (file.scope === 'test') return false

  const after = line.slice(start + name.length)
  if (/^\s*['"`\]]?\s*:/.test(after)) return true

  return false
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
        const source = sourceWindow(lines, lineIndex)
        const sourceIndex = windowOffset(lines, lineIndex, start)

        if (isDeclaration(file, lines, lineIndex, start, name)) {
          addLocation(entry.definedAt, file.relativePath, lineNumber)
        } else if (isVarReference(source, sourceIndex)) {
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

function ownershipForName(name) {
  if (name.startsWith('--af-')) {
    return { bucket: ownershipBuckets.af, reason: '`--af-` namespace' }
  }

  const externalPrefix = externalPrefixes.find(({ prefix }) => name.startsWith(prefix))
  if (externalPrefix) {
    return { bucket: ownershipBuckets.external, reason: externalPrefix.reason }
  }

  const exactReason = publicThemeExact.get(name)
  if (exactReason) {
    return { bucket: ownershipBuckets.publicTheme, reason: exactReason }
  }

  const publicThemePrefix = publicThemePrefixes.find(({ prefix }) => name.startsWith(prefix))
  if (publicThemePrefix) {
    return { bucket: ownershipBuckets.publicTheme, reason: publicThemePrefix.reason }
  }

  const huePrefix = huePrefixes.find(prefix => name.startsWith(prefix))
  if (huePrefix) {
    return { bucket: ownershipBuckets.publicTheme, reason: `${huePrefix.slice(2, -1)} hue scale token` }
  }

  return { bucket: ownershipBuckets.suspicious, reason: 'no recognized AF-owned, public theme, or external namespace' }
}

function hasProductionOrToolingDefinition(entry) {
  return [...entry.definedAt.keys()].some(file => !['test', 'storybook'].includes(fileScope(file)))
}

function hasProductionOrToolingLocation(locations) {
  return [...locations.keys()].some(file => !['test', 'storybook'].includes(fileScope(file)))
}

function countByOwnership(entries, getName) {
  const counts = new Map(Object.values(ownershipBuckets).map(bucket => [bucket, 0]))

  for (const entry of entries) {
    const name = getName(entry)
    const { bucket } = ownershipForName(name)
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1)
  }

  return counts
}

function ownershipSummaryRows(exactDefinedEntries, dynamicEntries) {
  const exactCounts = countByOwnership(exactDefinedEntries, entry => entry.name)
  const dynamicCounts = countByOwnership(dynamicEntries, ([pattern]) => pattern)

  return Object.values(ownershipBuckets).map(bucket => [
    bucket,
    exactCounts.get(bucket) ?? 0,
    dynamicCounts.get(bucket) ?? 0,
  ])
}

function exactOwnershipRows(entries) {
  return entries.map(entry => {
    const ownership = ownershipForName(entry.name)
    return [
      `\`${entry.name}\``,
      ownership.bucket,
      ownership.reason,
      formatLocationMap(entry.definedAt),
      formatLocationMap(entry.referencedAt),
    ]
  })
}

function dynamicOwnershipRows(entries) {
  return entries.map(([pattern, locations]) => {
    const ownership = ownershipForName(pattern)
    return [`\`${pattern}\``, ownership.bucket, ownership.reason, formatLocationMap(locations)]
  })
}

function buildReport({ vars, dynamicPatterns, files }) {
  const exactEntries = [...vars.values()]
    .filter(entry => entry.definedAt.size > 0 || entry.referencedAt.size > 0)
    .sort((left, right) => left.name.localeCompare(right.name))
  const exactProductionOrToolingDefinitions = exactEntries.filter(hasProductionOrToolingDefinition)
  const suspiciousExactDefinitions = exactProductionOrToolingDefinitions.filter(
    entry => ownershipForName(entry.name).bucket === ownershipBuckets.suspicious,
  )
  const publicThemeDefinitions = exactProductionOrToolingDefinitions.filter(
    entry => ownershipForName(entry.name).bucket === ownershipBuckets.publicTheme,
  )
  const externalDefinitions = exactProductionOrToolingDefinitions.filter(
    entry => ownershipForName(entry.name).bucket === ownershipBuckets.external,
  )

  const exactRows = exactOwnershipRows(exactEntries)

  const dynamicEntries = [...dynamicPatterns.entries()].sort(([left], [right]) => left.localeCompare(right))
  const dynamicProductionOrToolingEntries = dynamicEntries.filter(([, locations]) =>
    hasProductionOrToolingLocation(locations),
  )
  const dynamicRows = dynamicOwnershipRows(dynamicEntries)
  const suspiciousDynamicEntries = dynamicProductionOrToolingEntries.filter(
    ([pattern]) => ownershipForName(pattern).bucket === ownershipBuckets.suspicious,
  )
  const publicThemeDynamicEntries = dynamicProductionOrToolingEntries.filter(
    ([pattern]) => ownershipForName(pattern).bucket === ownershipBuckets.publicTheme,
  )
  const externalDynamicEntries = dynamicProductionOrToolingEntries.filter(
    ([pattern]) => ownershipForName(pattern).bucket === ownershipBuckets.external,
  )

  return `# CSS Variable Audit

Generated by \`pnpm audit:css-vars\`.

## Scope

- Source roots: \`${sourceRoots.join('`, `')}\`
- File extensions: \`${[...sourceExtensions].join('`, `')}\`
- Files scanned: ${files.length}
- Exact CSS variables listed: ${exactEntries.length}
- Dynamic CSS variable patterns listed: ${dynamicRows.length}
- Dynamic production/tooling patterns listed: ${dynamicProductionOrToolingEntries.length}
- Suspicious unowned exact production/tooling definitions: ${suspiciousExactDefinitions.length}
- Suspicious unowned dynamic production/tooling patterns: ${suspiciousDynamicEntries.length}

## Notes

- A variable is listed as defined when it appears as a custom property declaration, style object key, \`property(...)\`, \`cssDeclaration(...)\`, or \`setProperty(...)\`.
- A variable is listed as referenced when it appears inside \`var(--...)\`.
- Template-built variable names cannot always be expanded safely, so those are listed separately under dynamic patterns.
- Ownership buckets separate AF-owned variables, known first-party public theme variables, external/tooling variables, and suspicious unowned names.
- Public theme surface means the variable belongs to the current product/theme API and should be migrated or kept intentionally. It is not an automatic exemption from future \`--af-\` prefix work.
- Suspicious exact definitions are variables this scanner sees as defined in production/tooling repository source without a recognized AF-owned, public theme, or external namespace.
- Suspicious dynamic patterns apply the same ownership check to production/tooling source locations. Test-only patterns remain visible in the full dynamic table.

## Ownership Summary

${markdownTable(['Ownership', 'Exact production/tooling definitions', 'Dynamic production/tooling patterns'], ownershipSummaryRows(exactProductionOrToolingDefinitions, dynamicProductionOrToolingEntries))}

## Suspicious Unowned Defined Variables

${suspiciousExactDefinitions.length > 0 ? markdownTable(['Variable', 'Ownership', 'Reason', 'Defined at', 'Referenced at'], exactOwnershipRows(suspiciousExactDefinitions)) : '_No suspicious unowned defined variables found._'}

## Suspicious Unowned Dynamic Patterns

${suspiciousDynamicEntries.length > 0 ? markdownTable(['Pattern', 'Ownership', 'Reason', 'Locations'], dynamicOwnershipRows(suspiciousDynamicEntries)) : '_No suspicious unowned dynamic patterns found._'}

## Public Theme Defined Variables

${publicThemeDefinitions.length > 0 ? markdownTable(['Variable', 'Ownership', 'Reason', 'Defined at', 'Referenced at'], exactOwnershipRows(publicThemeDefinitions)) : '_No public theme defined variables found._'}

## Public Theme Dynamic Patterns

${publicThemeDynamicEntries.length > 0 ? markdownTable(['Pattern', 'Ownership', 'Reason', 'Locations'], dynamicOwnershipRows(publicThemeDynamicEntries)) : '_No public theme dynamic patterns found._'}

## External/Tooling Defined Variables

${externalDefinitions.length > 0 ? markdownTable(['Variable', 'Ownership', 'Reason', 'Defined at', 'Referenced at'], exactOwnershipRows(externalDefinitions)) : '_No external/tooling defined variables found._'}

## External/Tooling Dynamic Patterns

${externalDynamicEntries.length > 0 ? markdownTable(['Pattern', 'Ownership', 'Reason', 'Locations'], dynamicOwnershipRows(externalDynamicEntries)) : '_No external/tooling dynamic patterns found._'}

## Exact CSS Variables

${markdownTable(['Variable', 'Ownership', 'Reason', 'Defined at', 'Referenced at'], exactRows)}

## Dynamic CSS Variable Patterns

${dynamicRows.length > 0 ? markdownTable(['Pattern', 'Ownership', 'Reason', 'Locations'], dynamicRows) : '_No dynamic patterns found._'}
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
