'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { Flex } from '@/layouts/flex/Flex'
import { Grid } from '@/layouts/grid/Grid'
import { cn } from '@/lib/utils'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import { Text } from '@/typography'

export interface ColorSwatchOption {
  label: string
  value: string
  swatchColor: string
}

export interface ColorSwatchPickerProps {
  label: string
  value: string
  options: readonly ColorSwatchOption[]
  onChange: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  disabled?: boolean
  placeholder?: string
  triggerMode?: 'button' | 'swatch'
  portal?: boolean
}

interface SwatchTooltipButtonProps {
  swatch: ColorSwatchOption
  active: boolean
  disabled?: boolean
  onSelect: (value: string) => void
  onHoverChange: (swatch: ColorSwatchOption | null) => void
}

function SwatchTooltipButton({
  swatch,
  active,
  disabled = false,
  onSelect,
  onHoverChange,
  size = 'sm',
}: SwatchTooltipButtonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-8 w-8' : size === 'md' ? 'h-7 w-7' : 'h-6 w-6'

  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      aria-label={swatch.label}
      disabled={disabled}
      onMouseEnter={() => onHoverChange(swatch)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(swatch)}
      onBlur={() => onHoverChange(null)}
      onClick={() => onSelect(swatch.value)}
      className={cn(
        sizeClass,
        'rounded-full border transition-transform',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : active
            ? 'border-primary scale-110'
            : 'border-neutral hover:scale-105',
      )}
      style={{ backgroundColor: swatch.swatchColor ?? `hsl(${swatch.value})` }}
    />
  )
}

