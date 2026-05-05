'use client'
import { HoverCard } from '@/elements/hover-card/HoverCard'
import { Flex } from '@/layouts/flex/Flex'
import { semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { Text } from '@/typography/text/Text'
import { formatNumber } from '@/utils/number'

export type StackedSummaryBarSegment = {
  label: string
  value: number
  color: Color
}

export interface StackedSummaryBarProps {
  segments: readonly StackedSummaryBarSegment[]
  className?: string
}

export function StackedSummaryBar({ segments, className }: StackedSummaryBarProps) {
  const normalizedSegments = segments.map(segment => ({
    ...segment,
    value: Number.isFinite(segment.value) && segment.value > 0 ? segment.value : 0,
  }))
  const total = normalizedSegments.reduce((sum, segment) => sum + segment.value, 0)

  if (normalizedSegments.length === 0 || !Number.isFinite(total) || total <= 0) return null

  return (
    <HoverCard.Root>
      <HoverCard.Trigger
        render={<button type="button" aria-label="Show segment breakdown" />}
        nativeButton
        className={className}
        style={{ width: '100%' }}
      >
        <div className="flex h-full min-h-3 w-full overflow-hidden bg-[var(--color-neutral-soft)]">
          {normalizedSegments.map((segment, index) => (
            <div
              key={`${segment.label}-${index}`}
              style={{
                width: `${(segment.value / total) * 100}%`,
                backgroundColor: semanticColorVar(segment.color, 'primary'),
              }}
            />
          ))}
        </div>
      </HoverCard.Trigger>
      <HoverCard.Content side="top" align="center" size="sm">
        <Flex direction="column" gap="2">
          {normalizedSegments.map((segment, index) => (
            <Flex key={`${segment.label}-${index}`} align="center" gap="2">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: semanticColorVar(segment.color, 'primary') }}
              />
              <Text as="span" size="sm">
                {segment.label} ({formatNumber(segment.value)})
              </Text>
            </Flex>
          ))}
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
