import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { StatusIcon } from './StatusIcon'

afterEach(() => {
  cleanup()
})

describe('StatusIcon', () => {
  it.each([
    ['todo', 'lucide-circle'],
    ['triage', 'lucide-circle-minus'],
    ['review', 'lucide-eye'],
    ['in-progress', 'lucide-ellipsis'],
    ['on-hold', 'lucide-pause'],
    ['rejected', 'lucide-circle-x'],
    ['done', 'lucide-circle-check-big'],
  ] as const)('renders %s via Icon with the expected lucide glyph', (status, iconClass) => {
    const { container } = render(<StatusIcon status={status} />)

    const icon = container.querySelector(`svg.${iconClass}`)
    expect(icon).not.toBeNull()
    expect(icon?.getAttribute('aria-hidden')).toBe('true')
  })
})
