import { createVar, style, styleVariants } from '@vanilla-extract/css'
import {
  resolveInteractiveFillColor,
  resolveInteractiveForegroundToken,
  resolveInteractiveUnfilledColor,
  semanticColorKeys,
  semanticColorVar,
} from '@/theme/props/color.prop'
import { scrollAreaShapeVar, scrollAreaSizeVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'
import type {
  ScrollAreaArrowTone,
  ScrollAreaRailTone,
  ScrollAreaSurfaceVariant,
  ScrollAreaThickness,
  ScrollAreaVariant,
} from './scroll-area.props'

const thicknessVar = createVar()
const thumbInsetVar = createVar()
const thumbColorVar = createVar()
const thumbHoverColorVar = createVar()
const trackColorVar = createVar()
const surfaceColorVar = createVar()
const arrowColorVar = createVar()
const arrowHoverColorVar = createVar()
const trackRadiusVar = createVar()
const thumbRadiusVar = createVar()
const thumbShadowVar = createVar()
const controlSizeVar = createVar()
const railGapVar = createVar()
const railReserveVar = createVar()

export const scrollAreaBaseCls = 'relative w-full'

export const scrollAreaRoot = style({
  vars: {
    [thicknessVar]: '0.5rem',
    [thumbInsetVar]: '1px',
    [trackRadiusVar]: '9999px',
    [thumbRadiusVar]: '9999px',
    [thumbShadowVar]: 'none',
    [controlSizeVar]: '1rem',
    [railGapVar]: '0.375rem',
    [railReserveVar]: '1.5rem',
    [thumbColorVar]: semanticColorVar('neutral', 'soft-hover'),
    [thumbHoverColorVar]: semanticColorVar('neutral', 'text'),
    [trackColorVar]: semanticColorVar('neutral', 'border'),
    [surfaceColorVar]: 'transparent',
    [arrowColorVar]: semanticColorVar('slate', 'border'),
    [arrowHoverColorVar]: semanticColorVar('slate', 'text'),
  },
  position: 'relative',
  minHeight: 0,
  minWidth: 0,
  backgroundColor: surfaceColorVar,
  selectors: {
    '&[data-controls="false"]': {
      vars: {
        [railReserveVar]: `calc(${thicknessVar} + 0.5rem)`,
      },
    },
  },
})

export const scrollAreaBySize = styleVariants({
  none: {},
  xs: {
    vars: {
      [thicknessVar]: scrollAreaSizeVar('xs', 'thickness', '0.25rem'),
      [thumbInsetVar]: scrollAreaSizeVar('xs', 'thumbInset', '0px'),
      [controlSizeVar]: '0.95rem',
    },
  },
  sm: {
    vars: {
      [thicknessVar]: scrollAreaSizeVar('sm', 'thickness', '0.5rem'),
      [thumbInsetVar]: scrollAreaSizeVar('sm', 'thumbInset', '0px'),
      [controlSizeVar]: '1rem',
    },
  },
  md: {
    vars: {
      [thicknessVar]: scrollAreaSizeVar('md', 'thickness', '0.75rem'),
      [thumbInsetVar]: scrollAreaSizeVar('md', 'thumbInset', '1px'),
      [controlSizeVar]: '1.125rem',
    },
  },
})

export const scrollAreaByDirection = styleVariants({
  vertical: {},
  horizontal: {},
  both: {},
})

export const scrollAreaViewport = style({
  width: '100%',
  height: '100%',
  minHeight: 0,
  minWidth: 0,
  boxSizing: 'border-box',
  overflow: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [`${scrollAreaRoot}[data-vertical-rail="true"] &`]: {
      width: `calc(100% - ${railReserveVar})`,
    },
    [`${scrollAreaRoot}[data-horizontal-rail="true"] &`]: {
      height: `calc(100% - ${railReserveVar})`,
    },
    [`${scrollAreaRoot}[data-vertical-rail="true"][data-horizontal-rail="true"] &`]: {
      width: `calc(100% - ${railReserveVar})`,
      height: `calc(100% - ${railReserveVar})`,
    },
  },
})

export const scrollAreaContent = style({
  minWidth: '100%',
  boxSizing: 'border-box',
})

export const scrollAreaByType = styleVariants({
  auto: {},
  always: {},
  hover: {},
})

export const scrollAreaSurfaceVariant = styleVariants({
  soft: {
    vars: {
      [surfaceColorVar]: semanticColorVar('slate', 'soft'),
    },
  },
  solid: {
    vars: {
      [surfaceColorVar]: semanticColorVar('slate', 'primary'),
    },
  },
  surface: {
    vars: {
      [surfaceColorVar]: semanticColorVar('slate', 'surface'),
    },
  },
} satisfies Record<ScrollAreaSurfaceVariant, Parameters<typeof styleVariants>[0][string]>)

