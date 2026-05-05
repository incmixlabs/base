'use client'

import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { Grid } from '@/layouts/grid/Grid'
import { cn } from '@/lib/utils'
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
}

interface SwatchTooltipButtonProps {
  swatch: ColorSwatchOption
  active: boolean
  onSelect: (value: string) => void
  onHoverChange: (swatch: ColorSwatchOption | null) => void
}

function SwatchTooltipButton({
  swatch,
  active,
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
      onMouseEnter={() => onHoverChange(swatch)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(swatch)}
      onBlur={() => onHoverChange(null)}
      onClick={() => onSelect(swatch.value)}
      className={cn(
        sizeClass,
        'rounded-full border transition-transform',
        active ? 'border-foreground scale-110' : 'border-border hover:scale-105',
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
}: ColorSwatchPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hoveredSwatch, setHoveredSwatch] = React.useState<ColorSwatchOption | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const listboxId = React.useId()
  const activeSwatch = options.find(swatch => swatch.value === value)
  const triggerSwatchClass = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4'
  const gridColumns = size === 'lg' ? '5' : '6'
  const popupWidthClass = size === 'lg' ? 'w-[248px]' : 'w-[220px]'
  const triggerClass =
    size === 'lg'
      ? 'min-h-11 px-4 py-2 text-sm'
      : size === 'md'
        ? 'min-h-10 min-w-[10rem] px-3 py-2 text-sm'
        : 'px-2 py-1 text-xs'

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
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

  return (
    <div className="relative flex flex-col gap-2" ref={containerRef}>
      <Flex align="center" justify={showLabel ? 'between' : 'end'}>
        {showLabel ? (
          <Text size="lg" weight="medium" className="text-muted-foreground">
            {label}
          </Text>
        ) : null}
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={`Choose hue for ${label}`}
          onClick={() => setOpen(previous => !previous)}
          className={cn(
            'inline-flex items-center justify-between gap-3 rounded-xl border border-input bg-background',
            triggerClass,
          )}
        >
          <Flex as="span" align="center" gap="3">
            <span
              className={cn(triggerSwatchClass, 'inline-block rounded-full border border-border')}
              style={{ backgroundColor: activeSwatch?.swatchColor ?? `hsl(${value})` }}
              aria-hidden
            />
            <Text as="span" size={size === 'lg' ? 'lg' : 'md'}>
              {activeSwatch?.label ?? 'Custom'}
            </Text>
          </Flex>
        </button>
      </Flex>
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={`${label} options`}
          className={cn(
            'absolute right-0 top-full z-50 mt-1 rounded-lg border border-border bg-background p-3 shadow-lg',
            popupWidthClass,
          )}
        >
          <Flex direction="column" gap="2">
            <Flex align="center" gap="3" className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
              <span
                className="inline-block h-4 w-4 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: (hoveredSwatch ?? activeSwatch)?.swatchColor }}
                aria-hidden
              />
              <Flex direction="column" gap="0">
                <Text size="xs" className="text-muted-foreground">
                  {label}
                </Text>
                <Text size="sm" weight="medium">
                  {hoveredSwatch?.label ?? activeSwatch?.label ?? 'Select color'}
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
                    size={size}
                    onHoverChange={setHoveredSwatch}
                    onSelect={nextValue => {
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
      )}
    </div>
  )
}
