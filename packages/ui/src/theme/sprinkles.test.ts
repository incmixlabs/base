import { describe, expect, it } from 'vitest'
import { sprinkles } from './sprinkles'

describe('sprinkles', () => {
  it('maps spacing, radius, layout, and color props through token utility classes', () => {
    expect(
      sprinkles({
        alignItems: 'center',
        bg: 'primary',
        borderColor: 'neutral',
        borderRadius: 'lg',
        display: 'flex',
        gap: '4',
        p: { initial: '2', md: '6' },
      }),
    ).toBe('flex items-center gap-4 p-2 md:p-6 bg-primary border-[var(--color-neutral-border)] rounded-lg')
  })

  it('uses explicit arbitrary properties for typography tokens', () => {
    expect(
      sprinkles({
        fontSize: { initial: 'md', lg: '2x' },
        letterSpacing: 'sm',
        lineHeight: 'lg',
      }),
    ).toBe(
      '[font-size:var(--font-size-md)] lg:[font-size:var(--font-size-2x)] leading-[var(--line-height-lg)] tracking-[var(--letter-spacing-sm)]',
    )
  })
})
