import { createVar, style } from '@vanilla-extract/css'
import { typographyBreakpoints } from '@/theme/tokens'

export const storyTypographyFormFactorVar = createVar()
export const storyTypographyActiveBreakpointVar = createVar()

export const embeddedResponsiveShell = style({
  containerType: 'inline-size',
  vars: {
    [storyTypographyFormFactorVar]: 'narrow',
    [storyTypographyActiveBreakpointVar]: 'initial',
  },
  '@container': {
    [`(min-width: ${typographyBreakpoints.sm})`]: {
      vars: {
        [storyTypographyFormFactorVar]: 'medium',
        [storyTypographyActiveBreakpointVar]: 'sm',
      },
    },
    [`(min-width: ${typographyBreakpoints.md})`]: {
      vars: {
        [storyTypographyFormFactorVar]: 'wide',
        [storyTypographyActiveBreakpointVar]: 'md',
      },
    },
  },
})
