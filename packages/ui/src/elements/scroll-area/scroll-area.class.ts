import {
  resolveInteractiveFillColor,
  resolveInteractiveForegroundToken,
  resolveInteractiveUnfilledColor,
  semanticColorKeys,
} from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'
import type {
  ScrollAreaArrowTone,
  ScrollAreaRailTone,
  ScrollAreaSurfaceVariant,
  ScrollAreaThickness,
  ScrollAreaVariant,
} from './scroll-area.props'

export const scrollAreaBaseCls = 'relative w-full'

export const scrollAreaRootCls = 'scroll-area-root'

export const scrollAreaRoot =
  'relative min-h-0 min-w-0 [background-color:var(--scroll-area-surface-color)] scroll-area-root [--scroll-area-thickness:0.5rem] [--scroll-area-thumb-inset:1px] [--scroll-area-track-radius:9999px] [--scroll-area-thumb-radius:9999px] [--scroll-area-thumb-shadow:none] [--scroll-area-control-size:1rem] [--scroll-area-rail-gap:0.375rem] [--scroll-area-rail-reserve:1.5rem] [--scroll-area-thumb-color:var(--color-neutral-soft-hover)] [--scroll-area-thumb-hover-color:var(--color-neutral-text)] [--scroll-area-track-color:var(--color-neutral-border)] [--scroll-area-surface-color:transparent] [--scroll-area-arrow-color:var(--color-slate-border)] [--scroll-area-arrow-hover-color:var(--color-slate-text)] [data-controls="false"]:[--scroll-area-rail-reserve:calc(var(--scroll-area-thickness)_+_0.5rem)]'

export const scrollAreaBySize = {
  none: '',
  xs: '[--scroll-area-thickness:var(--component-scroll-area-size-xs-thickness,0.25rem)] [--scroll-area-thumb-inset:var(--component-scroll-area-size-xs-thumb-inset,0px)] [--scroll-area-control-size:0.95rem]',
  sm: '[--scroll-area-thickness:var(--component-scroll-area-size-sm-thickness,0.5rem)] [--scroll-area-thumb-inset:var(--component-scroll-area-size-sm-thumb-inset,0px)] [--scroll-area-control-size:1rem]',
  md: '[--scroll-area-thickness:var(--component-scroll-area-size-md-thickness,0.75rem)] [--scroll-area-thumb-inset:var(--component-scroll-area-size-md-thumb-inset,1px)] [--scroll-area-control-size:1.125rem]',
} as const

export const scrollAreaByDirection = {
  vertical: '',
  horizontal: '',
  both: 'scroll-area-both',
} as const

export const scrollAreaViewport =
  'w-full h-full min-h-0 min-w-0 box-border overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [.scroll-area-root[data-vertical-rail="true"]_&]:[width:calc(100%_-_var(--scroll-area-rail-reserve))] [.scroll-area-root[data-horizontal-rail="true"]_&]:[height:calc(100%_-_var(--scroll-area-rail-reserve))] [.scroll-area-root[data-vertical-rail="true"][data-horizontal-rail="true"]_&]:[width:calc(100%_-_var(--scroll-area-rail-reserve))]:[height:calc(100%_-_var(--scroll-area-rail-reserve))]'

export const scrollAreaContent = 'min-w-full box-border'

export const scrollAreaByType = {
  auto: '',
  always: '',
  hover: 'scroll-area-hover',
} as const

export const scrollAreaSurfaceVariant = {
  soft: '[--scroll-area-surface-color:var(--color-slate-soft)]',
  solid: '[--scroll-area-surface-color:var(--color-slate-primary)]',
  surface: '[--scroll-area-surface-color:var(--color-slate-surface)]',
} satisfies Record<ScrollAreaSurfaceVariant, string>

export const scrollAreaByThickness = {
  thin: '[--scroll-area-thickness:0.25rem]',
  thick: '[--scroll-area-thickness:0.5rem]',
} satisfies Record<ScrollAreaThickness, string>

export const scrollAreaByTrackShape = {
  line: '[--scroll-area-track-radius:2px] [--scroll-area-thumb-radius:2px]',
  circle: '[--scroll-area-track-radius:9999px] [--scroll-area-thumb-radius:9999px]',
} as const

export const scrollAreaByThumbStyle = {
  default: '',
  dot: 'scroll-area-thumb-dot [--scroll-area-thumb-radius:9999px]',
} as const

