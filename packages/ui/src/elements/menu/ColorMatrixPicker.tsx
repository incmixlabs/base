'use client'

import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { DropdownMenu } from '@/elements/menu/DropdownMenu'
import { Grid } from '@/layouts/grid/Grid'
import { cn } from '@/lib/utils'
import { HUE_NAMES, HUE_STEPS, type HueName, type HueStep } from '@/theme/tokens'

export interface ColorMatrixPickerProps {
  value: string
  onChange: (color: string) => void
  onCommit?: (color: string) => void
  label?: string
  disabled?: boolean
  preferredColors?: string[]
  recentColors?: string[]
}

const MATRIX_STEPS = HUE_STEPS.filter((step): step is HueStep => {
  const numericStep = Number(step)
  return Number.isInteger(numericStep) && numericStep >= 3 && numericStep <= 11
})

const getColorVar = (family: HueName, step: HueStep) => `var(--${family}-${step})`

export const COLOR_MATRIX_ROW_LENGTH = MATRIX_STEPS.length

type ColorSwatchOption = {
  key: string
  color: string
  label: string
  shape: 'round' | 'square'
}

type ColorSwatchRow = {
  key: string
  label?: 'Preferred' | 'Recent'
  swatches: ColorSwatchOption[]
}

type IndexedColorSwatchRow = Omit<ColorSwatchRow, 'swatches'> & {
  rowIndex: number
  swatches: Array<
    ColorSwatchOption & {
      rowIndex: number
      columnIndex: number
      flatIndex: number
    }
  >
}

