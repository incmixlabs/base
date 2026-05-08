#!/usr/bin/env node
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { runReactCompilerHealthcheck } from '../packages/config/react-compiler-health.js'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

try {
  runReactCompilerHealthcheck({
    rootDir,
    requiredCompilerWiring: [
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
    ],
    expectedOptOuts: [
      ['packages/ui/src/elements/progress/Progress.tsx', 'Progress'],
      ['packages/ui/src/elements/sheet/Sheet.tsx', 'SheetContent'],
      ['packages/ui/src/form/FileUpload.tsx', 'FileUpload'],
      ['packages/ui/src/form/Rating.tsx', 'Rating'],
      ['packages/ui/src/layouts/masonry/Masonry.tsx', 'useResizeObserver'],
      ['packages/ui/src/layouts/masonry/Masonry.tsx', 'useThrottle'],
      ['packages/ui/src/lib/compose-refs.ts', 'useComposedRefs'],
      ['packages/ui/src/media/media-player/MediaPlayer.tsx', 'MediaPlayerSeekTooltip'],
    ],
  })
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
