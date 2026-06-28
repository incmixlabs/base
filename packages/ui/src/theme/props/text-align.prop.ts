import type { PropDef } from './prop-def'

const textAlignValues = ['left', 'center', 'right'] as const

const textAlignPropDef = {
  align: {
    type: 'enum',
    values: textAlignValues,
  },
} satisfies {
  align: PropDef<(typeof textAlignValues)[number]>
}

export { textAlignPropDef }
