import { styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { switchGroupVar, switchSizeVar } from '@/theme/runtime/component-vars'
import { type FormSize, formSizes } from './form-size'

export type SwitchSize = FormSize

const switchSizeTokens: Record<
  SwitchSize,
  { rootHeight: string; rootWidth: string; thumbSize: string; thumbTranslate: string }
> = {
  xs: { rootHeight: '1rem', rootWidth: '1.75rem', thumbSize: '0.75rem', thumbTranslate: '0.75rem' },
  sm: { rootHeight: '1.25rem', rootWidth: '2.25rem', thumbSize: '1rem', thumbTranslate: '1rem' },
  md: { rootHeight: '1.5rem', rootWidth: '2.75rem', thumbSize: '1.25rem', thumbTranslate: '1.25rem' },
  lg: { rootHeight: '1.75rem', rootWidth: '3.5rem', thumbSize: '1.5rem', thumbTranslate: '1.75rem' },
  //  xl: { rootHeight: '2rem', rootWidth: '4rem', thumbSize: '1.75rem', thumbTranslate: '2rem' },
}

export const switchSizeVariants: Record<SwitchSize, string> = styleVariants(
  Object.fromEntries(
    formSizes.map(size => {
      const token = switchSizeTokens[size]
      const controlSize = getControlSizeValues(size)
      return [
        size,
        {
          vars: {
            '--sw-root-height': switchSizeVar(size, 'rootHeight', token.rootHeight),
            '--sw-root-width': switchSizeVar(size, 'rootWidth', token.rootWidth),
            '--sw-thumb-size': switchSizeVar(size, 'thumbSize', token.thumbSize),
            '--sw-thumb-translate': switchSizeVar(size, 'thumbTranslate', token.thumbTranslate),
            '--sw-gap': switchSizeVar(size, 'gap', controlSize.gap),
          },
        },
      ]
    }),
  ),
)

export const switchGroupRootOrientation = styleVariants({
  vertical: {
    flexDirection: 'column',
    gap: switchGroupVar('gap', '0.5rem'),
  },
  horizontal: {
    flexDirection: 'row',
    gap: switchGroupVar('inlineGap', '1rem'),
  },
})
