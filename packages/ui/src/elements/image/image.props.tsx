import type { PropDef } from '@/theme/props/prop-def'

const loadingValues = ['eager', 'lazy'] as const
const decodingValues = ['async', 'auto', 'sync'] as const
const objectFitValues = ['contain', 'cover', 'fill', 'none', 'scale-down'] as const

const imagePropDefs = {
  src: { type: 'string', required: false },
  alt: { type: 'string', required: false },
  fallbackSrc: { type: 'string', required: false },
  srcSet: { type: 'string', required: false },
  sizes: { type: 'string', required: false },
  width: { type: 'string', required: false },
  height: { type: 'string', required: false },
  loading: { type: 'enum', values: loadingValues, required: false, default: undefined },
  decoding: { type: 'enum', values: decodingValues, required: false, default: undefined },
  objectFit: { type: 'enum', values: objectFitValues, required: false, default: 'cover' },
} satisfies {
  src: PropDef<string>
  alt: PropDef<string>
  fallbackSrc: PropDef<string>
  srcSet: PropDef<string>
  sizes: PropDef<string>
  width: PropDef<string>
  height: PropDef<string>
  loading: PropDef<(typeof loadingValues)[number]>
  decoding: PropDef<(typeof decodingValues)[number]>
  objectFit: PropDef<(typeof objectFitValues)[number]>
}

export {
  decodingValues as imageDecodingValues,
  imagePropDefs,
  loadingValues as imageLoadingValues,
  objectFitValues as imageObjectFitValues,
}
