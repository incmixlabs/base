import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildStaticSemanticLaneCss } from '../src/theme/semantic-lane-vars.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CSS_PATH = resolve(ROOT, 'src/theme/design-tokens.css')

function replaceRange(css: string, startMarker: string, endMarker: string, replacement: string) {
  const start = css.indexOf(startMarker)
  const end = css.indexOf(endMarker, start)
  if (start === -1 || end === -1) {
    throw new Error(`Failed to replace CSS range between "${startMarker}" and "${endMarker}"`)
  }
  const lineStart = css.lastIndexOf('\n', start) + 1
  const endLineStart = css.lastIndexOf('\n', end) + 1
  return `${css.slice(0, lineStart)}${replacement}\n\n${css.slice(endLineStart)}`
}

function main() {
  const css = readFileSync(CSS_PATH, 'utf8')

  const lightSemanticCss = buildStaticSemanticLaneCss('light', 'root')
  const mediaDarkSemanticCss = buildStaticSemanticLaneCss('dark', 'media-dark')
  const classDarkSemanticCss = buildStaticSemanticLaneCss('dark', 'class-dark')

  const withRootSemanticCss = replaceRange(
    css,
    '/* Primary Colors (semantic teal lane, independent from theme accent) */',
    '/* Panel glass highlight (light/dark adaptive) */',
    lightSemanticCss,
  )

  const withMediaDarkSemanticCss = replaceRange(
    withRootSemanticCss,
    '/* Primary Colors (semantic teal lane) — Dark */',
    '--color-panel-highlight:',
    mediaDarkSemanticCss,
  )

  const classBlockMarker = ':is(.dark, .dark-theme) {'
  const classBlockStart = withMediaDarkSemanticCss.indexOf(classBlockMarker)
  if (classBlockStart === -1) {
    throw new Error('Unable to locate class-based dark mode block')
  }

  const beforeClassBlock = withMediaDarkSemanticCss.slice(0, classBlockStart)
  const classBlockCss = withMediaDarkSemanticCss.slice(classBlockStart)
  const updatedClassBlock = replaceRange(
    classBlockCss,
    '/* Primary Colors (semantic teal lane) — Dark */',
    '--color-panel-highlight:',
    classDarkSemanticCss,
  )
  const withClassDarkSemanticCss = beforeClassBlock + updatedClassBlock

  writeFileSync(CSS_PATH, withClassDarkSemanticCss)
  console.log(`Updated ${CSS_PATH}`)
}

main()
