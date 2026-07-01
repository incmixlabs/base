import { themeSizeTokens } from '@incmix/theme'
import { semanticColorKeys } from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'

const segmentedSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
type SegmentedSize = (typeof segmentedSizes)[number]

const cls = (...tokens: Array<string | false | null | undefined>) => tokens.filter(Boolean).join(' ')
const joinClass = (...parts: string[]) => parts.join('')
const declaration = (property: string, value: string) => joinClass('[', property, ':', value, ']')
const colorVar = (color: Color, token: string) => joinClass('var(--color-', color, '-', token, ')')
const calc = (left: string, operator: '+' | '-', right: string) =>
  joinClass('calc(', left, '_', operator, '_', right, ')')

const heightByToken = {
  '1.5rem': 'h-6',
  '1.75rem': 'h-7',
  '2rem': 'h-8',
  '2.5rem': 'h-10',
  '2.75rem': 'h-11',
} as const

const paddingInlineByToken = {
  '0.5rem': 'px-2',
  '0.625rem': 'px-2.5',
  '0.75rem': 'px-3',
  '0.875rem': 'px-3.5',
} as const

const gapByToken = {
  '0.25rem': 'gap-1',
  '0.375rem': 'gap-1.5',
  '0.5rem': 'gap-2',
  '0.625rem': 'gap-2.5',
  '0.6875rem': 'gap-[0.6875rem]',
} as const

const typographyBySize = {
  xs: 'text-xs leading-4',
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
  lg: 'text-lg leading-[1.625rem]',
  xl: 'text-xl leading-7',
} as const satisfies Record<SegmentedSize, string>

const contentPaddingBySize = {
  xs: 'pt-2',
  sm: 'pt-2.5',
  md: 'pt-3',
  lg: 'pt-[1.0625rem]',
  xl: 'pt-[1.1875rem]',
} as const satisfies Record<SegmentedSize, string>

function heightClass(value: string) {
  return heightByToken[value as keyof typeof heightByToken] ?? declaration('height', value)
}

function paddingInlineClass(value: string) {
  return paddingInlineByToken[value as keyof typeof paddingInlineByToken] ?? declaration('padding-inline', value)
}

function gapClass(value: string) {
  return gapByToken[value as keyof typeof gapByToken] ?? declaration('gap', value)
}

export const segmentedRootBaseCls = 'relative inline-flex items-center overflow-hidden box-border'

export const segmentedIndicatorBaseCls =
  'pointer-events-none absolute left-0 top-0 z-0 transition-[left,top,width,height,opacity] duration-200 ease-out'

export const segmentedItemBaseCls =
  'relative z-10 box-border select-none appearance-none bg-transparent shadow-none outline-none'

export const segmentedInteractiveBaseCls =
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-primary-highlight disabled:pointer-events-none disabled:opacity-50'

export const segmentedTabInteractiveCls = cls(segmentedInteractiveBaseCls, 'focus-visible:outline-offset-2')

export const segmentedControlInteractiveCls = cls(segmentedInteractiveBaseCls, 'focus-visible:outline-offset-1')

export const segmentedUnderlineIndicatorCls = 'top-auto bottom-0 h-0.5 rounded-none'

export const segmentedUnderlineIndicatorVerticalCls = 'left-auto right-0 w-0.5 rounded-none'

export const segmentedUnderlineUnselectedCls = 'border-0'

export const segmentedSurfaceRootBySize = Object.fromEntries(
  segmentedSizes.map(size => {
    const token = themeSizeTokens[size]
    return [size, cls(heightClass(token.height), 'p-0', gapClass(token.gap))]
  }),
) as Record<SegmentedSize, string>

export const segmentedUnderlineRootBySize = Object.fromEntries(
  segmentedSizes.map(size => {
    const token = themeSizeTokens[size]
    return [size, cls(declaration('height', calc(token.height, '+', '1px')), gapClass(token.gap), 'pb-px')]
  }),
) as Record<SegmentedSize, string>

