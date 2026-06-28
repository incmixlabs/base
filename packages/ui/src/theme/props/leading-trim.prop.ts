import type { PropDef } from './prop-def'

const leadingTrimValues = ['normal', 'start', 'end', 'both'] as const

const leadingTrimPropDef = {
  trim: {
    type: 'enum',
    values: leadingTrimValues,
  },
} satisfies {
  trim: PropDef<(typeof leadingTrimValues)[number]>
}

export { leadingTrimPropDef }
