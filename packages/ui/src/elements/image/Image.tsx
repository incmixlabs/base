'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type ImageObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'

const objectFitClassName: Record<ImageObjectFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

export interface ImageProps extends Omit<React.ComponentPropsWithoutRef<'img'>, 'children'> {
  fallbackSrc?: string
  objectFit?: ImageObjectFit
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, objectFit = 'cover', alt = '', src, srcSet, sizes, fallbackSrc, onError, ...props }, ref) => {
    const [resolvedSrc, setResolvedSrc] = React.useState(src)
    const [usingFallback, setUsingFallback] = React.useState(false)

    React.useEffect(() => {
      setResolvedSrc(src)
      setUsingFallback(false)
    }, [src])

    return (
      <img
        ref={ref}
        alt={alt}
        src={resolvedSrc}
        srcSet={usingFallback ? undefined : srcSet}
        sizes={usingFallback ? undefined : sizes}
        className={cn('block max-w-full', objectFitClassName[objectFit], className)}
        onError={event => {
          if (!usingFallback && fallbackSrc) {
            setResolvedSrc(fallbackSrc)
            setUsingFallback(true)
          }
          onError?.(event)
        }}
        {...props}
      />
    )
  },
)

Image.displayName = 'Image'

export { Image }
