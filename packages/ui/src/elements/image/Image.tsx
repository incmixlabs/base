'use client'

import { ImageOff } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Radius } from '@/theme/tokens'
import { Text } from '@/typography/text/Text'
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
  errorFallback?: React.ReactNode
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
      errorFallback,
      onError,
      radius: radiusProp,
      objectPosition,
      focalPoint,
      style,
      crossOrigin,
      ...props
    },
    ref,
  ) => {
    const [resolvedSrc, setResolvedSrc] = React.useState(src)
    const [usingFallback, setUsingFallback] = React.useState(false)
    const [hasError, setHasError] = React.useState(false)
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
      setHasError(false)
    }, [src])

    if (hasError) {
      if (errorFallback !== undefined) {
        return errorFallback
      }
      return (
        <div
          className={cn(
            'flex flex-col items-center justify-center bg-neutral-soft text-muted-foreground min-h-[80px] w-full h-full p-4 border border-[var(--color-error-border-subtle)] text-center gap-1',
            'rounded-[var(--element-border-radius)]',
            className,
          )}
          style={resolvedStyle}
          role="img"
          aria-label={alt || 'Image failed to load'}
        >
          <ImageOff size={24} className="opacity-60 shrink-0" />
          <Text size="xs" weight="medium" color="error" className="opacity-80 leading-tight">
            Image load failed
          </Text>
        </div>
      )
    }

    return (
      <img
        ref={ref}
        alt={alt}
        src={resolvedSrc}
        srcSet={usingFallback ? undefined : srcSet}
        sizes={usingFallback ? undefined : sizes}
        crossOrigin={crossOrigin}
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
          } else {
            setHasError(true)
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
