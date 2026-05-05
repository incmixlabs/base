import { tabListPropDefs } from '@/elements/tabs/tab-list.props'
import { asChildPropDef } from '@/theme/props/as-child.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { segmentedControlSharedRootPropDefs } from './segmented-control.props'

const variants = ['line', 'surface'] as const

const tabsRootPropDefs = {
  ...asChildPropDef,
  ...segmentedControlSharedRootPropDefs,
  variant: { type: 'enum', values: variants, default: 'line' },
} satisfies {
  hover: typeof segmentedControlSharedRootPropDefs.hover
  size: typeof segmentedControlSharedRootPropDefs.size
  variant: PropDef<(typeof variants)[number]>
  color: typeof segmentedControlSharedRootPropDefs.color
  highContrast: typeof segmentedControlSharedRootPropDefs.highContrast
}

const tabsContentPropDefs = {
  ...asChildPropDef,
}

const tabsPropDefs = {
  Root: tabsRootPropDefs,
  List: tabListPropDefs,
  Content: tabsContentPropDefs,
} as const

export { tabsPropDefs }