export const segmentedItemBySize = Object.fromEntries(
  segmentedSizes.map(size => {
    const token = themeSizeTokens[size]
    return [
      size,
      cls(
        paddingInlineClass(token.paddingX),
        heightClass(token.height),
        declaration('padding-top', calc(token.paddingY, '+', '2px')),
        declaration('padding-bottom', calc(token.paddingY, '-', '2px')),
        typographyBySize[size],
      ),
    ]
  }),
) as Record<SegmentedSize, string>

export const segmentedUnderlineItemBySize = Object.fromEntries(
  segmentedSizes.map(size => {
    const token = themeSizeTokens[size]
    return [
      size,
      cls(
        paddingInlineClass(token.paddingX),
        declaration('padding-top', calc(token.paddingY, '-', '8px')),
        'pb-2',
        typographyBySize[size],
      ),
    ]
  }),
) as Record<SegmentedSize, string>

export const segmentedSurfaceContentBySize = contentPaddingBySize

export const segmentedLineContentBySize = contentPaddingBySize

export const segmentedSurfaceIndicatorByColor = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    cls(declaration('background-color', colorVar(color, 'background')), 'border border-solid', `border-${color}`),
  ]),
) as Record<Color, string>

export const segmentedUnderlineIndicatorByColor = Object.fromEntries(
  semanticColorKeys.map(color => [color, `bg-${color}-solid`]),
) as Record<Color, string>

export const segmentedSurfaceRootByColor = Object.fromEntries(
  semanticColorKeys.map(color => [color, cls('border border-solid', `border-${color}`, `bg-${color}-soft`)]),
) as Record<Color, string>

export const segmentedUnderlineRootByColor = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    cls(
      'after:content-[""] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:pointer-events-none',
      `after:${declaration('background-color', colorVar(color, 'border'))}`,
    ),
  ]),
) as Record<Color, string>

export const segmentedUnderlineRootVerticalByColor = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    cls(
      'after:content-[""] after:absolute after:top-0 after:right-0 after:bottom-0 after:w-px after:pointer-events-none',
      `after:${declaration('background-color', colorVar(color, 'border'))}`,
    ),
  ]),
) as Record<Color, string>

export const segmentedSurfaceSelectedTextByColor = Object.fromEntries(
  semanticColorKeys.map(color => [color, `text-${color}`]),
) as Record<Color, string>

export const segmentedSurfaceSelectedHighContrastTextByColor = Object.fromEntries(
  semanticColorKeys.map(color => [color, declaration('color', colorVar(color, 'solid'))]),
) as Record<Color, string>

export const segmentedUnderlineSelectedByColor = Object.fromEntries(
  semanticColorKeys.map(color => [color, cls('border-0', declaration('color', colorVar(color, 'solid')))]),
) as Record<Color, string>

export const segmentedControlClassNames = [
  segmentedRootBaseCls,
  segmentedIndicatorBaseCls,
  segmentedItemBaseCls,
  segmentedInteractiveBaseCls,
  segmentedTabInteractiveCls,
  segmentedControlInteractiveCls,
  segmentedUnderlineIndicatorCls,
  segmentedUnderlineIndicatorVerticalCls,
  segmentedUnderlineUnselectedCls,
  ...Object.values(segmentedSurfaceRootBySize),
  ...Object.values(segmentedUnderlineRootBySize),
  ...Object.values(segmentedItemBySize),
  ...Object.values(segmentedUnderlineItemBySize),
  ...Object.values(segmentedSurfaceContentBySize),
  ...Object.values(segmentedLineContentBySize),
  ...semanticColorKeys.flatMap(color => [
    segmentedSurfaceIndicatorByColor[color],
    segmentedUnderlineIndicatorByColor[color],
    segmentedSurfaceRootByColor[color],
    segmentedUnderlineRootByColor[color],
    segmentedUnderlineRootVerticalByColor[color],
    segmentedSurfaceSelectedTextByColor[color],
    segmentedSurfaceSelectedHighContrastTextByColor[color],
    segmentedUnderlineSelectedByColor[color],
  ]),
]