export function ColorSwatchPicker({
  label,
  value,
  options,
  onChange,
  size = 'sm',
  showLabel = true,
  disabled = false,
  placeholder = 'Select color',
  triggerMode = 'button',
  portal = false,
}: ColorSwatchPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hoveredSwatch, setHoveredSwatch] = React.useState<ColorSwatchOption | null>(null)
  const [portalPosition, setPortalPosition] = React.useState<{
    left: number
    maxHeight: number
    top: number
    width: number
  } | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const themePortalContainer = useThemePortalContainer()
  const portalContainer = portal
    ? (themePortalContainer ?? (typeof document !== 'undefined' ? document.body : null))
    : null
  const listboxId = React.useId()
  const activeSwatch = options.find(swatch => swatch.value === value)
  const selectedLabel = activeSwatch?.label ?? (value ? 'Custom' : placeholder)
  const selectedSwatchColor = activeSwatch?.swatchColor ?? (value ? `hsl(${value})` : 'transparent')
  const gridColumnCount = size === 'lg' ? 5 : 6
  const triggerSwatchClass = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4'
  const gridColumns = String(gridColumnCount)
  const popupWidthClass = size === 'lg' ? 'w-[248px]' : 'w-[220px]'
  const triggerClass =
    size === 'lg'
      ? 'min-h-11 px-4 py-2 text-sm'
      : size === 'md'
        ? 'min-h-10 min-w-[10rem] px-3 py-2 text-sm'
        : 'px-2 py-1 text-xs'
  const compactTriggerClass = size === 'lg' ? 'h-7 w-7' : size === 'md' ? 'h-6 w-6' : 'h-5 w-5'
  const portalPopupWidth = size === 'lg' ? 248 : 220

  const updatePortalPosition = React.useCallback(() => {
    if (!portal || typeof window === 'undefined') return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const viewportPadding = 8
    const triggerGap = 4
    const maxLeft = window.innerWidth - portalPopupWidth - viewportPadding
    const swatchSize = size === 'lg' ? 32 : size === 'md' ? 28 : 24
    const fallbackPopupHeight = Math.min(320, 96 + Math.ceil(options.length / gridColumnCount) * (swatchSize + 8))
    const popupHeight = Math.min(
      popupRef.current?.offsetHeight ?? fallbackPopupHeight,
      window.innerHeight - viewportPadding * 2,
    )
    const availableBelow = window.innerHeight - rect.bottom - viewportPadding - triggerGap
    const availableAbove = rect.top - viewportPadding - triggerGap
    const placeAbove = availableBelow < popupHeight && availableAbove > availableBelow
    const availableHeight = placeAbove ? availableAbove : availableBelow
    const maxHeight = Math.max(120, Math.min(popupHeight, availableHeight, window.innerHeight - viewportPadding * 2))

    setPortalPosition({
      left: Math.max(viewportPadding, Math.min(rect.right - portalPopupWidth, maxLeft)),
      maxHeight,
      top: placeAbove
        ? Math.max(viewportPadding, rect.top - triggerGap - maxHeight)
        : Math.min(rect.bottom + triggerGap, window.innerHeight - viewportPadding - maxHeight),
      width: portalPopupWidth,
    })
  }, [gridColumnCount, options.length, portal, portalPopupWidth, size])

  const toggleOpen = React.useCallback(() => {
    if (disabled) return
    updatePortalPosition()
    setOpen(previous => !previous)
  }, [disabled, updatePortalPosition])

  React.useEffect(() => {
    if (disabled) {
      setOpen(false)
    }
  }, [disabled])

  React.useEffect(() => {
    if (!open) {
      setHoveredSwatch(null)
    }
  }, [open])

  React.useEffect(() => {
    if (!open || !portal) return
    updatePortalPosition()

    window.addEventListener('resize', updatePortalPosition)
    window.addEventListener('scroll', updatePortalPosition, true)
    return () => {
      window.removeEventListener('resize', updatePortalPosition)
      window.removeEventListener('scroll', updatePortalPosition, true)
    }
  }, [open, portal, updatePortalPosition])

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!containerRef.current?.contains(target) && !popupRef.current?.contains(target)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const popup = open ? (
    <div
      id={listboxId}
      ref={popupRef}
      role="listbox"
      aria-label={`${label} options`}
      className={cn(
        portal ? 'fixed z-[1000]' : 'absolute right-0 top-full z-50 mt-1',
        'rounded-lg border border-neutral bg-neutral-surface p-3 shadow-lg',
        portal ? 'overflow-y-auto' : undefined,
        portal ? undefined : popupWidthClass,
      )}
      style={portal && portalPosition ? portalPosition : undefined}
    >
      <Flex direction="column" gap="2">
        <Flex align="center" gap="3" className="rounded-lg border border-neutral bg-neutral-soft px-3 py-2">
          <span
            className="inline-block h-4 w-4 shrink-0 rounded-full border border-neutral"
            style={{ backgroundColor: (hoveredSwatch ?? activeSwatch)?.swatchColor ?? selectedSwatchColor }}
            aria-hidden
          />
          <Flex direction="column" gap="0">
            <Text size="xs" className="text-neutral">
              {label}
            </Text>
            <Text size="sm" weight="medium">
              {hoveredSwatch?.label ?? selectedLabel}
            </Text>
          </Flex>
        </Flex>
        <Grid columns={gridColumns} gap="2">
          {options.map(swatch => {
            const active = swatch.value === value
            return (
              <SwatchTooltipButton
                key={swatch.label}
                swatch={swatch}
                active={active}
                disabled={disabled}
                size={size}
                onHoverChange={setHoveredSwatch}
                onSelect={nextValue => {
                  if (disabled) return
                  onChange(nextValue)
                  setOpen(false)
                  setHoveredSwatch(null)
                }}
              />
            )
          })}
        </Grid>
      </Flex>
    </div>
  ) : null

  return (
    <div
      className={triggerMode === 'swatch' ? 'relative inline-flex' : 'relative flex flex-col gap-2'}
      ref={containerRef}
    >
      {triggerMode === 'swatch' ? (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={`Choose hue for ${label}`}
          disabled={disabled}
          onClick={toggleOpen}
          className={cn(
            compactTriggerClass,
            'inline-flex items-center justify-center rounded-full border border-neutral bg-neutral-surface p-0',
            disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          <span
            className="inline-block h-full w-full rounded-full border border-neutral"
            style={{ backgroundColor: selectedSwatchColor }}
            aria-hidden
          />
        </button>
      ) : (
        <Flex align="center" justify={showLabel ? 'between' : 'end'}>
          {showLabel ? (
            <Text size="lg" weight="medium" className="text-neutral">
              {label}
            </Text>
          ) : null}
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-label={`Choose hue for ${label}`}
            disabled={disabled}
            onClick={toggleOpen}
            className={cn(
              'inline-flex items-center justify-between gap-3 rounded-xl border border-neutral bg-neutral-surface',
              disabled && 'cursor-not-allowed opacity-60',
              triggerClass,
            )}
          >
            <Flex as="span" align="center" gap="3">
              <span
                className={cn(triggerSwatchClass, 'inline-block rounded-full border border-neutral')}
                style={{ backgroundColor: selectedSwatchColor }}
                aria-hidden
              />
              <Text as="span" size={size === 'lg' ? 'lg' : 'md'}>
                {selectedLabel}
              </Text>
            </Flex>
          </button>
        </Flex>
      )}
      {portal && portalContainer ? createPortal(popup, portalContainer) : popup}
    </div>
  )
}
