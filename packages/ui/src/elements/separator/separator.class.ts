import { type SemanticColorKey, semanticColors } from '../../theme/props/color.prop'

export const separatorBase =
  'flex items-center self-stretch gap-0 whitespace-nowrap border-0 before:content-[""] before:flex-grow after:content-[""] after:flex-grow'
export const separatorDefaultColor =
  'before:bg-[color-mix(in_oklch,currentcolor_12%,transparent)] after:bg-[color-mix(in_oklch,currentcolor_12%,transparent)]'
export const separatorWithContent = 'gap-4'
export const separatorHorizontal = 'flex-row before:w-full after:w-full'
export const separatorVertical = 'flex-col before:h-full after:h-full'
export const separatorHorizontalStructural = 'w-full h-auto'
export const separatorVerticalStructural = 'h-full w-auto'
export const separatorHorizontalWithContent = 'w-auto h-4 mx-0 my-4'
export const separatorVerticalWithContent = 'w-4 h-auto mx-4 my-0'

export const separatorAlignStart = 'before:hidden'
export const separatorAlignEnd = 'after:hidden'

export const separatorSizeVariants = {
  horizontal: {
    xs: 'before:h-[0.0625rem] after:h-[0.0625rem]',
    sm: 'before:h-[0.125rem] after:h-[0.125rem]',
    md: 'before:h-[0.25rem] after:h-[0.25rem]',
    lg: 'before:h-[0.5rem] after:h-[0.5rem]',
  },
  vertical: {
    xs: 'before:w-[0.0625rem] after:w-[0.0625rem]',
    sm: 'before:w-[0.125rem] after:w-[0.125rem]',
    md: 'before:w-[0.25rem] after:w-[0.25rem]',
    lg: 'before:w-[0.5rem] after:w-[0.5rem]',
  },
} as const

export const separatorColorVariants = Object.fromEntries(
  semanticColors.map(color => [color, `before:bg-${color}-solid after:bg-${color}-solid`]),
) as Record<SemanticColorKey, string>
