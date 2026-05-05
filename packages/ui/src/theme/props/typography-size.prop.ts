import type { PropDef } from './prop-def'

const typographySizeValues = ['xs', 'sm', 'md', 'lg', 'xl', '2x', '3x', '4x', '5x'] as const

function createTypographySizePropDef(defaultValue?: (typeof typographySizeValues)[number]) {
  return {
    type: 'enum',
    className: 'af-size',
    values: typographySizeValues,
    ...(defaultValue ? { default: defaultValue } : {}),
    responsive: true,
  } as const satisfies PropDef<(typeof typographySizeValues)[number]>
}

export { createTypographySizePropDef, typographySizeValues }
