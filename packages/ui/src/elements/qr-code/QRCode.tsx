'use client'

import * as React from 'react'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { useLazyRef } from '@/hooks/use-lazy-ref'
import { Slot } from '@/layouts/layout-utils'
import { useComposedRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import { semanticColorVar } from '@/theme/props/color.prop'
import type { Color, Radius } from '@/theme/tokens'

const ROOT_NAME = 'QRCode'
const CANVAS_NAME = 'QRCode.Canvas'
const SVG_NAME = 'QRCode.Svg'
const IMAGE_NAME = 'QRCode.Image'
const SKELETON_NAME = 'QRCode.Skeleton'

export type QRCodeLevel = 'L' | 'M' | 'Q' | 'H'
export type QRCodeDownloadFormat = 'png' | 'svg'

type QRCodeState = {
  dataUrl: string | null
  svgString: string | null
  isGenerating: boolean
  generatingKey: string | null
  error: Error | null
  generationKey: string
}

type QRCodeStore = {
  subscribe: (callback: () => void) => () => void
  getState: () => QRCodeState
  setStates: (updates: Partial<QRCodeState>) => void
}

type QRCodeContextValue = {
  value: string
  size: number
  margin: number
  level: QRCodeLevel
  foregroundColor: string
  backgroundColor: string
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  rootRef: React.RefObject<HTMLElement | null>
  width: number
  height: number
  radius: Radius
}

const QRCodeStoreContext = React.createContext<QRCodeStore | null>(null)
const QRCodeContext = React.createContext<QRCodeContextValue | null>(null)
const hexColorPattern = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i

function useQRCodeStore<T>(selector: (state: QRCodeState) => T): T {
  const store = React.useContext(QRCodeStoreContext)
  if (!store) {
    throw new Error('`useQRCode` must be used within `QRCode`.')
  }

  const getSnapshot = React.useCallback(() => selector(store.getState()), [store, selector])
  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}

function useQRCodeContext(consumerName: string): QRCodeContextValue {
  const context = React.useContext(QRCodeContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\`.`)
  }

  return context
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function toHexByte(value: number): string {
  return Math.round(clamp(value, 0, 255))
    .toString(16)
    .padStart(2, '0')
}

function toHexColor(red: number, green: number, blue: number, alpha = 1): string {
  const alphaHex = alpha < 1 ? toHexByte(alpha * 255) : ''
  return `#${toHexByte(red)}${toHexByte(green)}${toHexByte(blue)}${alphaHex}`
}

function parseAlpha(value: string | undefined): number {
  if (!value) return 1
  const trimmed = value.trim()
  const alpha = trimmed.endsWith('%') ? Number.parseFloat(trimmed) / 100 : Number.parseFloat(trimmed)
  return Number.isFinite(alpha) ? clamp(alpha, 0, 1) : 1
}

function parseRgbChannel(value: string): number {
  const trimmed = value.trim()
  const channel = trimmed.endsWith('%') ? Number.parseFloat(trimmed) * 2.55 : Number.parseFloat(trimmed)
  return Number.isFinite(channel) ? clamp(channel, 0, 255) : 0
}

function parseRgbColor(value: string): string | null {
  const match = value.trim().match(/^rgba?\((.*)\)$/i)
  if (!match) return null

  const body = match[1].trim()
  const commaParts = body.includes(',') ? body.split(/\s*,\s*/) : null
  const channelParts = commaParts ? commaParts.slice(0, 3) : body.split('/')[0].trim().split(/\s+/)
  const alphaPart = commaParts ? commaParts[3] : body.split('/')[1]

  if (channelParts.length < 3) return null

  return toHexColor(
    parseRgbChannel(channelParts[0]),
    parseRgbChannel(channelParts[1]),
    parseRgbChannel(channelParts[2]),
    parseAlpha(alphaPart),
  )
}

function parseOklchLightness(value: string): number {
  const trimmed = value.trim()
  const lightness = trimmed.endsWith('%') ? Number.parseFloat(trimmed) / 100 : Number.parseFloat(trimmed)
  return Number.isFinite(lightness) ? clamp(lightness, 0, 1) : 0
}

function parseOklchHue(value: string | undefined): number {
  if (!value || value === 'none') return 0

  const trimmed = value.trim()
  if (trimmed.endsWith('turn')) return Number.parseFloat(trimmed) * 360
  if (trimmed.endsWith('rad')) return Number.parseFloat(trimmed) * (180 / Math.PI)
  if (trimmed.endsWith('grad')) return Number.parseFloat(trimmed) * 0.9

  return Number.parseFloat(trimmed)
}

function linearSrgbToChannel(value: number): number {
  const clamped = clamp(value, 0, 1)
  const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055
  return encoded * 255
}

function parseOklchColor(value: string): string | null {
  const match = value.trim().match(/^oklch\((.*)\)$/i)
  if (!match) return null

  const body = match[1].trim()
  const [colorPart, alphaPart] = body.split('/')
  const parts = colorPart.trim().split(/\s+/)
  if (parts.length < 3) return null

  const lightness = parseOklchLightness(parts[0])
  const chroma = parts[1] === 'none' ? 0 : Number.parseFloat(parts[1])
  const hue = parseOklchHue(parts[2])
  if (!Number.isFinite(chroma) || !Number.isFinite(hue)) return null

  const hueRadians = (hue * Math.PI) / 180
  const labA = chroma * Math.cos(hueRadians)
  const labB = chroma * Math.sin(hueRadians)
  const long = (lightness + 0.3963377774 * labA + 0.2158037573 * labB) ** 3
  const medium = (lightness - 0.1055613458 * labA - 0.0638541728 * labB) ** 3
  const short = (lightness - 0.0894841775 * labA - 1.291485548 * labB) ** 3

  return toHexColor(
    linearSrgbToChannel(4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short),
    linearSrgbToChannel(-1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short),
    linearSrgbToChannel(-0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short),
    parseAlpha(alphaPart),
  )
}

function parseHexCompatibleColor(value: string): string | null {
  const trimmed = value.trim()
  if (hexColorPattern.test(trimmed)) return trimmed
  if (trimmed === 'transparent') return '#00000000'

  return parseRgbColor(trimmed) ?? parseOklchColor(trimmed)
}

function getComputedColor(value: string, element: Element | null): string | null {
  if (typeof document === 'undefined') return null

  const ownerDocument = element?.ownerDocument ?? document
  const view = ownerDocument.defaultView
  if (!view) return null

  const probe = ownerDocument.createElement('span')
  probe.style.position = 'absolute'
  probe.style.pointerEvents = 'none'
  probe.style.visibility = 'hidden'
  probe.style.color = value

  const parent = element ?? ownerDocument.body ?? ownerDocument.documentElement
  parent.appendChild(probe)

  try {
    return view.getComputedStyle(probe).color.trim() || null
  } finally {
    probe.remove()
  }
}

function resolveCssVariableReferences(value: string, element: Element | null): string {
  if (typeof document === 'undefined' || typeof window === 'undefined' || !value.includes('var(')) return value

  const owner = element ?? document.documentElement
  let resolved = value.trim()

  for (let index = 0; index < 8 && resolved.includes('var('); index += 1) {
    const next = resolved.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/g, (_, variableName, fallback) => {
      return window.getComputedStyle(owner).getPropertyValue(variableName).trim() || fallback || ''
    })

    if (next === resolved) break
    resolved = next.trim()
  }

  return resolved
}

