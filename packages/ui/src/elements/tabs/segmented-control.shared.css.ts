import { style, styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { segmentedControlRootPropDefs } from './segmented-control.props'

const segmentedSizes = segmentedControlRootPropDefs.size.values
type SegmentedSize = (typeof segmentedControlRootPropDefs.size.values)[number]
const segmentedSurfaceInset = '0px'
const segmentedTokens = Object.fromEntries(segmentedSizes.map(size => [size, getControlSizeValues(size)])) as Record<
  SegmentedSize,
  ReturnType<typeof getControlSizeValues>
>

export const segmentedRootBaseCls = 'relative inline-flex items-center overflow-hidden box-border'

export const segmentedIndicatorBaseCls =
  'pointer-events-none absolute left-0 top-0 z-0 transition-[left,top,width,height,opacity] duration-200 ease-out'

export const segmentedItemBaseCls =
  'relative z-10 box-border select-none appearance-none bg-transparent shadow-none outline-none'

export const segmentedUnderlineIndicatorCls = style({
  top: 'auto',
  bottom: 0,
  height: '2px',
  borderRadius: 0,
})

export const segmentedUnderlineIndicatorVerticalCls = style({
  left: 'auto',
  right: 0,
  width: '2px',
  borderRadius: 0,
})

export const segmentedUnderlineUnselectedCls = style({
  border: 0,
})

export const segmentedSurfaceRootBySize = styleVariants(
  Object.fromEntries(
    segmentedSizes.map(size => {
      const token = segmentedTokens[size]
      return [
        size,
        {
          height: `calc(${token.height} + (${segmentedSurfaceInset} * 2))`,
          padding: segmentedSurfaceInset,
          gap: token.gap,
        },
      ]
    }),
  ) as Record<SegmentedSize, { height: string; padding: string; gap: string }>,
)

export const segmentedUnderlineRootBySize = styleVariants(
  Object.fromEntries(
    segmentedSizes.map(size => {
      const token = segmentedTokens[size]
      return [size, { height: `calc(${token.height} + 1px)`, gap: token.gap, paddingBottom: '1px' }]
    }),
  ) as Record<SegmentedSize, { height: string; gap: string; paddingBottom: string }>,
)

export const segmentedItemBySize = styleVariants(
  Object.fromEntries(
    segmentedSizes.map(size => [
      size,
      {
        paddingInline: segmentedTokens[size].paddingX,
        height: segmentedTokens[size].height,
        // Surface labels should sit slightly lower for optical centering.
        paddingTop: `calc(${segmentedTokens[size].paddingY} + 2px)`,
        paddingBottom: `calc(${segmentedTokens[size].paddingY} - 2px)`,
        fontSize: segmentedTokens[size].fontSize,
        lineHeight: segmentedTokens[size].lineHeight,
      },
    ]),
  ) as Record<
    SegmentedSize,
    {
      paddingInline: string
      height: string
      paddingTop: string
      paddingBottom: string
      fontSize: string
      lineHeight: string
    }
  >,
)

export const segmentedUnderlineItemBySize = styleVariants(
  Object.fromEntries(
    segmentedSizes.map(size => [
      size,
      {
        paddingInline: segmentedTokens[size].paddingX,
        // Keep underline labels optically closer to the bottom border.
        paddingTop: `calc(${segmentedTokens[size].paddingY} - 8px)`,
        paddingBottom: '8px',
        fontSize: segmentedTokens[size].fontSize,
        lineHeight: segmentedTokens[size].lineHeight,
      },
    ]),
  ) as Record<
    SegmentedSize,
    {
      paddingInline: string
      paddingTop: string
      paddingBottom: string
      fontSize: string
      lineHeight: string
    }
  >,
)

export const segmentedSurfaceContentBySize = styleVariants(
  Object.fromEntries(
    segmentedSizes.map(size => [
      size,
      {
        paddingTop: `calc(${segmentedTokens[size].paddingY} + ${segmentedTokens[size].gap})`,
      },
    ]),
  ) as Record<SegmentedSize, { paddingTop: string }>,
)

export const segmentedLineContentBySize = styleVariants(
  Object.fromEntries(
    segmentedSizes.map(size => [
      size,
      {
        paddingTop: `calc(${segmentedTokens[size].paddingY} + ${segmentedTokens[size].gap})`,
      },
    ]),
  ) as Record<SegmentedSize, { paddingTop: string }>,
)

export const segmentedSurfaceIndicatorByColor = styleVariants(
  Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      {
        backgroundColor: `var(--color-${color}-background)`,
        border: `1px solid ${semanticColorVar(color, 'border')}`,
      },
    ]),
  ),
)

export const segmentedUnderlineIndicatorByColor = styleVariants(
  Object.fromEntries(semanticColorKeys.map(color => [color, { backgroundColor: semanticColorVar(color, 'primary') }])),
)

export const segmentedSurfaceRootByColor = styleVariants(
  Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      {
        border: `1px solid ${semanticColorVar(color, 'border')}`,
        backgroundColor: semanticColorVar(color, 'soft'),
      },
    ]),
  ),
)

export const segmentedUnderlineRootByColor = styleVariants(
  Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      {
        selectors: {
          '&::after': {
            content: '',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '1px',
            backgroundColor: semanticColorVar(color, 'border'),
            pointerEvents: 'none',
          },
        },
      },
    ]),
  ),
)

export const segmentedUnderlineRootVerticalByColor = styleVariants(
  Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      {
        selectors: {
          '&::after': {
            content: '',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: semanticColorVar(color, 'border'),
            pointerEvents: 'none',
          },
        },
      },
    ]),
  ),
)

export const segmentedSurfaceSelectedTextByColor = styleVariants(
  Object.fromEntries(semanticColorKeys.map(color => [color, { color: semanticColorVar(color, 'text') }])),
)

export const segmentedSurfaceSelectedHighContrastTextByColor = styleVariants(
  Object.fromEntries(semanticColorKeys.map(color => [color, { color: semanticColorVar(color, 'primary') }])),
)

export const segmentedUnderlineSelectedByColor = styleVariants(
  Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      {
        border: 0,
        color: semanticColorVar(color, 'primary'),
      },
    ]),
  ),
)
