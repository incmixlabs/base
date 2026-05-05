import { runtimePaletteVarsByMode } from './runtime-palette.generated'

type PaletteMode = keyof typeof runtimePaletteVarsByMode

export function buildRuntimePaletteVars(mode: PaletteMode): Record<string, string> {
  return { ...runtimePaletteVarsByMode[mode] }
}
