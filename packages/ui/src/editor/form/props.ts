import { sliderPropDefs } from '@/elements/slider/slider.props'

export { checkboxPropDefs } from '@/form/checkbox.props'
export { checkboxCardsRootPropDefs } from '@/form/checkbox-cards.props'
export { checkboxGroupRootPropDefs } from '@/form/checkbox-group.props'
export { radioPropDefs } from '@/form/radio.props'
export { radioCardsRootPropDefs } from '@/form/radio-cards.props'
export { radioGroupRootPropDefs } from '@/form/radio-group.props'
export { ratingPropDefs } from '@/form/rating.props'
export { selectPropDefs } from '@/form/select.props'
export { switchPropDefs } from '@/form/switch.props'
export { switchGroupRootPropDefs } from '@/form/switch-group.props'
export { textAreaPropDefs } from '@/form/text-area.props'
export { textFieldRootPropDefs, textFieldSlotPropDefs } from '@/form/text-field.props'
export { sliderPropDefs }

export const formPropDefsByComponent = {
  slider: sliderPropDefs,
} as const
