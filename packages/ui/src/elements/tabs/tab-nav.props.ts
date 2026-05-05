import { asChildPropDef } from '@/theme/props/as-child.prop'

import type { PropDef } from '@/theme/props/prop-def'

const tabNavLinkPropDefs = {
  ...asChildPropDef,
  active: { type: 'boolean', default: false },
} satisfies {
  active: PropDef<boolean>
}

export { tabListPropDefs as tabNavRootPropDefs } from '@/elements/tabs/tab-list.props'
export { tabNavLinkPropDefs }
