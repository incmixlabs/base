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
  recentColors?: string[]
}

const MATRIX_STEPS = HUE_STEPS.filter((step): step is HueStep => {
  const numericStep = Number(step)
  return Number.isInteger(numericStep) && numericStep >= 3 && numericStep <= 11
})

const getColorVar = (family: HueName, step: HueStep) => `var(--${family}-${step})`

const RECENT_COLOR_LIMIT = 9

export function ColorMatrixPicker({
  value,
  onChange,
  onCommit,
  label = 'Color',
  disabled = false,
  recentColors = [],
}: ColorMatrixPickerProps) {
  const swatchRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const pendingCommitRef = React.useRef<string | null>(null)
  const columnCount = MATRIX_STEPS.length
  const totalCount = HUE_NAMES.length * MATRIX_STEPS.length
  const recentColorOptions = recentColors.filter(Boolean).slice(0, RECENT_COLOR_LIMIT)

  const focusSwatch = React.useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, totalCount - 1))
      swatchRefs.current[nextIndex]?.focus()
    },
    [totalCount],
  )

  const handleSwatchKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | undefined

      if (event.key === 'ArrowRight') {
        nextIndex = index + 1
      } else if (event.key === 'ArrowLeft') {
        nextIndex = index - 1
      } else if (event.key === 'ArrowDown') {
        nextIndex = index + columnCount
      } else if (event.key === 'ArrowUp') {
        nextIndex = index - columnCount
      } else if (event.key === 'Home') {
        nextIndex = index - (index % columnCount)
      } else if (event.key === 'End') {
        nextIndex = index - (index % columnCount) + columnCount - 1
      }

      if (nextIndex === undefined) return

      event.preventDefault()
      event.stopPropagation()
      focusSwatch(nextIndex)
    },
    [focusSwatch],
  )

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
        {recentColorOptions.length > 0 && (
          <div className="mb-3">
            <DropdownMenu.Label className="mb-2 px-0">Recent</DropdownMenu.Label>
            <Grid columns={`repeat(${RECENT_COLOR_LIMIT}, minmax(0, 1fr))`} gap="1">
              {recentColorOptions.map((color, index) => {
                const isSelected = value === color
                return (
                  <button
                    key={`${color}-${index}`}
                    type="button"
                    aria-label={`Recent color ${index + 1}`}
                    disabled={disabled}
                    onClick={() => handleColorSelect(color)}
                    style={{ backgroundColor: color }}
                    className={cn(
                      'h-5 w-5 cursor-pointer rounded-sm border p-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                      isSelected
                        ? 'border-white scale-110 shadow-md ring-1 ring-primary'
                        : 'border-black/10 hover:scale-105 active:scale-95',
                      disabled && 'cursor-not-allowed opacity-50 hover:scale-100 active:scale-100',
                    )}
                    title={color}
                  />
                )
              })}
            </Grid>
            <DropdownMenu.Separator className="mt-3" />
          </div>
        )}
        <Grid
          role="radiogroup"
          aria-label={`${label} options`}
          aria-disabled={disabled || undefined}
          columns={`repeat(${columnCount}, minmax(0, 1fr))`}
          gap="1"
          className="select-none"
        >
          {HUE_NAMES.map((family, rowIndex) =>
            MATRIX_STEPS.map((step, columnIndex) => {
              const colorVar = getColorVar(family, step)
              const isSelected = value === colorVar
              const swatchIndex = rowIndex * columnCount + columnIndex
              const swatchLabel = `${family} ${step}`
              return (
                <button
                  key={`${family}-${step}`}
                  ref={node => {
                    swatchRefs.current[swatchIndex] = node
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={swatchLabel}
                  disabled={disabled}
                  onClick={() => handleColorSelect(colorVar)}
                  onKeyDown={event => handleSwatchKeyDown(event, swatchIndex)}
                  style={{ backgroundColor: colorVar }}
                  className={cn(
                    'w-5 h-5 rounded cursor-pointer transition-all border p-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                    isSelected
                      ? 'border-white scale-125 shadow-md ring-1 ring-primary'
                      : 'border-black/10 hover:scale-110 active:scale-95',
                    disabled && 'cursor-not-allowed opacity-50 hover:scale-100 active:scale-100',
                  )}
                  title={swatchLabel}
                />
              )
            }),
          )}
        </Grid>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
