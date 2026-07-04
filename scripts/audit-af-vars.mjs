#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')

const sourceRoots = ['packages/ui/src', 'packages/theme/src']
const outputPath = path.join(repoRoot, 'docs/af-vars-audit.md')
const contractPath = path.join(repoRoot, 'packages/theme/src/contract/theme-contract.ts')
const componentVarsPath = path.join(repoRoot, 'packages/ui/src/theme/runtime/component-vars.ts')

const exactVarPattern = /--af-[A-Za-z0-9_-]+/g
const sourceExtensions = new Set(['.css', '.mjs', '.ts', '.tsx'])

const keepExactPrefixes = [
  '--af-app-shell-',
  '--af-card-padding-',
  '--af-content-body-',
  '--af-ease-',
  '--af-floating-surface-arrow-',
  '--af-motion-',
  '--af-story-',
]

const keepContractComponents = new Set(['appShell'])
const replaceContractComponents = new Set([
  'date',
  'fieldGroup',
  'fileUpload',
  'pickerPopup',
  'progress',
  'rating',
  'scrollArea',
  'slider',
  'switch',
])

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/')
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.turbo') continue

    const fullPath = path.join(dir, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      walkFiles(fullPath, out)
      continue
    }

    if (!sourceExtensions.has(path.extname(entry))) continue
    out.push(fullPath)
  }

  return out
}

