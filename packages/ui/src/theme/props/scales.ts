import { possibleSizes } from '@/theme/tokens'

export const sizesXsToMd = [possibleSizes.xs, possibleSizes.sm, possibleSizes.md] as const
export const sizesSmToMd = [possibleSizes.sm, possibleSizes.md] as const
export const sizesSmToLg = [possibleSizes.sm, possibleSizes.md, possibleSizes.lg] as const
export const sizesXsToLg = [possibleSizes.xs, possibleSizes.sm, possibleSizes.md, possibleSizes.lg] as const
export const sizesNoneToMd = ['none', possibleSizes.xs, possibleSizes.sm, possibleSizes.md] as const
export const sizesSmTo2x = [
  possibleSizes.sm,
  possibleSizes.md,
  possibleSizes.lg,
  possibleSizes.xl,
  possibleSizes['2x'],
] as const
export const sizesXsTo2x = [
  possibleSizes.xs,
  possibleSizes.sm,
  possibleSizes.md,
  possibleSizes.lg,
  possibleSizes.xl,
  possibleSizes['2x'],
] as const
export const sizesXsToLgAnd2x = [
  possibleSizes.xs,
  possibleSizes.sm,
  possibleSizes.md,
  possibleSizes.lg,
  possibleSizes['2x'],
] as const

export const variantsClassicSurfaceSoft = ['classic', 'surface', 'soft'] as const
export const variantsClassicSolidSurfaceSoft = ['classic', 'solid', 'surface', 'soft'] as const
export const variantsSolidSoft = ['solid', 'soft'] as const
export const variantsSolidSoftOutline = ['solid', 'soft', 'outline'] as const
export const variantsSolidSoftOutlineGhost = ['solid', 'soft', 'outline', 'ghost'] as const
export const variantsSolidSoftSurfaceOutline = ['solid', 'soft', 'surface', 'outline'] as const
export const variantsSurfaceGhost = ['surface', 'ghost'] as const
