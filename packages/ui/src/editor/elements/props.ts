import { badgePropDefs } from '@/elements/badge/badge.props'
import { buttonPropDefs } from '@/elements/button/button.props'
import { calloutRootPropDefs as calloutPropDefs } from '@/elements/callout/callout.props'
import { cardPropDefs } from '@/elements/card/card.props'
import { insetPropDefs } from '@/elements/card/inset.props'
import { dataListPropDefs } from '@/elements/data-list/data-list.props'
import { imagePropDefs } from '@/elements/image/image.props'
import { dropdownMenuPropDefs } from '@/elements/menu/dropdown-menu.props'
import { spinnerPropDefs, spinnerVariants } from '@/elements/spinner/spinner.props'
import { tabsPropDefs } from '@/elements/tabs/tabs.props'
import { tablePropDefs } from '@/table/basic/table.props'

export { accordionRootPropDefs as accordionPropDefs } from '@/elements/accordion/accordion.props'
export { avatarPropDefs } from '@/elements/avatar/avatar.props'
export { avatarGroupPropDefs } from '@/elements/avatar/avatar-group.props'

export { badgePropDefs }
export { buttonPropDefs }
export { iconPropDefs } from '@/elements/button/icon.props'
export { iconButtonPropDefs } from '@/elements/button/icon-button.props'
export { imagePropDefs }
export * from '@/elements/card/card.props'
export { dataListPropDefs }
export { insetPropDefs }
export { calloutPropDefs }
export { alertDialogContentPropDefs as alertDialogPropDefs } from '@/elements/dialog/alert-dialog.props'
export { dialogContentPropDefs as dialogPropDefs } from '@/elements/dialog/dialog.props'
export { contextMenuContentPropDefs as contextMenuPropDefs } from '@/elements/menu/context-menu.props'
export * from '@/elements/menu/dropdown-menu.props'
export { dropdownMenuPropDefs }
export {
  baseMenuCheckboxItemPropDefs,
  baseMenuContentPropDefs,
  baseMenuItemPropDefs,
  baseMenuRadioItemPropDefs,
  contentSizes,
} from '@/elements/menu/menu.props'
export { popoverContentPropDefs as popoverPropDefs } from '@/elements/popover/popover.props'
export { scrollAreaPropDefs } from '@/elements/scroll-area/scroll-area.props'
export { spinnerPropDefs }
export { spinnerVariants }
export { stepperPropDefs } from '@/elements/stepper/stepper.props'
export { segmentedControlRootPropDefs as segmentedControlPropDefs } from '@/elements/tabs/segmented-control.props'
export { tabsPropDefs }
export { toastRootPropDefs as toastPropDefs, toastViewportPropDefs } from '@/elements/toast/toast.props'
export { togglePropDefs } from '@/elements/toggle/toggle.props'
export { tooltipContentPropDefs as tooltipPropDefs } from '@/elements/tooltip/tooltip.props'
export { tablePropDefs }
export { headingPropDefs } from '@/typography/heading/heading.props'
export { kbdPropDefs } from '@/typography/kbd/kbd.props'
export { linkPropDefs } from '@/typography/link/link.props'
export { textPropDefs } from '@/typography/text/text.props'

export const elementPropDefsByComponent = {
  badge: badgePropDefs,
  button: buttonPropDefs,
  callout: calloutPropDefs,
  card: cardPropDefs,
  'data-list': dataListPropDefs.Root,
  inset: insetPropDefs,
  image: imagePropDefs,
  spinner: spinnerPropDefs,
} as const
