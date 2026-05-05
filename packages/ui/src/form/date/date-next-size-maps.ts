import type { Size } from '@/theme/tokens'

export type DateNextButtonSize = 'sm' | 'md' | 'lg' | 'xl'

const DEFAULT_BUTTON_SIZE: DateNextButtonSize = 'md'

export function mapDateNextSizeToButtonSize(size: Size | undefined): DateNextButtonSize {
  if (!size) return DEFAULT_BUTTON_SIZE

  switch (size) {
    case 'md':
      return 'md'
    case 'lg':
      return 'lg'
    case 'xl':
    case '2x':
      return 'xl'
    default:
      return 'sm'
  }
}
