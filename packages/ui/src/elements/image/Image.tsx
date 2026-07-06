'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Radius } from '@/theme/tokens'
import { getRadiusStyles, useThemeRadius } from '../utils'

export type ImageObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'

const objectFitClassName: Record<ImageObjectFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

export interface ImageFocalPoint {
  x: number
  y: number
}

const getFocalPointObjectPosition = (focalPoint: ImageFocalPoint | undefined) =>
  focalPoint ? `${focalPoint.x}% ${focalPoint.y}%` : undefined

export interface ImageProps extends Omit<React.ComponentPropsWithoutRef<'img'>, 'children'> {
  focalPoint?: ImageFocalPoint
  fallbackSrc?: string
  objectFit?: ImageObjectFit
  objectPosition?: React.CSSProperties['objectPosition']
  radius?: Radius
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      objectFit = 'cover',
      alt = '',
      src,
      srcSet,
      sizes,
      fallbackSrc,
      onError,
      radius: radiusProp,
      objectPosition,
      focalPoint,
      style,
      ...props
    },
    ref,
  ) => {
    const [resolvedSrc, setResolvedSrc] = React.useState(src)
    const [usingFallback, setUsingFallback] = React.useState(false)
    const radius = useThemeRadius(radiusProp)
    const resolvedObjectPosition = objectPosition ?? getFocalPointObjectPosition(focalPoint)
    const resolvedStyle = {
      ...getRadiusStyles(radius),
      ...(resolvedObjectPosition !== undefined ? { objectPosition: resolvedObjectPosition } : {}),
      ...style,
    }

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
        className={cn(
          'block max-w-full',
          'rounded-[var(--element-border-radius)]',
          objectFitClassName[objectFit],
          className,
        )}
        style={resolvedStyle}
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
