import { SPACING_TO_PIXELS } from '@incmix/theme'
import { containerBreakpointKeys } from '../../theme/tokens'

type LinkWrapperGap = keyof typeof SPACING_TO_PIXELS
type ContainerBreakpoint = (typeof containerBreakpointKeys)[number]

const gapValues = Object.keys(SPACING_TO_PIXELS) as LinkWrapperGap[]

export const linkWrapperQueryHost = '[container-type:inline-size] min-w-0'

export const linkWrapperInner = 'flex min-w-0'

export const linkWrapperGap = Object.fromEntries(gapValues.map(gap => [gap, `gap-${gap}`])) as Record<
  LinkWrapperGap,
  string
>

export const linkWrapperGapResponsive = Object.fromEntries(
  containerBreakpointKeys.map(breakpoint => [
    breakpoint,
    Object.fromEntries(gapValues.map(gap => [gap, `cq-${breakpoint}:gap-${gap}`])),
  ]),
) as Record<ContainerBreakpoint, Record<LinkWrapperGap, string>>