export const scrollAreaByThickness = styleVariants({
  thin: {
    vars: {
      [thicknessVar]: '0.25rem',
    },
  },
  thick: {
    vars: {
      [thicknessVar]: '0.5rem',
    },
  },
} satisfies Record<ScrollAreaThickness, Parameters<typeof styleVariants>[0][string]>)

export const scrollAreaByTrackShape = styleVariants({
  line: {
    vars: {
      [trackRadiusVar]: scrollAreaShapeVar('line', 'radius', '2px'),
      [thumbRadiusVar]: scrollAreaShapeVar('line', 'radius', '2px'),
    },
  },
  circle: {
    vars: {
      [trackRadiusVar]: scrollAreaShapeVar('circle', 'radius', '9999px'),
      [thumbRadiusVar]: scrollAreaShapeVar('circle', 'radius', '9999px'),
    },
  },
})

export const scrollAreaByThumbStyle = styleVariants({
  default: {},
  dot: {
    vars: {
      [thumbRadiusVar]: '9999px',
    },
  },
})

export const scrollAreaRailToneVariants = styleVariants({
  auto: {
    vars: {
      [trackColorVar]: semanticColorVar('slate', 'border'),
    },
  },
  light: {
    vars: {
      [trackColorVar]: 'color-mix(in oklch, white 52%, transparent)',
    },
  },
  dark: {
    vars: {
      [trackColorVar]: 'color-mix(in oklch, black 46%, transparent)',
    },
  },
} satisfies Record<ScrollAreaRailTone, Parameters<typeof styleVariants>[0][string]>)

export const scrollAreaArrowToneVariants = styleVariants({
  auto: {
    vars: {
      [arrowColorVar]: semanticColorVar('slate', 'border'),
      [arrowHoverColorVar]: semanticColorVar('slate', 'text'),
    },
  },
  light: {
    vars: {
      [arrowColorVar]: 'color-mix(in oklch, white 74%, transparent)',
      [arrowHoverColorVar]: 'color-mix(in oklch, white 92%, transparent)',
    },
  },
  dark: {
    vars: {
      [arrowColorVar]: 'color-mix(in oklch, black 56%, transparent)',
      [arrowHoverColorVar]: 'color-mix(in oklch, black 76%, transparent)',
    },
  },
} satisfies Record<ScrollAreaArrowTone, Parameters<typeof styleVariants>[0][string]>)

function createScrollAreaTrackStyles(color: Color): Record<ScrollAreaVariant, string> {
  const fillColor = resolveInteractiveFillColor(color)
  const unfilledColor = resolveInteractiveUnfilledColor(color)
  return {
    solid: style({
      vars: {
        [trackColorVar]: `color-mix(in oklch, ${semanticColorVar(fillColor, 'primary')} 18%, transparent)`,
        [thumbShadowVar]: `inset 0 1px 0 color-mix(in oklch, white 32%, transparent), 0 0 0 1px color-mix(in oklch, ${semanticColorVar(fillColor, 'text')} 28%, transparent)`,
      },
    }),
    soft: style({
      vars: {
        [trackColorVar]: semanticColorVar(fillColor, 'soft'),
        [thumbShadowVar]: 'none',
      },
    }),
    surface: style({
      vars: {
        [trackColorVar]: semanticColorVar(fillColor, 'surface'),
        [thumbShadowVar]: `0 0 0 1px color-mix(in oklch, ${semanticColorVar(fillColor, 'border')} 55%, transparent)`,
      },
    }),
    outline: style({
      vars: {
        [trackColorVar]: `color-mix(in oklch, ${semanticColorVar(unfilledColor, 'border')} 56%, transparent)`,
        [thumbShadowVar]: `0 0 0 1px color-mix(in oklch, ${semanticColorVar(unfilledColor, 'border')} 65%, transparent)`,
      },
    }),
  }
}

function createScrollAreaThumbStyles(color: Color): Record<ScrollAreaVariant, string> {
  const fillColor = resolveInteractiveFillColor(color)
  const unfilledColor = resolveInteractiveUnfilledColor(color)
  const foregroundToken = resolveInteractiveForegroundToken(color)
  return {
    solid: style({
      vars: {
        [thumbColorVar]: semanticColorVar(fillColor, 'primary'),
        [thumbHoverColorVar]: semanticColorVar(fillColor, 'text'),
      },
    }),
    soft: style({
      vars: {
        [thumbColorVar]: semanticColorVar(fillColor, 'soft-hover'),
        [thumbHoverColorVar]: semanticColorVar(fillColor, 'text'),
      },
    }),
    surface: style({
      vars: {
        [thumbColorVar]: semanticColorVar(fillColor, 'border'),
        [thumbHoverColorVar]: semanticColorVar(fillColor, 'text'),
      },
    }),
    outline: style({
      vars: {
        [thumbColorVar]: semanticColorVar(unfilledColor, 'border'),
        [thumbHoverColorVar]: semanticColorVar(unfilledColor, foregroundToken),
      },
    }),
  }
}

