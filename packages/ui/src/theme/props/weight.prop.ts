import type { PropDef } from './prop-def'

const weights = ['light', 'regular', 'medium', 'bold'] as const

const weightPropDef = {
  weight: {
    type: 'enum',
    className: 'af-weight',
    values: weights,
    responsive: true,
  },
} satisfies {
  weight: PropDef<(typeof weights)[number]>
}

export { weightPropDef }
