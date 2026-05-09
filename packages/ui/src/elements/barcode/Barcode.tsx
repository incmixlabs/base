'use client'

import * as React from 'react'
import { useComposedRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import { resolveInteractiveForegroundToken, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { type BarcodeFormat, type BarcodeTextAlign, type BarcodeTextPosition, barcodePropDefs } from './barcode.props'

export {
  type BarcodeFormat,
  type BarcodeTextAlign,
  type BarcodeTextPosition,
  barcodeFormats,
  barcodePropDefs,
  barcodeTextAlignments,
  barcodeTextPositions,
} from './barcode.props'

export interface BarcodeProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'color' | 'height' | 'width' | 'onError'> {
  value: string
  format?: BarcodeFormat
  color?: Color
  foregroundColor?: string
  backgroundColor?: string
  width?: number
  height?: number
  margin?: number
  displayValue?: boolean
  text?: string
  font?: string
  fontSize?: number
  fontOptions?: string
  textAlign?: BarcodeTextAlign
  textPosition?: BarcodeTextPosition
  textMargin?: number
  onError?: (error: Error) => void
  onGenerated?: () => void
}

const Barcode = React.forwardRef<SVGSVGElement, BarcodeProps>(
  (
    {
      value,
      format = barcodePropDefs.format.default,
      color = barcodePropDefs.color.default as Color,
      foregroundColor,
      backgroundColor = barcodePropDefs.backgroundColor.default,
      width = barcodePropDefs.width.default,
      height = barcodePropDefs.height.default,
      margin = barcodePropDefs.margin.default,
      displayValue = barcodePropDefs.displayValue.default,
      text,
      font = barcodePropDefs.font.default,
      fontSize = barcodePropDefs.fontSize.default,
      fontOptions = barcodePropDefs.fontOptions.default,
      textAlign = barcodePropDefs.textAlign.default,
      textPosition = barcodePropDefs.textPosition.default,
      textMargin = barcodePropDefs.textMargin.default,
      onError,
      onGenerated,
      className,
      role = 'img',
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const svgRef = React.useRef<SVGSVGElement | null>(null)
    const composedRef = useComposedRefs(ref, svgRef)
    const [error, setError] = React.useState<Error | null>(null)
    const lineColor =
      foregroundColor ?? (color ? semanticColorVar(color, resolveInteractiveForegroundToken(color)) : '#000000')
    const onErrorRef = React.useRef(onError)
    const onGeneratedRef = React.useRef(onGenerated)

    React.useEffect(() => {
      onErrorRef.current = onError
      onGeneratedRef.current = onGenerated
    })

    React.useEffect(() => {
      let isActive = true

      if (!svgRef.current) return

      if (!value) {
        svgRef.current.innerHTML = ''
        setError(null)
        return
      }

      async function generate() {
        try {
          const { default: JsBarcode } = await import('jsbarcode')
          if (!isActive || !svgRef.current) return

          JsBarcode(svgRef.current, value, {
            format,
            width,
            height,
            margin,
            background: backgroundColor,
            lineColor,
            displayValue,
            text,
            font,
            fontSize,
            fontOptions,
            textAlign,
            textPosition,
            textMargin,
            valid: valid => {
              if (!valid) {
                throw new Error(`Invalid barcode value for ${format}.`)
              }
            },
          })
          setError(null)
          onGeneratedRef.current?.()
        } catch (error) {
          if (!isActive || !svgRef.current) return

          const parsedError = error instanceof Error ? error : new Error('Failed to generate barcode.')
          svgRef.current.innerHTML = ''
          setError(parsedError)
          onErrorRef.current?.(parsedError)
        }
      }

      void generate()

      return () => {
        isActive = false
      }
    }, [
      value,
      format,
      width,
      height,
      margin,
      backgroundColor,
      lineColor,
      displayValue,
      text,
      font,
      fontSize,
      fontOptions,
      textAlign,
      textPosition,
      textMargin,
    ])

    return (
      <svg
        ref={composedRef}
        role={role}
        aria-label={ariaLabel ?? 'Barcode'}
        aria-invalid={error ? true : undefined}
        data-slot="barcode"
        data-format={format}
        className={cn('block max-w-full', className)}
        {...props}
      />
    )
  },
)

Barcode.displayName = 'Barcode'

export { Barcode }
