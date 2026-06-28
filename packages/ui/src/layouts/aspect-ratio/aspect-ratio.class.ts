import type { AspectRatioOwnProps } from './aspect-ratio.props'

type Ratio = NonNullable<AspectRatioOwnProps['ratio']>

export const aspectRatioByRatio: Record<Ratio, string> = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-[16/9]',
  '21/9': 'aspect-[21/9]',
  '3/4': 'aspect-[3/4]',
  '9/16': 'aspect-[9/16]',
  '3/2': 'aspect-[3/2]',
  '2/3': 'aspect-[2/3]',
} as const