export const scrollAreaRailToneVariants = {
  auto: '[--scroll-area-track-color:var(--color-slate-border)]',
  light: '[--scroll-area-track-color:color-mix(in_oklch,_white_52%,_transparent)]',
  dark: '[--scroll-area-track-color:color-mix(in_oklch,_black_46%,_transparent)]',
} satisfies Record<ScrollAreaRailTone, string>

export const scrollAreaArrowToneVariants = {
  auto: '[--scroll-area-arrow-color:var(--color-slate-border)] [--scroll-area-arrow-hover-color:var(--color-slate-text)]',
  light:
    '[--scroll-area-arrow-color:color-mix(in_oklch,_white_74%,_transparent)] [--scroll-area-arrow-hover-color:color-mix(in_oklch,_white_92%,_transparent)]',
  dark: '[--scroll-area-arrow-color:color-mix(in_oklch,_black_56%,_transparent)] [--scroll-area-arrow-hover-color:color-mix(in_oklch,_black_76%,_transparent)]',
} satisfies Record<ScrollAreaArrowTone, string>

function createScrollAreaTrackStyles(color: Color): Record<ScrollAreaVariant, string> {
  const fillColor = resolveInteractiveFillColor(color)
  const unfilledColor = resolveInteractiveUnfilledColor(color)
  return {
    solid: `[--scroll-area-track-color:color-mix(in_oklch,var(--color-${fillColor}-primary)_18%,transparent)] [--scroll-area-thumb-shadow:inset_0_1px_0_color-mix(in_oklch,white_32%,transparent),0_0_0_1px_color-mix(in_oklch,var(--color-${fillColor}-text)_28%,transparent)]`,
    soft: `[--scroll-area-track-color:var(--color-${fillColor}-soft)] [--scroll-area-thumb-shadow:none]`,
    surface: `[--scroll-area-track-color:var(--color-${fillColor}-surface)] [--scroll-area-thumb-shadow:0_0_0_1px_color-mix(in_oklch,var(--color-${fillColor}-border)_55%,transparent)]`,
    outline: `[--scroll-area-track-color:color-mix(in_oklch,var(--color-${unfilledColor}-border)_56%,transparent)] [--scroll-area-thumb-shadow:0_0_0_1px_color-mix(in_oklch,var(--color-${unfilledColor}-border)_65%,transparent)]`,
  }
}

function createScrollAreaThumbStyles(color: Color): Record<ScrollAreaVariant, string> {
  const fillColor = resolveInteractiveFillColor(color)
  const unfilledColor = resolveInteractiveUnfilledColor(color)
  const foregroundToken = resolveInteractiveForegroundToken(color)
  return {
    solid: `[--scroll-area-thumb-color:var(--color-${fillColor}-primary)] [--scroll-area-thumb-hover-color:var(--color-${fillColor}-text)]`,
    soft: `[--scroll-area-thumb-color:var(--color-${fillColor}-soft-hover)] [--scroll-area-thumb-hover-color:var(--color-${fillColor}-text)]`,
    surface: `[--scroll-area-thumb-color:var(--color-${fillColor}-border)] [--scroll-area-thumb-hover-color:var(--color-${fillColor}-text)]`,
    outline: `[--scroll-area-thumb-color:var(--color-${unfilledColor}-border)] [--scroll-area-thumb-hover-color:var(--color-${unfilledColor}-${foregroundToken})]`,
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
      soft: `[--scroll-area-surface-color:var(--color-${color}-soft)]`,
      solid: `[--scroll-area-surface-color:var(--color-${color}-primary)]`,
      surface: `[--scroll-area-surface-color:var(--color-${color}-surface)]`,
    },
  ]),
) as Record<Color, Record<ScrollAreaSurfaceVariant, string>>

export const scrollAreaTrackerColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    `[--scroll-area-thumb-color:var(--color-${color}-primary)] [--scroll-area-thumb-hover-color:var(--color-${color}-text)]`,
  ]),
) as Record<Color, string>

export const scrollAreaRailBase =
  'absolute flex [gap:var(--scroll-area-rail-gap)] opacity-100 transition-opacity duration-140 ease will-change-opacity [.scroll-area-root.scroll-area-hover:not(:hover):not(:focus-within)_&]:opacity-0 [.scroll-area-root.scroll-area-hover:not(:hover):not(:focus-within)_&]:pointer-events-none'

