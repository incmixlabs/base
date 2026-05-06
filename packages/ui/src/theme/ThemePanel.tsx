'use client'

import type * as React from 'react'
import { ColorSwatchPicker } from '@/elements/menu/ColorSwatchPicker'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Text } from '@/typography'
import { capitalize } from '@/utils/strings'
import { accentColors } from './props/color.prop'
import { useThemeContext } from './theme-provider.context'
import type { AccentColor } from './tokens'

const accentColorOptions = accentColors.map(value => ({
  value,
  label: capitalize(value),
  swatchColor: `var(--${value}-9, var(--color-accent-primary))`,
}))

const accentColorValues: readonly string[] = accentColors

function isAccentColor(value: string): value is AccentColor {
  return accentColorValues.includes(value)
}

export interface ThemePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  pickerSize?: 'sm' | 'md' | 'lg'
  showHeading?: boolean
}

export function ThemePanel({ className, pickerSize = 'sm', showHeading = true, ...props }: ThemePanelProps) {
  const theme = useThemeContext()

  return (
    <Flex direction="column" gap="3" className={cn('min-w-56', className)} {...props}>
      {showHeading ? (
        <div>
          <Text size="md" weight="medium">
            Theme
          </Text>
          <Text size="xs" className="mt-1 block text-muted-foreground">
            Customize shared theme settings.
          </Text>
        </div>
      ) : null}
      <ColorSwatchPicker
        label="Accent color"
        value={theme.accentColor}
        options={accentColorOptions}
        size={pickerSize}
        onChange={value => {
          if (isAccentColor(value)) {
            theme.onAccentColorChange(value)
          }
        }}
      />
    </Flex>
  )
}