export function ColorMatrixPicker({
  value,
  onChange,
  onCommit,
  label = 'Color',
  disabled = false,
  preferredColors = [],
  recentColors = [],
}: ColorMatrixPickerProps) {
  const swatchRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const pendingCommitRef = React.useRef<string | null>(null)
  const columnCount = MATRIX_STEPS.length

  const indexedRows = React.useMemo(() => {
    const colorRows: ColorSwatchRow[] = []
    const preferredColorOptions = preferredColors.filter(Boolean).slice(0, COLOR_MATRIX_ROW_LENGTH)
    const recentColorOptions = recentColors.filter(Boolean).slice(0, COLOR_MATRIX_ROW_LENGTH)

    if (preferredColorOptions.length > 0) {
      colorRows.push({
        key: 'preferred',
        label: 'Preferred',
        swatches: preferredColorOptions.map((color, index) => ({
          key: `preferred-${color}-${index}`,
          color,
          label: `Preferred color ${index + 1}: ${color}`,
          shape: 'square',
        })),
      })
    }

    if (recentColorOptions.length > 0) {
      colorRows.push({
        key: 'recent',
        label: 'Recent',
        swatches: recentColorOptions.map((color, index) => ({
          key: `recent-${color}-${index}`,
          color,
          label: `Recent color ${index + 1}: ${color}`,
          shape: 'square',
        })),
      })
    }

    for (const family of HUE_NAMES) {
      colorRows.push({
        key: family,
        swatches: MATRIX_STEPS.map(step => {
          const colorVar = getColorVar(family, step)
          return {
            key: `${family}-${step}`,
            color: colorVar,
            label: `${family} ${step}`,
            shape: 'round',
          }
        }),
      })
    }

    let nextFlatIndex = 0
    return colorRows.map((row, rowIndex) => ({
      ...row,
      rowIndex,
      swatches: row.swatches.map((swatch, columnIndex) => ({
        ...swatch,
        rowIndex,
        columnIndex,
        flatIndex: nextFlatIndex++,
      })),
    }))
  }, [preferredColors, recentColors])

  const totalCount = React.useMemo(() => {
    return indexedRows.reduce((acc, row) => acc + row.swatches.length, 0)
  }, [indexedRows])

  const [focusedIndex, setFocusedIndex] = React.useState(() => {
    const swatches = indexedRows.flatMap(row => row.swatches)
    const selectedIndex = swatches.findIndex(swatch => swatch.color === value)
    return selectedIndex !== -1 ? selectedIndex : 0
  })

  React.useEffect(() => {
    const swatches = indexedRows.flatMap(row => row.swatches)
    const selectedIndex = swatches.findIndex(swatch => swatch.color === value)
    if (selectedIndex !== -1) {
      setFocusedIndex(selectedIndex)
    }
  }, [value, indexedRows])

  const focusSwatchByFlatIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, totalCount - 1))
    setFocusedIndex(nextIndex)
    swatchRefs.current[nextIndex]?.focus()
  }

  const focusSwatchByPosition = (rowIndex: number, columnIndex: number) => {
    const row = indexedRows[Math.max(0, Math.min(rowIndex, indexedRows.length - 1))]
    if (!row) return
    const swatch = row.swatches[Math.max(0, Math.min(columnIndex, row.swatches.length - 1))]
    if (!swatch) return
    setFocusedIndex(swatch.flatIndex)
    swatchRefs.current[swatch.flatIndex]?.focus()
  }

  const handleSwatchKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    swatch: IndexedColorSwatchRow['swatches'][number],
  ) => {
    let handled = true

    if (event.key === 'ArrowRight') {
      focusSwatchByFlatIndex(swatch.flatIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      focusSwatchByFlatIndex(swatch.flatIndex - 1)
    } else if (event.key === 'ArrowDown') {
      focusSwatchByPosition(swatch.rowIndex + 1, swatch.columnIndex)
    } else if (event.key === 'ArrowUp') {
      focusSwatchByPosition(swatch.rowIndex - 1, swatch.columnIndex)
    } else if (event.key === 'Home') {
      focusSwatchByPosition(swatch.rowIndex, 0)
    } else if (event.key === 'End') {
      focusSwatchByPosition(swatch.rowIndex, columnCount - 1)
    } else {
      handled = false
    }

    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) {
        pendingCommitRef.current = null
        return
      }

      const pendingColor = pendingCommitRef.current
      pendingCommitRef.current = null
      if (pendingColor) {
        onCommit?.(pendingColor)
      }
    },
    [onCommit],
  )

  const handleColorSelect = React.useCallback(
    (color: string) => {
      pendingCommitRef.current = color
      onChange(color)
    },
    [onChange],
  )

  return (
    <DropdownMenu.Root onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger>
        <Button
          variant="soft"
          color="inverse"
          radius="lg"
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 h-8 shrink-0 text-xs font-semibold"
        >
          <span
            className="w-4 h-4 rounded-full border border-[var(--color-inverse-border)]/60"
            style={{ backgroundColor: value }}
            aria-hidden
          />
          <span className="opacity-70">{label}</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        size="sm"
        align="start"
        sideOffset={6}
        className="p-3 min-w-[240px] max-h-[70vh] overflow-y-auto"
      >
        <div role="radiogroup" aria-label={`${label} options`} aria-disabled={disabled || undefined}>
          {indexedRows.map(row => {
            const grid = (
              <Grid
                key={`${row.key}-grid`}
                columns={`repeat(${columnCount}, minmax(0, 1fr))`}
                gap="1"
                className="select-none"
              >
                {row.swatches.map(swatch => {
                  const isSelected = value === swatch.color
                  return (
                    <button
                      key={swatch.key}
                      ref={node => {
                        swatchRefs.current[swatch.flatIndex] = node
                      }}
                      type="button"
                      role="radio"
                      tabIndex={swatch.flatIndex === focusedIndex ? 0 : -1}
                      aria-checked={isSelected}
                      aria-label={swatch.label}
                      disabled={disabled}
                      onClick={() => handleColorSelect(swatch.color)}
                      onKeyDown={event => handleSwatchKeyDown(event, swatch)}
                      onFocus={() => setFocusedIndex(swatch.flatIndex)}
                      style={{ backgroundColor: swatch.color }}
                      className={cn(
                        'h-5 w-5 cursor-pointer border p-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                        swatch.shape === 'round' ? 'rounded min-w-0' : 'rounded-sm',
                        isSelected
                          ? 'border-white scale-125 shadow-md ring-1 ring-primary'
                          : 'border-black/10 hover:scale-110 active:scale-95',
                        disabled && 'cursor-not-allowed opacity-50 hover:scale-100 active:scale-100',
                      )}
                      title={swatch.label}
                    />
                  )
                })}
              </Grid>
            )

            if (!row.label) return grid

            return (
              <div key={row.key} className="mb-3">
                <DropdownMenu.Label className="mb-2 px-0">{row.label}</DropdownMenu.Label>
                {grid}
                <DropdownMenu.Separator className="mt-3" />
              </div>
            )
          })}
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