function resolveQRCodeColor(value: string, element: Element | null, fallback: string): string {
  const parsed = parseHexCompatibleColor(value)
  if (parsed) return parsed

  const computed = getComputedColor(value, element)
  if (computed) {
    const parsedComputed = parseHexCompatibleColor(computed)
    if (parsedComputed) return parsedComputed
  }

  const resolved = resolveCssVariableReferences(value, element)
  const parsedResolved = parseHexCompatibleColor(resolved)
  return parsedResolved ?? fallback
}

function getForegroundColor(color: Color | undefined, foregroundColor: string | undefined): string {
  return foregroundColor ?? (color ? semanticColorVar(color, 'primary') : '#000000')
}

function clearCanvas(canvas: HTMLCanvasElement | null, width: number, height: number) {
  const context = canvas?.getContext('2d')
  context?.clearRect(0, 0, width, height)
}

export interface QRCodeRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'height' | 'width' | 'onError'> {
  value: string
  width?: number
  height?: number
  /** @deprecated Use width and height for theme-provider driven sizing. */
  size?: number
  level?: QRCodeLevel
  margin?: number
  radius?: Radius
  color?: Color
  foregroundColor?: string
  backgroundColor?: string
  onError?: (error: Error) => void
  onGenerated?: () => void
  asChild?: boolean
}

