import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))

async function copyAsset(source, target) {
  await mkdir(dirname(target), { recursive: true })
  await cp(source, target, { recursive: true })
}

await copyAsset(join(packageRoot, 'src/globals.css'), join(packageRoot, 'dist/globals.css'))
await copyAsset(join(packageRoot, 'src/theme/design-tokens.css'), join(packageRoot, 'dist/theme/design-tokens.css'))
await copyAsset(join(packageRoot, 'src/theme/reset.css'), join(packageRoot, 'dist/theme/reset.css'))
await copyAsset(join(packageRoot, 'src/theme/animations.css'), join(packageRoot, 'dist/theme/animations.css'))

await rm(join(packageRoot, 'dist/fonts'), { recursive: true, force: true })
await copyAsset(join(packageRoot, 'src/fonts'), join(packageRoot, 'dist/fonts'))
