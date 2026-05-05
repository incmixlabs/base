import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { HUE_NAMES } from '@/theme/tokens'
import { Avatar } from './Avatar'
import {
  avatarFallbackMuted,
  avatarRadiusByRadius,
  avatarSoftFallbackByHueTone,
  avatarSolidFallbackByHueTone,
} from './avatar.css'
import { AVATAR_SIZE_CLASS, AvatarProvider, avatarSizeStyles } from './avatar.context'
import { stringToAvatarSoftTone, stringToAvatarSolidTone, stringToHue } from './avatar.shared'

afterEach(() => {
  cleanup()
})

describe('Avatar', () => {
  describe('Image loading', () => {
    it('renders an image when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="User avatar" />)
      const img = screen.getByRole('img', { name: 'User avatar' })
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('shows fallback while image is loading', () => {
      render(<Avatar src="https://example.com/avatar.jpg" name="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('hides fallback after image loads', async () => {
      render(<Avatar src="https://example.com/avatar.jpg" name="John Doe" />)
      const img = screen.getByRole('img')

      expect(screen.getByText('JD')).toBeInTheDocument()

      img.dispatchEvent(new Event('load', { bubbles: true }))

      await waitFor(() => {
        expect(img).not.toHaveClass('opacity-0')
      })
    })

    it('shows fallback when image fails to load', async () => {
      render(<Avatar src="https://example.com/broken.jpg" name="John Doe" />)
      const img = screen.getByRole('img')

      img.dispatchEvent(new Event('error', { bubbles: true }))

      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument()
      })
    })

    it('resets error state when src changes', async () => {
      const { rerender } = render(<Avatar src="https://example.com/broken.jpg" name="John Doe" />)
      const img = screen.getByRole('img')

      img.dispatchEvent(new Event('error', { bubbles: true }))

      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument()
      })

      rerender(<Avatar src="https://example.com/new.jpg" name="John Doe" />)
      const newImg = screen.getByRole('img')
      expect(newImg).toHaveAttribute('src', 'https://example.com/new.jpg')
    })
  })

  describe('Name to initials', () => {
    it('converts single name to single initial', () => {
      render(<Avatar name="John" />)
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('converts two names to two initials', () => {
      render(<Avatar name="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('converts three or more names to first two initials', () => {
      render(<Avatar name="John Q Public" />)
      expect(screen.getByText('JQ')).toBeInTheDocument()
    })

    it('uppercases initials', () => {
      render(<Avatar name="john doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('shows default icon when no name is provided', () => {
      const { container } = render(<Avatar />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })

    it('uses name as alt when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" name="John Doe" />)
      const img = screen.getByRole('img', { name: 'John Doe' })
      expect(img).toBeInTheDocument()
    })

    it('uses explicit alt text over name', () => {
      render(<Avatar src="https://example.com/avatar.jpg" alt="Custom alt" name="John Doe" />)
      const img = screen.getByRole('img', { name: 'Custom alt' })
      expect(img).toBeInTheDocument()
    })

    it('defaults to "Avatar" alt text when no alt or name', () => {
      render(<Avatar src="https://example.com/avatar.jpg" />)
      const img = screen.getByRole('img', { name: 'Avatar' })
      expect(img).toBeInTheDocument()
    })
  })

  describe('Size variants', () => {
    it('applies size xs classes', () => {
      const { container } = render(<Avatar size="xs" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles.xs)
    })

    it('applies size sm classes (default)', () => {
      const { container } = render(<Avatar name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles.sm)
    })

    it('applies size md classes', () => {
      const { container } = render(<Avatar size="md" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles.md)
    })

    it('applies size lg classes', () => {
      const { container } = render(<Avatar size="lg" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles.lg)
    })

    it('applies size xl classes', () => {
      const { container } = render(<Avatar size="xl" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles.xl)
    })

    it('applies size 2x classes', () => {
      const { container } = render(<Avatar size="2x" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles['2x'])
    })
  })

  describe('Hover cards', () => {
    it('renders identity details in a hover card when enabled', async () => {
      const user = userEvent.setup()

      render(<Avatar name="John Doe" description="john@example.com" hoverCard />)

      await user.hover(screen.getByText('JD'))

      expect(await screen.findByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('renders custom hover card content when renderHoverCard is provided', async () => {
      const user = userEvent.setup()

      render(
        <Avatar
          name="John Doe"
          description="Staff engineer"
          managerId="security"
          hoverCard
          renderHoverCard={({ title, email, description, avatar }) => (
            <div>
              <div>Custom hover</div>
              <div>{title}</div>
              <div>{email}</div>
              <div>{description}</div>
              <div>{avatar?.name}</div>
            </div>
          )}
        />,
      )

      await user.hover(screen.getByText('JD'))

      const dialog = await screen.findByRole('dialog')
      expect(dialog).toHaveTextContent('Custom hover')
      expect(dialog).toHaveTextContent('John Doe')
      expect(dialog).toHaveTextContent('Staff engineer')
      expect(dialog).not.toHaveTextContent('security')
      expect(dialog).not.toHaveTextContent('Manager:')
    })
  })

  describe('Presence indicators', () => {
    it('renders presence on the avatar when showPresence is enabled', () => {
      render(<Avatar name="John Doe" presence="online" showPresence />)

      expect(screen.getByRole('img', { name: 'Online' })).toBeInTheDocument()
    })

    it('renders presence in the hover card avatar when present', async () => {
      const user = userEvent.setup()

      render(<Avatar name="John Doe" description="john@example.com" presence="online" showPresence hoverCard />)

      await user.hover(screen.getByText('JD'))

      const dialog = await screen.findByRole('dialog')
      expect(within(dialog).getByRole('img', { name: 'Online' })).toBeInTheDocument()
    })
  })

  describe('Hash-based color', () => {
    it('applies soft hue and tone class based on name', () => {
      const { container } = render(<Avatar name="Alice" />)
      const avatar = container.firstChild as HTMLElement
      const hue = stringToHue('Alice')
      const tone = stringToAvatarSoftTone('Alice')
      expect(avatar).toHaveClass(avatarSoftFallbackByHueTone[`${hue}-${tone}`])
    })

    it('applies solid hue styles via provider', () => {
      const { container } = render(
        <AvatarProvider colorMode="solid">
          <Avatar name="Alice" />
        </AvatarProvider>,
      )
      const avatar = container.querySelector(`.${AVATAR_SIZE_CLASS}`) as HTMLElement
      const hue = stringToHue('Alice')
      const tone = stringToAvatarSolidTone('Alice')
      expect(avatar).toHaveClass(avatarSolidFallbackByHueTone[`${hue}-${tone}`])
    })

    it('falls back to muted when no name is given', () => {
      const { container } = render(<Avatar />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(avatarFallbackMuted)
    })

    it('uses id + name as hue seed when id is provided', () => {
      const { container } = render(<Avatar id="user-1" name="Alice" />)
      const avatar = container.firstChild as HTMLElement
      const hue = stringToHue('user-1:Alice')
      const tone = stringToAvatarSoftTone('user-1:Alice')
      expect(avatar).toHaveClass(avatarSoftFallbackByHueTone[`${hue}-${tone}`])
    })

    it('uses id as deterministic hue seed when name is missing', () => {
      const { container } = render(<Avatar id="user-1" />)
      const avatar = container.firstChild as HTMLElement
      const hue = stringToHue('user-1:')
      const tone = stringToAvatarSoftTone('user-1:')
      expect(avatar).toHaveClass(avatarSoftFallbackByHueTone[`${hue}-${tone}`])
    })

    it('shows image and hides fallback after image loads', async () => {
      render(<Avatar src="https://example.com/avatar.jpg" name="Alice" />)
      const img = screen.getByRole('img')
      img.dispatchEvent(new Event('load', { bubbles: true }))
      await waitFor(() => {
        expect(img).not.toHaveClass('opacity-0')
      })
    })
  })

  describe('stringToHue', () => {
    it('maps fixture seeds to stable hues', () => {
      const fixtures = [
        { seed: 'Alice', expected: 'cyan' },
        { seed: 'Bob', expected: 'pink' },
        { seed: 'Charlie', expected: 'sky' },
        { seed: 'Diana', expected: 'plum' },
        { seed: 'Edward', expected: 'yellow' },
        { seed: 'user-1:Alice', expected: 'cyan' },
        { seed: 'user-1:', expected: 'brown' },
        { seed: 'overflow:2:3', expected: 'mint' },
      ] as const

      for (const { seed, expected } of fixtures) {
        expect(stringToHue(seed)).toBe(expected)
      }
    })

    it('returns a valid hue name', () => {
      const hue = stringToHue('Alice')
      expect(HUE_NAMES).toContain(hue)
    })

    it('is deterministic', () => {
      expect(stringToHue('Bob')).toBe(stringToHue('Bob'))
    })

    it('returns the same hue for repeated identical names', () => {
      const names = [
        'Ava Chen',
        'Noah Diaz',
        'Mia Reed',
        'Evan Cole',
        'Liam Park',
        'José Álvarez',
        '李小龍',
        'Zoë Kravitz',
      ]

      for (const name of names) {
        const hues = Array.from({ length: 5 }, () => stringToHue(name))
        expect(new Set(hues)).toHaveLength(1)
      }
    })

    it('different names can produce different hues', () => {
      const hues = new Set(['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'].map(stringToHue))
      expect(hues.size).toBeGreaterThan(1)
    })

    it('avoids easy collisions for adjacent docs fixtures', () => {
      expect(stringToHue('Ava Chen')).not.toBe(stringToHue('Noah Diaz'))
    })
  })

  describe('stringToAvatarSoftTone', () => {
    it('maps fixture seeds to stable soft tones', () => {
      const fixtures = [
        { seed: 'Alice', expected: '5' },
        { seed: 'Bob', expected: '5' },
        { seed: 'Charlie', expected: '3' },
        { seed: 'Diana', expected: '7' },
        { seed: 'Edward', expected: '5' },
        { seed: 'user-1:Alice', expected: '3' },
        { seed: 'user-1:', expected: '5' },
        { seed: 'overflow:2:3', expected: '5' },
      ] as const

      for (const { seed, expected } of fixtures) {
        expect(stringToAvatarSoftTone(seed)).toBe(expected)
      }
    })
  })

  describe('stringToAvatarSolidTone', () => {
    it('maps fixture seeds to stable solid tones', () => {
      const fixtures = [
        { seed: 'Alice', expected: '9' },
        { seed: 'Bob', expected: '9' },
        { seed: 'Charlie', expected: '11' },
        { seed: 'Diana', expected: '9' },
        { seed: 'Edward', expected: '11' },
        { seed: 'user-1:Alice', expected: '11' },
        { seed: 'user-1:', expected: '11' },
        { seed: 'overflow:2:3', expected: '9' },
      ] as const

      for (const { seed, expected } of fixtures) {
        expect(stringToAvatarSolidTone(seed)).toBe(expected)
      }
    })
  })

  describe('AvatarProvider', () => {
    it('provides colorMode solid to children', () => {
      const { container } = render(
        <AvatarProvider colorMode="solid">
          <Avatar name="Alice" />
        </AvatarProvider>,
      )
      const avatar = container.querySelector(`.${AVATAR_SIZE_CLASS}`) as HTMLElement
      const hue = stringToHue('Alice')
      const tone = stringToAvatarSolidTone('Alice')
      expect(avatar).toHaveClass(avatarSolidFallbackByHueTone[`${hue}-${tone}`])
    })

    it('provides default radius to children', () => {
      const { container } = render(
        <AvatarProvider radius="md">
          <Avatar name="JD" />
        </AvatarProvider>,
      )
      const avatar = container.querySelector(`.${AVATAR_SIZE_CLASS}`) as HTMLElement
      expect(avatar).toHaveClass(avatarRadiusByRadius.md)
    })

    it('avatar radius prop overrides provider default', () => {
      const { container } = render(
        <AvatarProvider radius="md">
          <Avatar radius="lg" name="JD" />
        </AvatarProvider>,
      )
      const avatar = container.querySelector(`.${AVATAR_SIZE_CLASS}`) as HTMLElement
      expect(avatar).toHaveClass(avatarRadiusByRadius.lg)
    })

    it('defaults to soft when no provider', () => {
      const { container } = render(<Avatar name="Alice" />)
      const avatar = container.firstChild as HTMLElement
      const hue = stringToHue('Alice')
      const tone = stringToAvatarSoftTone('Alice')
      expect(avatar).toHaveClass(avatarSoftFallbackByHueTone[`${hue}-${tone}`])
    })
  })

  describe('Radius variants', () => {
    it('applies full radius (default)', () => {
      const { container } = render(<Avatar name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(avatarRadiusByRadius.full)
    })

    it('applies none radius', () => {
      const { container } = render(<Avatar radius="none" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(avatarRadiusByRadius.none)
    })

    it('applies sm radius', () => {
      const { container } = render(<Avatar radius="sm" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(avatarRadiusByRadius.sm)
    })

    it('applies md radius', () => {
      const { container } = render(<Avatar radius="md" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(avatarRadiusByRadius.md)
    })

    it('applies lg radius', () => {
      const { container } = render(<Avatar radius="lg" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass(avatarRadiusByRadius.lg)
    })
  })

  describe('Custom props', () => {
    it('applies custom className', () => {
      const { container } = render(<Avatar className="custom-class" name="JD" />)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toHaveClass('custom-class')
    })

    it('forwards ref', () => {
      const ref = React.createRef<HTMLSpanElement>()
      render(<Avatar ref={ref} name="JD" />)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('spreads additional props', () => {
      const { container } = render(<Avatar data-testid="avatar" name="JD" />)
      const avatar = container.querySelector('[data-testid="avatar"]')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles empty name string', () => {
      const { container } = render(<Avatar name="" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('handles single character name', () => {
      render(<Avatar name="J" />)
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('handles name with extra spaces', () => {
      render(<Avatar name="  John   Doe  " />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('handles name with special characters', () => {
      render(<Avatar name="@John #Doe" />)
      expect(screen.getByText('@#')).toBeInTheDocument()
    })
  })
})