export const scrollAreaTrackColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createScrollAreaTrackStyles(color)]),
) as Record<Color, Record<ScrollAreaVariant, string>>

export const scrollAreaThumbColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createScrollAreaThumbStyles(color)]),
) as Record<Color, Record<ScrollAreaVariant, string>>

export const scrollAreaSurfaceColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    {
      soft: style({
        vars: {
          [surfaceColorVar]: semanticColorVar(color, 'soft'),
        },
      }),
      solid: style({
        vars: {
          [surfaceColorVar]: semanticColorVar(color, 'primary'),
        },
      }),
      surface: style({
        vars: {
          [surfaceColorVar]: semanticColorVar(color, 'surface'),
        },
      }),
    },
  ]),
) as Record<Color, Record<ScrollAreaSurfaceVariant, string>>

export const scrollAreaTrackerColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      vars: {
        [thumbColorVar]: semanticColorVar(color, 'primary'),
        [thumbHoverColorVar]: semanticColorVar(color, 'text'),
      },
    }),
  ]),
) as Record<Color, string>

export const scrollAreaRailBase = style({
  position: 'absolute',
  display: 'flex',
  gap: railGapVar,
  opacity: 1,
  transition: 'opacity 140ms ease',
  willChange: 'opacity',
  selectors: {
    [`${scrollAreaRoot}.${scrollAreaByType.hover}:not(:hover):not(:focus-within) &`]: {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
})

export const scrollAreaRailHidden = style({
  opacity: 0,
  pointerEvents: 'none',
})

export const scrollAreaRailVertical = style({
  top: '0.25rem',
  right: '0.375rem',
  bottom: '0.5rem',
  width: `max(${thicknessVar}, ${controlSizeVar})`,
  flexDirection: 'column',
  alignItems: 'center',
  selectors: {
    [`${scrollAreaRoot}[data-controls="false"] &`]: {
      width: thicknessVar,
    },
    [`${scrollAreaRoot}.${scrollAreaByDirection.both} &`]: {
      bottom: '1.375rem',
    },
    [`${scrollAreaRoot}[data-controls="false"].${scrollAreaByDirection.both} &`]: {
      bottom: '1rem',
    },
  },
})

export const scrollAreaRailHorizontal = style({
  left: '0.5rem',
  right: '0.375rem',
  bottom: '0.375rem',
  height: `max(${thicknessVar}, ${controlSizeVar})`,
  flexDirection: 'row',
  alignItems: 'center',
  selectors: {
    [`${scrollAreaRoot}[data-controls="false"] &`]: {
      height: thicknessVar,
    },
    [`${scrollAreaRoot}.${scrollAreaByDirection.both} &`]: {
      left: '0.75rem',
      right: '1.25rem',
      bottom: '0.5rem',
    },
    [`${scrollAreaRoot}[data-controls="false"].${scrollAreaByDirection.both} &`]: {
      right: '0.75rem',
    },
  },
})

export const scrollAreaControlBase = style({
  display: 'grid',
  placeItems: 'center',
  width: controlSizeVar,
  height: controlSizeVar,
  padding: 0,
  border: 0,
  background: 'transparent',
  color: arrowColorVar,
  cursor: 'pointer',
  flexShrink: 0,
  opacity: 0.98,
  selectors: {
    '&:hover': {
      color: arrowHoverColorVar,
    },
  },
})

export const scrollAreaControlIcon = style({
  width: controlSizeVar,
  height: controlSizeVar,
})

export const scrollAreaTrackBase = style({
  position: 'relative',
  border: 0,
  borderColor: 'transparent',
  padding: 0,
  borderRadius: trackRadiusVar,
  backgroundColor: trackColorVar,
  overflow: 'hidden',
  selectors: {
    [`${scrollAreaRoot}.${scrollAreaByThumbStyle.dot} &`]: {
      overflow: 'visible',
    },
  },
})

export const scrollAreaTrackVertical = style({
  flex: 1,
  width: thicknessVar,
})

export const scrollAreaTrackHorizontal = style({
  flex: 1,
  height: thicknessVar,
})

export const scrollAreaThumbBase = style({
  position: 'absolute',
  zIndex: 1,
  borderRadius: thumbRadiusVar,
  backgroundColor: thumbColorVar,
  boxShadow: thumbShadowVar,
  transition: 'background-color 140ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: thumbHoverColorVar,
    },
    '&[data-dragging="true"]': {
      backgroundColor: thumbHoverColorVar,
    },
  },
})

export const scrollAreaThumbVertical = style({
  top: 0,
  left: 0,
  width: '100%',
})

export const scrollAreaThumbHorizontal = style({
  top: 0,
  left: 0,
  height: '100%',
})
