import type { PropDef } from './prop-def'

const radii = ['none', 'sm', 'md', 'lg', 'full'] as const

const radiusPropDef = {
  radius: {
    type: 'enum',
    values: radii,
    default: undefined,
  },
} satisfies {
  radius: PropDef<(typeof radii)[number]>
}

export { radiusPropDef, radii }
