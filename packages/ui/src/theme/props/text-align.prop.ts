import type { PropDef } from './prop-def'

const textAlignValues = ['left', 'center', 'right'] as const

const textAlignPropDef = {
  align: {
    type: 'enum',
    className: 'af-ta',
    values: textAlignValues,
    responsive: true,
  },
} satisfies {
  align: PropDef<(typeof textAlignValues)[number]>
}

export { textAlignPropDef }
