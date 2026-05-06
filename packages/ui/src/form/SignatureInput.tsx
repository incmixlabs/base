'use client'

import { Pen, Trash2, Undo2 } from 'lucide-react'
import * as React from 'react'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import type { Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { useFieldGroup } from './FieldGroupContext'

// ============================================================================
// Types
// ============================================================================

export interface SignatureInputProps {
  /** The size of the component */
  size?: Size
  /** The visual variant */
  variant?: TextFieldVariant
  /** The border radius */
  radius?: Radius
  /** Whether the field has an error */
  error?: boolean
  /** Whether the input is disabled */
  disabled?: boolean
  /** Whether the input is read-only */
  readOnly?: boolean
  /** Current value (data URL of the signature) */
  value?: string
  /** Called when signature changes */
  onChange?: (value: string | undefined) => void
  /** Width of the canvas */
  width?: number
  /** Height of the canvas */
  height?: number
  /** Stroke color */
  strokeColor?: string
  /** Stroke width */
  strokeWidth?: number
  /** Background color */
  backgroundColor?: string
  /** Placeholder text when empty */
  placeholder?: string
  /** Additional class name */
  className?: string
}

// ============================================================================
// Main Component
// ============================================================================

/** SignatureInput export. */
export const SignatureInput = React.forwardRef<HTMLCanvasElement, SignatureInputProps>(
  (
    {
      size: sizeProp,
      variant: variantProp,
      radius: radiusProp,
      error = false,
      disabled = false,
      value,
      onChange,
      width = 400,
      height = 150,
      strokeColor = '#000000',
      strokeWidth = 2,
      backgroundColor = 'transparent',
      placeholder = 'Sign here',
      readOnly,
      className,
    },
    ref,
  ) => {
    const fieldGroup = useFieldGroup()
    // Size is intentionally unused - SignatureInput uses explicit width/height props
    void (sizeProp ?? fieldGroup.size)
    const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
    const variant = variantProp ?? fieldGroup.variant
    const effectiveDisabled = disabled || fieldGroup.disabled
    const effectiveReadOnly = readOnly === true || fieldGroup.readOnly
    const mutationsDisabled = effectiveDisabled || effectiveReadOnly

    const radiusStyles = getRadiusStyles(radius)

    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = React.useState(false)
    const [isEmpty, setIsEmpty] = React.useState(true)
    const [history, setHistory] = React.useState<ImageData[]>([])

    // Combine refs
    React.useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

    // Initialize canvas
    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size
      canvas.width = width
      canvas.height = height

      // Set initial styles
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Fill background
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)
      }

      // Load existing value if provided
      if (value) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          setIsEmpty(false)
        }
        img.src = value
      }
    }, [width, height, strokeColor, strokeWidth, backgroundColor, value])

    // Get canvas coordinates from event
    const getCoordinates = React.useCallback(
      (event: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
        const canvas = canvasRef.current
        if (!canvas) return null

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        if ('touches' in event) {
          const touch = event.touches[0]
          if (!touch) return null
          return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY,
          }
        }

        return {
          x: (event.clientX - rect.left) * scaleX,
          y: (event.clientY - rect.top) * scaleY,
        }
      },
      [],
    )

    // Save current state to history
    const saveToHistory = React.useCallback(() => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setHistory(prev => [...prev.slice(-9), imageData]) // Keep last 10 states
    }, [])

    // Start drawing
    const startDrawing = React.useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (mutationsDisabled) return

        const coords = getCoordinates(event)
        if (!coords) return

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return

        saveToHistory()
        setIsDrawing(true)
        ctx.beginPath()
        ctx.moveTo(coords.x, coords.y)
      },
      [mutationsDisabled, getCoordinates, saveToHistory],
    )

    // Draw
    const draw = React.useCallback(
      (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || mutationsDisabled) return

        const coords = getCoordinates(event)
        if (!coords) return

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return

        ctx.lineTo(coords.x, coords.y)
        ctx.stroke()
        setIsEmpty(false)
      },
      [isDrawing, mutationsDisabled, getCoordinates],
    )

    // Stop drawing
    const stopDrawing = React.useCallback(() => {
      if (!isDrawing) return

      setIsDrawing(false)

      const canvas = canvasRef.current
      if (!canvas) return

      // Emit the signature as data URL
      const dataUrl = canvas.toDataURL('image/png')
      onChange?.(dataUrl)
    }, [isDrawing, onChange])

    React.useEffect(() => {
      if (mutationsDisabled) {
        setIsDrawing(false)
      }
    }, [mutationsDisabled])

    // Undo last stroke
    const handleUndo = React.useCallback(() => {
      if (history.length === 0 || mutationsDisabled) return

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      const previousState = history[history.length - 1]
      if (!previousState) return
      ctx.putImageData(previousState, 0, 0)
      setHistory(prev => prev.slice(0, -1))

      // Check if canvas is empty
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const isEmpty = imageData.data.every((pixel, index) => {
        // Check alpha channel (every 4th value starting at index 3)
        return index % 4 !== 3 || pixel === 0
      })
      setIsEmpty(isEmpty)

      if (isEmpty) {
        onChange?.(undefined)
      } else {
        onChange?.(canvas.toDataURL('image/png'))
      }
    }, [history, mutationsDisabled, onChange])

    // Clear canvas
    const handleClear = React.useCallback(() => {
      if (mutationsDisabled) return

      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      // Save current state before clearing
      saveToHistory()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      setIsEmpty(true)
      onChange?.(undefined)
    }, [mutationsDisabled, backgroundColor, saveToHistory, onChange])

    // Prevent touch scrolling while drawing
    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const preventScroll = (e: TouchEvent) => {
        if (isDrawing) {
          e.preventDefault()
        }
      }

      canvas.addEventListener('touchmove', preventScroll, { passive: false })
      return () => canvas.removeEventListener('touchmove', preventScroll)
    }, [isDrawing])

    const baseVariant = variant?.startsWith('floating-') ? 'outline' : (variant ?? 'outline')

    return (
      <div className={cn('relative inline-block', effectiveDisabled && 'opacity-50 cursor-not-allowed', className)}>
        {/* Canvas Container */}
        <div
          className={cn(
            'relative overflow-hidden',
            'rounded-[var(--element-border-radius)]',
            baseVariant === 'outline' && 'border border-input',
            baseVariant === 'soft' && 'bg-secondary',
            baseVariant === 'surface' && 'border border-input bg-background shadow-sm',
            error && 'border-destructive',
          )}
          style={radiusStyles}
        >
          {/* Placeholder */}
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Pen className="h-4 w-4" />
                <span className="text-sm">{placeholder}</span>
              </div>
            </div>
          )}

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className={cn('cursor-crosshair touch-none', mutationsDisabled && 'pointer-events-none')}
            style={{ width, height }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={mutationsDisabled || history.length === 0}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md',
              'border border-input bg-background hover:bg-accent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
            aria-label="Undo"
          >
            <Undo2 className="h-3 w-3" />
            Undo
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={mutationsDisabled || isEmpty}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md',
              'border border-input bg-background hover:bg-accent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
            aria-label="Clear"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        </div>
      </div>
    )
  },
)

SignatureInput.displayName = 'SignatureInput'