export type QRCodeProps = QRCodeRootProps

const QRCodeRoot = React.forwardRef<HTMLDivElement, QRCodeRootProps>(
  (
    {
      value,
      width,
      height,
      size,
      level = 'M',
      margin = 1,
      radius: radiusProp = 'none',
      color,
      foregroundColor,
      backgroundColor = '#ffffff',
      onError,
      onGenerated,
      asChild = false,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLElement | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const composedRootRef = useComposedRefs(ref as React.Ref<HTMLElement>, rootRef)
    const listenersRef = useLazyRef(() => new Set<() => void>())
    const stateRef = useLazyRef<QRCodeState>(() => ({
      dataUrl: null,
      svgString: null,
      isGenerating: false,
      generatingKey: null,
      error: null,
      generationKey: '',
    }))

    const store = React.useMemo<QRCodeStore>(
      () => ({
        subscribe: callback => {
          listenersRef.current.add(callback)
          return () => listenersRef.current.delete(callback)
        },
        getState: () => stateRef.current,
        setStates: updates => {
          let hasChanged = false

          for (const key of Object.keys(updates) as Array<keyof QRCodeState>) {
            const value = updates[key]
            if (value !== undefined && !Object.is(stateRef.current[key], value)) {
              Object.assign(stateRef.current, { [key]: value })
              hasChanged = true
            }
          }

          if (hasChanged) {
            for (const callback of listenersRef.current) {
              callback()
            }
          }
        },
      }),
      [listenersRef, stateRef],
    )

    const resolvedWidth = width ?? size ?? 200
    const resolvedHeight = height ?? size ?? width ?? 200
    const resolvedSize = Math.min(resolvedWidth, resolvedHeight)
    const radius = useThemeRadius(radiusProp)
    const rawForegroundColor = getForegroundColor(color, foregroundColor)
    const onErrorRef = React.useRef(onError)
    const onGeneratedRef = React.useRef(onGenerated)
    const generationKey = React.useMemo(() => {
      if (!value) return ''

      return JSON.stringify({
        value,
        width: resolvedWidth,
        height: resolvedHeight,
        level,
        margin,
        radius,
        foregroundColor: rawForegroundColor,
        backgroundColor,
      })
    }, [value, resolvedWidth, resolvedHeight, level, margin, radius, rawForegroundColor, backgroundColor])

    React.useEffect(() => {
      onErrorRef.current = onError
      onGeneratedRef.current = onGenerated
    })

    React.useEffect(() => {
      let isActive = true

      async function generate() {
        if (!generationKey) {
          clearCanvas(canvasRef.current, resolvedSize, resolvedSize)
          store.setStates({
            dataUrl: null,
            svgString: null,
            isGenerating: false,
            generatingKey: null,
            error: null,
            generationKey: '',
          })
          return
        }

        const currentState = store.getState()
        if (currentState.generatingKey === generationKey || currentState.generationKey === generationKey) return

        store.setStates({ isGenerating: true, generatingKey: generationKey, error: null })

        const resolvedForegroundColor = resolveQRCodeColor(rawForegroundColor, rootRef.current, '#000000')
        const resolvedBackgroundColor = resolveQRCodeColor(backgroundColor, rootRef.current, '#ffffff')
        const options = {
          errorCorrectionLevel: level,
          margin,
          width: resolvedSize,
          color: {
            dark: resolvedForegroundColor,
            light: resolvedBackgroundColor,
          },
        } as const

        try {
          const QRCodeModule = await import('qrcode')
          let dataUrl: string | null = null

          try {
            dataUrl = await QRCodeModule.toDataURL(value, {
              ...options,
              type: 'image/png',
            })
          } catch {
            dataUrl = null
          }

          if (canvasRef.current) {
            await QRCodeModule.toCanvas(canvasRef.current, value, options)
          }

          const svgString = await QRCodeModule.toString(value, {
            ...options,
            type: 'svg',
          })

          if (!isActive) return

          store.setStates({
            dataUrl,
            svgString,
            isGenerating: false,
            generatingKey: null,
            error: null,
            generationKey,
          })
          onGeneratedRef.current?.()
        } catch (error) {
          if (!isActive) return

          const parsedError = error instanceof Error ? error : new Error('Failed to generate QR code')
          store.setStates({ error: parsedError, isGenerating: false, generatingKey: null })
          onErrorRef.current?.(parsedError)
        }
      }

      void generate()

      return () => {
        isActive = false
      }
    }, [generationKey, value, resolvedSize, level, margin, rawForegroundColor, backgroundColor, store])

    const contextValue = React.useMemo<QRCodeContextValue>(
      () => ({
        value,
        size: resolvedSize,
        margin,
        level,
        foregroundColor: rawForegroundColor,
        backgroundColor,
        canvasRef,
        rootRef,
        width: resolvedWidth,
        height: resolvedHeight,
        radius,
      }),
      [value, resolvedSize, margin, level, rawForegroundColor, backgroundColor, resolvedWidth, resolvedHeight, radius],
    )
    const RootPrimitive = asChild ? Slot : 'div'

    return (
      <QRCodeStoreContext.Provider value={store}>
        <QRCodeContext.Provider value={contextValue}>
          <RootPrimitive
            ref={composedRootRef}
            data-slot="qr-code"
            className={cn('relative inline-flex flex-col items-center gap-2', className)}
            style={
              {
                '--qr-code-size': `${resolvedSize}px`,
                '--qr-code-width': `${resolvedWidth}px`,
                '--qr-code-height': `${resolvedHeight}px`,
                ...getRadiusStyles(radius),
                ...style,
              } as React.CSSProperties
            }
            {...props}
          >
            {children}
          </RootPrimitive>
        </QRCodeContext.Provider>
      </QRCodeStoreContext.Provider>
    )
  },
)

QRCodeRoot.displayName = ROOT_NAME

export type QRCodeCanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>

const QRCodeCanvas = React.forwardRef<HTMLCanvasElement, QRCodeCanvasProps>(({ className, style, ...props }, ref) => {
  const context = useQRCodeContext(CANVAS_NAME)
  const generationKey = useQRCodeStore(state => state.generationKey)
  const composedRef = useComposedRefs(ref, context.canvasRef)

  return (
    <canvas
      ref={composedRef}
      role="img"
      aria-label="QR code"
      data-slot="qr-code-canvas"
      width={context.size}
      height={context.size}
      className={cn('relative block max-w-full', !generationKey && 'invisible', className)}
      style={{ width: context.size, height: context.size, borderRadius: 'var(--element-border-radius)', ...style }}
      {...props}
    />
  )
})

QRCodeCanvas.displayName = CANVAS_NAME

export interface QRCodeSvgProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const QRCodeSvg = React.forwardRef<HTMLDivElement, QRCodeSvgProps>(
  ({ asChild = false, className, style, ...props }, ref) => {
    const context = useQRCodeContext(SVG_NAME)
    const svgString = useQRCodeStore(state => state.svgString)
    const SvgPrimitive = asChild ? Slot : 'div'

    if (!svgString) return null

    return (
      <SvgPrimitive
        ref={ref}
        role="img"
        aria-label="QR code"
        data-slot="qr-code-svg"
        className={cn('relative block max-w-full', className)}
        style={{ width: context.size, height: context.size, borderRadius: 'var(--element-border-radius)', ...style }}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG markup is generated by the QR renderer from the encoded value.
        dangerouslySetInnerHTML={{ __html: svgString }}
        {...props}
      />
    )
  },
)

QRCodeSvg.displayName = SVG_NAME

export interface QRCodeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asChild?: boolean
}

