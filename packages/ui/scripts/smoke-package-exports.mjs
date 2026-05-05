import { readFile } from 'node:fs/promises'

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
const specs = Object.keys(pkg.exports)
  .filter(exportPath => !exportPath.includes('*'))
  .map(exportPath => (exportPath === '.' ? '@incmix/ui' : `@incmix/ui/${exportPath.slice(2)}`))

for (const spec of specs) {
  try {
    await import(spec)
    console.log(`ok ${spec}`)
  } catch (error) {
    console.error(`failed ${spec}`)
    throw error
  }
}