export const scrollAreaRailHidden = 'opacity-0 pointer-events-none'

export const scrollAreaRailVertical =
  'top-1 right-[0.375rem] bottom-2 [width:max(var(--scroll-area-thickness),var(--scroll-area-control-size))] flex-col items-center [.scroll-area-root[data-controls="false"]_&]:[width:var(--scroll-area-thickness)] [.scroll-area-root.scroll-area-both_&]:bottom-[1.375rem] [.scroll-area-root[data-controls="false"].scroll-area-both_&]:bottom-4'

export const scrollAreaRailHorizontal =
  'left-2 right-[0.375rem] bottom-[0.375rem] [height:max(var(--scroll-area-thickness),var(--scroll-area-control-size))] flex-row items-center [.scroll-area-root[data-controls="false"]_&]:[height:var(--scroll-area-thickness)] [.scroll-area-root.scroll-area-both_&]:left-3 [.scroll-area-root.scroll-area-both_&]:right-[1.25rem] [.scroll-area-root.scroll-area-both_&]:bottom-2 [.scroll-area-root[data-controls="false"].scroll-area-both_&]:right-3'

export const scrollAreaControlBase =
  'grid place-items-center [width:var(--scroll-area-control-size)] [height:var(--scroll-area-control-size)] p-0 border-0 bg-transparent [color:var(--scroll-area-arrow-color)] cursor-pointer shrink-0 opacity-98 hover:[color:var(--scroll-area-arrow-hover-color)]'

export const scrollAreaControlIcon = '[width:var(--scroll-area-control-size)] [height:var(--scroll-area-control-size)]'

export const scrollAreaTrackBase =
  'relative border-0 border-transparent p-0 [border-radius:var(--scroll-area-track-radius)] [background-color:var(--scroll-area-track-color)] overflow-hidden [.scroll-area-root.scroll-area-thumb-dot_&]:overflow-visible'

export const scrollAreaTrackVertical = 'flex-1 [width:var(--scroll-area-thickness)]'

export const scrollAreaTrackHorizontal = 'flex-1 [height:var(--scroll-area-thickness)]'

export const scrollAreaThumbBase =
  'absolute z-1 [border-radius:var(--scroll-area-thumb-radius)] [background-color:var(--scroll-area-thumb-color)] [box-shadow:var(--scroll-area-thumb-shadow)] transition-colors duration-140 ease hover:[background-color:var(--scroll-area-thumb-hover-color)] data-[dragging="true"]:[background-color:var(--scroll-area-thumb-hover-color)]'

export const scrollAreaThumbVertical = 'top-0 left-0 w-full'

export const scrollAreaThumbHorizontal = 'top-0 left-0 h-full'

const classMapValues = <Value extends string>(map: Record<string, Record<string, Value>>) =>
  Object.values(map).flatMap(v => Object.values(v))

export const scrollAreaClassNames = [
  scrollAreaBaseCls,
  scrollAreaRoot,
  ...Object.values(scrollAreaBySize),
  ...Object.values(scrollAreaByDirection),
  scrollAreaViewport,
  scrollAreaContent,
  ...Object.values(scrollAreaByType),
  ...Object.values(scrollAreaSurfaceVariant),
  ...Object.values(scrollAreaByThickness),
  ...Object.values(scrollAreaByTrackShape),
  ...Object.values(scrollAreaByThumbStyle),
  ...Object.values(scrollAreaRailToneVariants),
  ...Object.values(scrollAreaArrowToneVariants),
  ...classMapValues(scrollAreaTrackColorVariants),
  ...classMapValues(scrollAreaThumbColorVariants),
  ...classMapValues(scrollAreaSurfaceColorVariants),
  ...Object.values(scrollAreaTrackerColorVariants),
  scrollAreaRailBase,
  scrollAreaRailHidden,
  scrollAreaRailVertical,
  scrollAreaRailHorizontal,
  scrollAreaControlBase,
  scrollAreaControlIcon,
  scrollAreaTrackBase,
  scrollAreaTrackVertical,
  scrollAreaTrackHorizontal,
  scrollAreaThumbBase,
  scrollAreaThumbVertical,
  scrollAreaThumbHorizontal,
]