const QRCodeImage = React.forwardRef<HTMLImageElement, QRCodeImageProps>(
  ({ alt = 'QR code', asChild = false, className, style, ...props }, ref) => {
    const context = useQRCodeContext(IMAGE_NAME)
    const dataUrl = useQRCodeStore(state => state.dataUrl)
    const ImagePrimitive = asChild ? Slot : 'img'

    if (!dataUrl) return null

    return (
      <ImagePrimitive
        ref={ref}
        data-slot="qr-code-image"
        src={dataUrl}
        alt={alt}
        width={context.size}
        height={context.size}
        className={cn('relative block max-w-full', className)}
        style={{ width: context.size, height: context.size, borderRadius: 'var(--element-border-radius)', ...style }}
        {...props}
      />
    )
  },
)

QRCodeImage.displayName = IMAGE_NAME

export interface QRCodeOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const QRCodeOverlay = React.forwardRef<HTMLDivElement, QRCodeOverlayProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const OverlayPrimitive = asChild ? Slot : 'div'

    return (
      <OverlayPrimitive
        ref={ref}
        data-slot="qr-code-overlay"
        className={cn(
          'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm bg-background',
          className,
        )}
        {...props}
      />
    )
  },
)

QRCodeOverlay.displayName = 'QRCode.Overlay'

