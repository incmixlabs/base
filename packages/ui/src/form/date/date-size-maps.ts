import type { Size } from '@/theme/tokens'

export type DateButtonSize = 'sm' | 'md' | 'lg' | 'xl'

const DEFAULT_BUTTON_SIZE: DateButtonSize = 'md'

export function mapDateSizeToButtonSize(size: Size | undefined): DateButtonSize {
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