function fileScope(relativePath) {
  if (/(^|\/)storybook\//.test(relativePath) || /\.stories\.[jt]sx?$/.test(relativePath)) return 'storybook'
  if (/(^|\/)__tests__\//.test(relativePath) || /\.test\.[jt]sx?$/.test(relativePath)) return 'test'
  return 'production'
}

function addMapSet(map, key, value) {
  const existing = map.get(key)
  if (existing) {
    existing.add(value)
    return
  }

  map.set(key, new Set([value]))
}

function sourceWindow(lines, lineIndex, radius = 3) {
  const start = Math.max(0, lineIndex - radius)
  const end = Math.min(lines.length, lineIndex + radius + 1)
  return lines.slice(start, end).join('\n')
}

function windowOffset(lines, lineIndex, index, radius = 3) {
  const start = Math.max(0, lineIndex - radius)
  const previous = lines.slice(start, lineIndex).join('\n')
  return previous.length + (previous.length > 0 ? 1 : 0) + index
}

function isVarReference(source, index) {
  const before = source.slice(0, index)
  const lastVarCall = before.lastIndexOf('var(')
  if (lastVarCall === -1) return false

  const between = before.slice(lastVarCall + 'var('.length)
  return !between.includes(')')
}

function lineRole(lines, lineIndex, index, name) {
  const line = lines[lineIndex]
  const source = sourceWindow(lines, lineIndex)
  const sourceIndex = windowOffset(lines, lineIndex, index)
  const before = source.slice(Math.max(0, sourceIndex - 120), sourceIndex)
  const after = source.slice(sourceIndex + name.length, sourceIndex + name.length + 80)
  const roles = new Set()

  if (isVarReference(source, sourceIndex)) roles.add('consume')
  if (after.trimStart().startsWith(':')) roles.add('declare')
  if (
    roles.size === 0 &&
    /(?:setProperty|cssDeclaration|property)\(\s*['"`][\s\S]*$/.test(before) &&
    !isVarReference(source, sourceIndex)
  ) {
    roles.add('declare')
  }
  if (line.includes('expect(')) roles.add('assert')
  if (roles.size === 0) roles.add('reference')

  return [...roles]
}

function readSourceFiles() {
  return sourceRoots
    .flatMap(root => walkFiles(path.join(repoRoot, root)))
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

function collectExactVars(files) {
  const vars = new Map()

  for (const file of files) {
    const lines = file.text.split(/\r?\n/)
    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return

      for (const match of line.matchAll(exactVarPattern)) {
        const name = match[0]
        const entry = vars.get(name) ?? {
          name,
          scopes: new Set(),
          roles: new Set(),
          files: new Map(),
          occurrences: [],
        }

        entry.scopes.add(file.scope)
        const roles = lineRole(lines, lineIndex, match.index ?? 0, name)
        for (const role of roles) {
          entry.roles.add(role)
        }
        addMapSet(entry.files, file.relativePath, lineIndex + 1)
        entry.occurrences.push({
          file: file.relativePath,
          line: lineIndex + 1,
          scope: file.scope,
          roles,
          text: line.trim(),
        })
        vars.set(name, entry)
      }
    })
  }

  return vars
}

function collectDynamicHelperLines(files) {
  const helperLines = []

  for (const file of files) {
    const lines = file.text.split(/\r?\n/)
    lines.forEach((line, index) => {
      if (!line.includes('--af-')) return
      if (!line.includes('${') && !line.includes('joinClass(') && !line.includes('withFallback(')) return
      helperLines.push({
        file: file.relativePath,
        line: index + 1,
        scope: file.scope,
        text: line.trim(),
      })
    })
  }

  return helperLines
}

function collectRuntimeDynamicPrefixes(dynamicHelperLines) {
  const skippedRuntimeHelpers = [
    'packages/theme/src/runtime/theme-compiler.ts',
    'packages/ui/src/theme/ThemeProvider.tsx',
    'packages/ui/src/theme/helpers/responsive-custom-properties.ts',
    'packages/ui/src/theme/runtime/component-vars.ts',
  ]
  const prefixes = new Set()

  for (const line of dynamicHelperLines) {
    if (line.scope !== 'production') continue
    if (skippedRuntimeHelpers.includes(line.file)) continue

    for (const match of line.text.matchAll(/--af-[A-Za-z0-9_-]*\$\{/g)) {
      prefixes.add(match[0].replace(/\$\{$/, ''))
    }
    for (const match of line.text.matchAll(/joinClass\(['"`]var\((--af-[^'"`$]+)/g)) {
      prefixes.add(match[1])
    }
  }

  return [...prefixes].sort()
}

function findMatchingBrace(source, openIndex) {
  let depth = 0

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') depth += 1
    if (char === '}') {
      depth -= 1
      if (depth === 0) return index
    }
  }

  return -1
}

function extractTypeBody(source, typeName) {
  const marker = `export type ${typeName} =`
  const start = source.indexOf(marker)
  if (start === -1) return ''

  const open = source.indexOf('{', start)
  if (open === -1) return ''

  const close = findMatchingBrace(source, open)
  if (close === -1) return ''

  return source.slice(open + 1, close)
}

function extractNestedBlock(source, fieldName) {
  const marker = `${fieldName}:`
  const start = source.indexOf(marker)
  if (start === -1) return ''

  const open = source.indexOf('{', start)
  if (open === -1) return ''

  const close = findMatchingBrace(source, open)
  if (close === -1) return ''

  return source.slice(open + 1, close)
}

function propertyNames(block) {
  const names = []
  const propertyPattern = /^\s*([A-Za-z][A-Za-z0-9_]*)\??:\s*string\b/gm

  for (const match of block.matchAll(propertyPattern)) {
    names.push(match[1])
  }

  return names
}

function maskRanges(source, ranges) {
  const chars = [...source]
  for (const [start, end] of ranges) {
    for (let index = start; index < end; index += 1) {
      chars[index] = ' '
    }
  }
  return chars.join('')
}

function parseComponentTokenType(component, typeName, contractSource) {
  const body = extractTypeBody(contractSource, typeName)
  const ranges = []
  const slots = []

  if (!body) return slots

  const recordPattern = /([A-Za-z][A-Za-z0-9_]*)\?:\s*Record<[\s\S]*?Partial<\{([\s\S]*?)\}>\s*>/g
  for (const match of body.matchAll(recordPattern)) {
    const branch = match[1]
    const branchBody = match[2]
    ranges.push([match.index ?? 0, (match.index ?? 0) + match[0].length])

    for (const slot of propertyNames(branchBody)) {
      slots.push({
        component,
        path: `component.${component}.${branch}.<key>.${slot}`,
        pattern: `--af-${toKebabCase(component)}-${toKebabCase(branch)}-<key>-${toKebabCase(slot)}`,
      })
    }
  }

  const groupPattern = /([A-Za-z][A-Za-z0-9_]*)\?:\s*Partial<\{([\s\S]*?)\}>/g
  for (const match of body.matchAll(groupPattern)) {
    const branch = match[1]
    const branchBody = match[2]
    ranges.push([match.index ?? 0, (match.index ?? 0) + match[0].length])

    for (const slot of propertyNames(branchBody)) {
      slots.push({
        component,
        path: `component.${component}.${branch}.${slot}`,
        pattern: `--af-${toKebabCase(component)}-${toKebabCase(branch)}-${toKebabCase(slot)}`,
      })
    }
  }

  const directBody = maskRanges(body, ranges)
  for (const slot of propertyNames(directBody)) {
    slots.push({
      component,
      path: `component.${component}.${slot}`,
      pattern: `--af-${toKebabCase(component)}-${toKebabCase(slot)}`,
    })
  }

  return slots
}

function collectContractSlots() {
  const contractSource = readFileSync(contractPath, 'utf8')
  const themeBody = extractTypeBody(contractSource, 'ThemeContract')
  const componentBody = extractNestedBlock(themeBody, 'component')
  const componentPattern = /^\s*([A-Za-z][A-Za-z0-9_]*):\s*([A-Za-z][A-Za-z0-9_]*ComponentTokens)\b/gm
  const slots = []

  for (const match of componentBody.matchAll(componentPattern)) {
    const component = match[1]
    const typeName = match[2]
    slots.push(...parseComponentTokenType(component, typeName, contractSource))
  }

  return slots
}

function extractFunctionBody(source, functionName) {
  const marker = `export function ${functionName}`
  const start = source.indexOf(marker)
  if (start === -1) return ''

  const open = source.indexOf('{', start)
  if (open === -1) return ''

  const close = findMatchingBrace(source, open)
  if (close === -1) return ''

  return source.slice(open + 1, close)
}

function collectRuntimeHelperPrefixes(files) {
  if (!existsSync(componentVarsPath)) return []

  const source = readFileSync(componentVarsPath, 'utf8')
  const functionPattern = /export function ([A-Za-z][A-Za-z0-9_]*)\(/g
  const helpers = []
  const productionText = files
    .filter(file => file.scope === 'production' && file.fullPath !== componentVarsPath)
    .map(file => file.text)
    .join('\n')

  for (const match of source.matchAll(functionPattern)) {
    const name = match[1]
    const body = extractFunctionBody(source, name)
    if (!body.includes('--af-') && !body.includes('componentSizeVar(') && !body.includes('componentVar(')) continue

    const prefixes = new Set()
    for (const prefixMatch of body.matchAll(/`(--af-[^`$]*)\$\{/g)) {
      prefixes.add(prefixMatch[1])
    }
    for (const prefixMatch of body.matchAll(/withFallback\(`(--af-[^`$]*)\$\{/g)) {
      prefixes.add(prefixMatch[1])
    }
    for (const prefixMatch of body.matchAll(/componentSizeVar\('([^']+)'/g)) {
      prefixes.add(`--af-${toKebabCase(prefixMatch[1])}-size-`)
    }
    for (const prefixMatch of body.matchAll(/componentVar\('([^']+)'/g)) {
      prefixes.add(`--af-${toKebabCase(prefixMatch[1])}-`)
    }

    if (prefixes.size === 0) continue

    helpers.push({
      name,
      prefixes: [...prefixes].sort(),
      usedInProduction: new RegExp(`\\b${escapeRegExp(name)}\\s*\\(`).test(productionText),
    })
  }

  return helpers
}

function patternToRegex(pattern) {
  return new RegExp(`^${escapeRegExp(pattern).replace(/<key>/g, '[A-Za-z0-9_-]+')}$`)
}

function patternPrefixes(pattern) {
  if (!pattern.includes('<key>')) return [pattern]
  const [prefix] = pattern.split('<key>')
  return [prefix]
}

function hasProductionRuntime(entry) {
  return entry.occurrences.some(
    occurrence =>
      occurrence.scope === 'production' &&
      (occurrence.roles.includes('consume') ||
        occurrence.roles.includes('declare') ||
        occurrence.roles.includes('reference')),
  )
}

function exactCategory(entry) {
  if (entry.name.endsWith('-')) return 'helper-prefix'

  if (!entry.scopes.has('production')) {
    if (entry.scopes.has('storybook')) return 'storybook-only'
    return 'test-only'
  }

  if (entry.occurrences.some(occurrence => occurrence.scope === 'production' && occurrence.roles.includes('consume'))) {
    return 'runtime-consumed'
  }

  return 'runtime-declared-or-referenced'
}

function suggestedActionForExact(name, category) {
  if (category === 'test-only') return 'delete'
  if (category === 'storybook-only') return 'keep'
  if (category === 'helper-prefix' && keepExactPrefixes.some(prefix => name.startsWith(prefix))) return 'keep'
  if (category === 'helper-prefix') return 'replace'
  if (keepExactPrefixes.some(prefix => name.startsWith(prefix))) return 'keep'
  return 'replace'
}

function suggestedActionForContract(slot, status) {
  if (status === 'contract-only') return 'delete'
  if (keepContractComponents.has(slot.component)) return 'keep'
  if (replaceContractComponents.has(slot.component)) return 'replace'
  return 'delete'
}

function classifyContractSlots(slots, exactVars, helpers, runtimeDynamicPrefixes) {
  const exactEntries = [...exactVars.values()]
  const activeHelperPrefixes = helpers
    .filter(helper => helper.usedInProduction)
    .flatMap(helper => helper.prefixes.map(prefix => ({ helper: helper.name, prefix })))

  return slots.map(slot => {
    const regex = patternToRegex(slot.pattern)
    const exactMatches = exactEntries.filter(entry => regex.test(entry.name))
    const productionMatches = exactMatches.filter(hasProductionRuntime)
    const helperMatches = activeHelperPrefixes.filter(helper =>
      patternPrefixes(slot.pattern).some(
        prefix => prefix.startsWith(helper.prefix) || helper.prefix.startsWith(prefix),
      ),
    )
    const dynamicMatches = runtimeDynamicPrefixes.filter(dynamicPrefix =>
      patternPrefixes(slot.pattern).some(
        prefix => prefix.startsWith(dynamicPrefix) || dynamicPrefix.startsWith(prefix),
      ),
    )
    const status =
      productionMatches.length > 0 || helperMatches.length > 0 || dynamicMatches.length > 0
        ? 'runtime-consumed'
        : 'contract-only'

    return {
      ...slot,
      status,
      action: suggestedActionForContract(slot, status),
      exactMatches: productionMatches.map(entry => entry.name).sort(),
      helpers: helperMatches.map(match => match.helper).sort(),
      dynamicPrefixes: dynamicMatches,
    }
  })
}

function formatFiles(files) {
  return [...files.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(
      ([file, lines]) =>
        `${file}:${[...lines]
          .sort((left, right) => left - right)
          .slice(0, 4)
          .join(',')}`,
    )
    .join('<br>')
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(cell => String(cell).replace(/\|/g, '\\|')).join(' | ')} |`),
  ].join('\n')
}

function groupName(varName) {
  return varName.replace(/^--af-/, '').split('-')[0] ?? 'unknown'
}

function buildReport({ exactVars, dynamicHelperLines, helpers, runtimeDynamicPrefixes, contractSlots }) {
  const exactEntries = [...exactVars.values()].sort((left, right) => left.name.localeCompare(right.name))
  const exactRows = exactEntries.map(entry => {
    const category = exactCategory(entry)
    return [
      `\`${entry.name}\``,
      category,
      suggestedActionForExact(entry.name, category),
      [...entry.roles].sort().join(', '),
      [...entry.scopes].sort().join(', '),
      formatFiles(entry.files),
    ]
  })

  const productionEntries = exactEntries.filter(entry => entry.scopes.has('production'))
  const byGroup = new Map()
  for (const entry of productionEntries) {
    const group = groupName(entry.name)
    byGroup.set(group, (byGroup.get(group) ?? 0) + 1)
  }

  const contractByComponent = new Map()
  for (const slot of contractSlots) {
    const entry = contractByComponent.get(slot.component) ?? {
      total: 0,
      runtime: 0,
      contractOnly: 0,
      keep: 0,
      replace: 0,
      delete: 0,
    }

    entry.total += 1
    if (slot.status === 'runtime-consumed') entry.runtime += 1
    if (slot.status === 'contract-only') entry.contractOnly += 1
    entry[slot.action] += 1
    contractByComponent.set(slot.component, entry)
  }

  const summaryRows = [...contractByComponent.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([component, entry]) => [
      `\`${component}\``,
      entry.total,
      entry.runtime,
      entry.contractOnly,
      entry.keep,
      entry.replace,
      entry.delete,
    ])

  const contractRows = contractSlots
    .sort((left, right) => left.pattern.localeCompare(right.pattern))
    .map(slot => [
      `\`${slot.pattern}\``,
      `\`${slot.path}\``,
      slot.status,
      slot.action,
      slot.helpers.length > 0 ? slot.helpers.map(helper => `\`${helper}\``).join(', ') : '',
      slot.dynamicPrefixes.length > 0 ? slot.dynamicPrefixes.map(prefix => `\`${prefix}\``).join(', ') : '',
      slot.exactMatches.length > 0 ? slot.exactMatches.map(name => `\`${name}\``).join('<br>') : '',
    ])

  const helperRows = helpers.map(helper => [
    `\`${helper.name}\``,
    helper.usedInProduction ? 'yes' : 'no',
    helper.prefixes.map(prefix => `\`${prefix}\``).join('<br>'),
  ])

  const dynamicRows = dynamicHelperLines.map(line => [
    `${line.file}:${line.line}`,
    line.scope,
    `\`${line.text.replace(/`/g, '\\`')}\``,
  ])

  const groupRows = [...byGroup.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([group, count]) => [`\`${group}\``, count])

  const testOnly = exactEntries.filter(entry => exactCategory(entry) === 'test-only').length
  const storybookOnly = exactEntries.filter(entry => exactCategory(entry) === 'storybook-only').length
  const helperPrefix = exactEntries.filter(entry => exactCategory(entry) === 'helper-prefix').length
  const runtimeConsumed = exactEntries.filter(entry => exactCategory(entry) === 'runtime-consumed').length
  const runtimeReferenced = exactEntries.filter(
    entry => exactCategory(entry) === 'runtime-declared-or-referenced',
  ).length
  const contractOnly = contractSlots.filter(slot => slot.status === 'contract-only').length
  const contractRuntime = contractSlots.filter(slot => slot.status === 'runtime-consumed').length

  return `# --af Var Audit

Generated by \`pnpm audit:af-vars\`.

## Scope

- Source roots: \`${sourceRoots.join('`, `')}\`
- Exact variable pattern: \`${exactVarPattern.source}\`
- Contract source: \`packages/theme/src/contract/theme-contract.ts\`
- Runtime helper source: \`packages/ui/src/theme/runtime/component-vars.ts\`

## Summary

- Exact unique \`--af-*\` names found in source: ${exactEntries.length}
- Exact production runtime-consumed names: ${runtimeConsumed}
- Exact production declared/referenced-only names: ${runtimeReferenced}
- Exact helper-prefix fragments from dynamic strings: ${helperPrefix}
- Exact test-only names: ${testOnly}
- Exact Storybook-only names: ${storybookOnly}
- ThemeContract \`component.*\` slots that compile to \`--af-*\`: ${contractSlots.length}
- Contract slots with a production runtime/helper match: ${contractRuntime}
- Contract-only slots with no production runtime/helper match: ${contractOnly}

## Action Rule

- \`delete\`: no production consumer, or test-only assertion for retired token plumbing.
- \`replace\`: production consumer exists, but the value looks like fixed component styling that should move to Uno/TW class maps unless a runtime theme use case is documented.
- \`keep\`: runtime layout/bridge/internal variable where a CSS variable is still justified. These still need documentation if they remain public theme contract surface.

## Contract Summary

${markdownTable(['Component', 'Contract slots', 'Runtime matched', 'Contract-only', 'Keep', 'Replace', 'Delete'], summaryRows)}

## Contract Slot Inventory

${markdownTable(['CSS var pattern', 'Theme path', 'Status', 'Action', 'Runtime helpers', 'Dynamic prefixes', 'Exact production matches'], contractRows)}

## Exact Production Groups

${markdownTable(['Group', 'Exact production names'], groupRows)}

## Runtime Helper Prefixes

${markdownTable(['Helper', 'Used in production', 'Prefixes'], helperRows)}

## Direct Dynamic Prefixes

${runtimeDynamicPrefixes.length > 0 ? runtimeDynamicPrefixes.map(prefix => `- \`${prefix}\``).join('\n') : 'None.'}

## Dynamic Helper Lines

${markdownTable(['Location', 'Scope', 'Line'], dynamicRows)}

## Exact Var Inventory

${markdownTable(['Var', 'Category', 'Action', 'Roles', 'Scopes', 'Locations'], exactRows)}
`
}

const files = readSourceFiles()
const exactVars = collectExactVars(files)
const dynamicHelperLines = collectDynamicHelperLines(files)
const runtimeDynamicPrefixes = collectRuntimeDynamicPrefixes(dynamicHelperLines)
const helpers = collectRuntimeHelperPrefixes(files)
const contractSlots = classifyContractSlots(collectContractSlots(), exactVars, helpers, runtimeDynamicPrefixes)
const report = buildReport({ exactVars, dynamicHelperLines, helpers, runtimeDynamicPrefixes, contractSlots })

writeFileSync(outputPath, report)

const exactCount = exactVars.size
const contractOnlyCount = contractSlots.filter(slot => slot.status === 'contract-only').length
const replaceCount = contractSlots.filter(slot => slot.action === 'replace').length

console.log(`Wrote ${path.relative(repoRoot, outputPath)}`)
console.log(`Exact --af-* names: ${exactCount}`)
console.log(`Contract-only slots: ${contractOnlyCount}`)
console.log(`Contract slots marked replace: ${replaceCount}`)