export interface QRCodeSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const QRCodeSkeleton = React.forwardRef<HTMLDivElement, QRCodeSkeletonProps>(
  ({ asChild = false, className, style, ...props }, ref) => {
    const context = useQRCodeContext(SKELETON_NAME)
    const generationKey = useQRCodeStore(state => state.generationKey)
    const dataUrl = useQRCodeStore(state => state.dataUrl)
    const svgString = useQRCodeStore(state => state.svgString)
    const SkeletonPrimitive = asChild ? Slot : 'div'

    if (generationKey || dataUrl || svgString) return null

    return (
      <SkeletonPrimitive
        ref={ref}
        aria-hidden="true"
        data-slot="qr-code-skeleton"
        className={cn('absolute animate-pulse rounded-md bg-muted', className)}
        style={{ width: context.size, height: context.size, ...style }}
        {...props}
      />
    )
  },
)

QRCodeSkeleton.displayName = SKELETON_NAME

export interface QRCodeDownloadProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  filename?: string
  format?: QRCodeDownloadFormat
}

const QRCodeDownload = React.forwardRef<HTMLButtonElement, QRCodeDownloadProps>(
  ({ filename = 'qrcode', format = 'png', children, onClick, disabled, type = 'button', ...props }, ref) => {
    const dataUrl = useQRCodeStore(state => state.dataUrl)
    const svgString = useQRCodeStore(state => state.svgString)

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return

        const link = document.createElement('a')

        let objectUrl: string | null = null

        if (format === 'png' && dataUrl) {
          link.href = dataUrl
          link.download = `${filename}.png`
        } else if (format === 'svg' && svgString) {
          const blob = new Blob([svgString], { type: 'image/svg+xml' })
          objectUrl = URL.createObjectURL(blob)
          link.href = objectUrl
          link.download = `${filename}.svg`
        } else {
          return
        }

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        if (objectUrl) {
          window.setTimeout(() => URL.revokeObjectURL(objectUrl), 100)
        }
      },
      [dataUrl, svgString, filename, format, onClick],
    )

    return (
      <button
        ref={ref}
        type={type}
        data-slot="qr-code-download"
        disabled={disabled || (format === 'png' ? !dataUrl : !svgString)}
        onClick={handleClick}
        {...props}
      >
        {children ?? `Download ${format.toUpperCase()}`}
      </button>
    )
  },
)

QRCodeDownload.displayName = 'QRCode.Download'

const QRCode = Object.assign(QRCodeRoot, {
  Canvas: QRCodeCanvas,
  Svg: QRCodeSvg,
  Image: QRCodeImage,
  Overlay: QRCodeOverlay,
  Skeleton: QRCodeSkeleton,
  Download: QRCodeDownload,
})

export {
  QRCode,
  QRCodeCanvas,
  QRCodeDownload,
  QRCodeImage,
  QRCodeOverlay,
  QRCodeRoot,
  QRCodeSkeleton,
  QRCodeSvg,
  useQRCodeStore as useQRCode,
}
