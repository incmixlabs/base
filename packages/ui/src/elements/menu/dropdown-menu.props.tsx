import { buttonPropDefs } from '@/elements/button/button.props'
import type { PropDef } from '@/theme/props/prop-def'
import {
  baseMenuCheckboxItemPropDefs,
  baseMenuContentPropDefs,
  baseMenuItemPropDefs,
  baseMenuRadioItemPropDefs,
} from './menu.props'

const triggerSizes = ['sm', 'md'] as const
const triggerVariants = ['solid', 'soft'] as const

const triggerArrows = ['down', 'updown'] as const

const dropdownMenuTriggerPropDefs = {
  showTriggerIcon: { type: 'boolean', default: false },
  arrow: { type: 'enum', values: triggerArrows, default: 'down' },
} satisfies {
  showTriggerIcon: PropDef<boolean>
  arrow: PropDef<(typeof triggerArrows)[number]>
}

const dropdownMenuTriggerButtonPropDefs = {
  size: {
    ...buttonPropDefs.size,
    values: triggerSizes,
    default: 'md',
  },
  variant: {
    ...buttonPropDefs.variant,
    values: triggerVariants,
    default: 'solid',
  },
  color: buttonPropDefs.color,
  showTriggerIcon: { type: 'boolean', default: false },
  arrow: { type: 'enum', values: triggerArrows, default: 'down' },
} satisfies {
  size: PropDef<(typeof triggerSizes)[number]>
  variant: PropDef<(typeof triggerVariants)[number]>
  color: typeof buttonPropDefs.color
  showTriggerIcon: PropDef<boolean>
  arrow: PropDef<(typeof triggerArrows)[number]>
}

const dropdownMenuContentPropDefs = baseMenuContentPropDefs
const dropdownMenuItemPropDefs = baseMenuItemPropDefs
const dropdownMenuCheckboxItemPropDefs = baseMenuCheckboxItemPropDefs
const dropdownMenuRadioItemPropDefs = baseMenuRadioItemPropDefs

const dropdownMenuPropDefs = {
  Trigger: dropdownMenuTriggerPropDefs,
  TriggerButton: dropdownMenuTriggerButtonPropDefs,
  Content: dropdownMenuContentPropDefs,
  Item: dropdownMenuItemPropDefs,
  CheckboxItem: dropdownMenuCheckboxItemPropDefs,
  RadioItem: dropdownMenuRadioItemPropDefs,
} as const

export { dropdownMenuPropDefs }
