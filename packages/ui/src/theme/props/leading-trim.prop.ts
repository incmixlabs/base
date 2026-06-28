import type { PropDef } from './prop-def'

const leadingTrimValues = ['normal', 'start', 'end', 'both'] as const
type LeadingTrim = (typeof leadingTrimValues)[number]

const leadingTrimPropDef = {
  trim: {
    type: 'enum',
    values: leadingTrimValues,
    responsive: true,
  },
} satisfies {
  trim: PropDef<LeadingTrim>
}

export type { LeadingTrim }
export { leadingTrimPropDef, leadingTrimValues }
