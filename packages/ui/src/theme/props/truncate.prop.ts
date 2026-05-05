import type { PropDef } from './prop-def'

const truncatePropDef = {
  truncate: {
    type: 'boolean',
    className: 'af-truncate',
  },
} satisfies {
  truncate: PropDef<boolean>
}

export { truncatePropDef }
