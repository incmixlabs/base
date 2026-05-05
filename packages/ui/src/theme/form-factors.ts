export const formFactors = [
  'phone-small',
  'phone',
  'phone-large',
  'tablet-portrait',
  'tablet-landscape',
  'laptop',
  'desktop',
  'desktop-wide',
  'tv',
] as const

export type FormFactorProfile = (typeof formFactors)[number]

export const formFactorBuckets = ['xs', 'sm', 'md', 'lg', 'xl', '2x', '3x'] as const

export type FormFactorBucket = (typeof formFactorBuckets)[number]

export const formFactorToBucket: Record<FormFactorProfile, FormFactorBucket> = {
  'phone-small': 'xs',
  phone: 'sm',
  'phone-large': 'md',
  'tablet-portrait': 'md',
  'tablet-landscape': 'lg',
  laptop: 'lg',
  desktop: 'lg',
  'desktop-wide': '2x',
  tv: '3x',
}
