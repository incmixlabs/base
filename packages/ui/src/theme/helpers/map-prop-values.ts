import type { baseButtonPropDefs } from '@/elements/button/button.props'
import type { calloutRootPropDefs } from '@/elements/callout/callout.props'
import type { spinnerPropDefs } from '@/elements/spinner/spinner.props'
import type { Responsive } from '@/theme/props/prop-def'
import type { textPropDefs } from '@/typography/text/text.props'

function mapResponsiveProp<Input extends string, Output>(
  propValue: Responsive<Input> | undefined,
  mapValue: (value: Input) => Output,
): Responsive<Output> | undefined {
  if (propValue === undefined) return undefined
  if (typeof propValue === 'string') {
    return mapValue(propValue)
  }
  return Object.fromEntries(
    Object.entries(propValue).map(([key, value]) => [key, mapValue(value as Input)]),
  ) as Responsive<Output>
}

function mapCalloutSizeToTextSize(
  size: (typeof calloutRootPropDefs.size.values)[number],
): (typeof textPropDefs.size.values)[number] {
  return size === '2x' ? 'lg' : 'md'
}

function mapButtonSizeToSpinnerSize(
  size: (typeof baseButtonPropDefs.size.values)[number],
): (typeof spinnerPropDefs.size.values)[number] {
  switch (size) {
    case 'xs':
    case 'sm':
      return 'sm'
    case 'md':
    case 'lg':
      return 'md'
    case 'xl':
      return 'lg'
    default:
      return 'md'
  }
}

export { mapButtonSizeToSpinnerSize, mapCalloutSizeToTextSize, mapResponsiveProp }
