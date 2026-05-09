'use client'

import * as React from 'react'
import { useComposedRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import { resolveInteractiveForegroundToken, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'

export type BarcodeFormat =
  | 'CODE128'
  | 'CODE128A'
  | 'CODE128B'
  | 'CODE128C'
  | 'EAN13'
  | 'EAN8'
  | 'UPC'
  | 'CODE39'
  | 'ITF14'
  | 'ITF'
  | 'MSI'
  | 'MSI10'
  | 'MSI11'
  | 'MSI1010'
  | 'MSI1110'
  | 'pharmacode'
  | 'codabar'

export const barcodeFormats: BarcodeFormat[] = [
  'CODE128',
  'CODE128A',
  'CODE128B',
  'CODE128C',
  'EAN13',
  'EAN8',
  'UPC',
  'CODE39',
  'ITF14',
  'ITF',
  'MSI',
  'MSI10',
  'MSI11',
  'MSI1010',
  'MSI1110',
  'pharmacode',
  'codabar',
]

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
  textAlign?: 'left' | 'center' | 'right'
  textPosition?: 'top' | 'bottom'
  textMargin?: number
  onError?: (error: Error) => void
  onGenerated?: () => void
}

const Barcode = React.forwardRef<SVGSVGElement, BarcodeProps>(
  (
    {
      value,
      format = 'CODE128',
      color = 'neutral',
      foregroundColor,
      backgroundColor = '#ffffff',
      width = 2,
      height = 100,
      margin = 10,
      displayValue = true,
      text,
      font = 'monospace',
      fontSize = 20,
      fontOptions = '',
      textAlign = 'center',
      textPosition = 'bottom',
      textMargin = 2,
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
