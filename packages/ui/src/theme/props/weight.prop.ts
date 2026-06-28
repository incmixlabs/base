import type { PropDef } from './prop-def'

const weights = ['light', 'regular', 'medium', 'semibold', 'bold'] as const

const weightPropDef = {
  weight: {
    type: 'enum',
    values: weights,
  },
} satisfies {
  weight: PropDef<(typeof weights)[number]>
}

export { weightPropDef }
