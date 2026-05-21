import { createVar, style } from '@vanilla-extract/css'
import { typographyBreakpointQuery } from '@/theme/helpers/responsive/breakpoints'

export const storyTypographyFormFactorVar = createVar()
export const storyTypographyActiveBreakpointVar = createVar()

export const embeddedResponsiveShell = style({
  containerType: 'inline-size',
  vars: {
    [storyTypographyFormFactorVar]: 'narrow',
    [storyTypographyActiveBreakpointVar]: 'initial',
  },
  '@container': {
    [typographyBreakpointQuery.up('sm')]: {
      vars: {
        [storyTypographyFormFactorVar]: 'medium',
        [storyTypographyActiveBreakpointVar]: 'sm',
      },
    },
    [typographyBreakpointQuery.up('md')]: {
      vars: {
        [storyTypographyFormFactorVar]: 'wide',
        [storyTypographyActiveBreakpointVar]: 'md',
      },
    },
  },
})
