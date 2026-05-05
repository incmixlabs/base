import { style, styleVariants } from '@vanilla-extract/css'

export const aspectRatioByRatio = styleVariants({
  '1/1': { aspectRatio: '1 / 1' },
  '4/3': { aspectRatio: '4 / 3' },
  '16/9': { aspectRatio: '16 / 9' },
  '21/9': { aspectRatio: '21 / 9' },
  '3/4': { aspectRatio: '3 / 4' },
  '9/16': { aspectRatio: '9 / 16' },
  '3/2': { aspectRatio: '3 / 2' },
  '2/3': { aspectRatio: '2 / 3' },
})

export const aspectRatioCustom = style({})
