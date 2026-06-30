import type { PropDef } from './prop-def'

const mutedClassName = 'opacity-70'

const mutedPropDef = {
  muted: {
    type: 'boolean',
    className: mutedClassName,
    default: false,
  },
} satisfies {
  muted: PropDef<boolean>
}

export { mutedClassName, mutedPropDef }
