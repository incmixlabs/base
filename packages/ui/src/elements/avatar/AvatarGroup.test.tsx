import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Avatar } from './Avatar'
import { AvatarGroup } from './AvatarGroup'
import { AVATAR_SIZE_CLASS, avatarSizeStyles } from './avatar.context'
import { avatarRadiusByRadius } from './avatar.css'
import { avatarGroupSpreadBySize, avatarGroupStackBySize, avatarGroupStackItem } from './avatar-group.css'

afterEach(() => {
  cleanup()
})

const HOVER_CARD_INTERACTION_TEST_TIMEOUT_MS = 15_000

describe('AvatarGroup', () => {
  describe('Basic rendering', () => {
    it('renders all children when no max is set', () => {
      render(
        <AvatarGroup>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
        </AvatarGroup>,
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
      expect(screen.getByText('JS')).toBeInTheDocument()
      expect(screen.getByText('BJ')).toBeInTheDocument()
    })

    it('renders with single child', () => {
      render(
        <AvatarGroup>
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('forwards ref to container div', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <AvatarGroup ref={ref}>
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('propagates presence indicators to child avatars when showPresence is enabled', () => {
      render(
        <AvatarGroup showPresence>
          <Avatar name="John Doe" presence="online" />
          <Avatar name="Jane Smith" presence="busy" />
        </AvatarGroup>,
      )

      expect(screen.getByRole('img', { name: 'Online' })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Busy' })).toBeInTheDocument()
    })
  })

  describe('Max prop and overflow', () => {
    it('limits visible avatars to max value', () => {
      render(
        <AvatarGroup max={4}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Brown" />
          <Avatar name="Evan Cole" />
          <Avatar name="Liam Park" />
        </AvatarGroup>,
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
      expect(screen.getByText('JS')).toBeInTheDocument()
      expect(screen.getByText('BJ')).toBeInTheDocument()
      expect(screen.queryByText('AB')).not.toBeInTheDocument()
      expect(screen.getByText('+3')).toBeInTheDocument()
    })

    it('shows overflow indicator with correct count', () => {
      render(
        <AvatarGroup max={4}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Brown" />
          <Avatar name="Evan Cole" />
        </AvatarGroup>,
      )

      expect(screen.getByText('+2')).toBeInTheDocument()
    })

    it('does not show overflow indicator when count equals max', () => {
      render(
        <AvatarGroup max={3}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
        </AvatarGroup>,
      )

      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
    })

    it('does not show overflow indicator when count is less than max', () => {
      render(
        <AvatarGroup max={5}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
        </AvatarGroup>,
      )

      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
    })

    it('shows overflow indicator with aria-label', () => {
      render(
        <AvatarGroup max={4}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Brown" />
          <Avatar name="Evan Cole" />
          <Avatar name="Liam Park" />
        </AvatarGroup>,
      )

      const button = screen.getByLabelText('3 more')
      expect(button).toBeInTheDocument()
    })

    it('shows all avatars when count equals max', () => {
      render(
        <AvatarGroup max={4}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Brown" />
        </AvatarGroup>,
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
      expect(screen.getByText('JS')).toBeInTheDocument()
      expect(screen.getByText('BJ')).toBeInTheDocument()
      expect(screen.getByText('AB')).toBeInTheDocument()
      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
    })
  })

  describe('Overflow click handling', () => {
    it('calls onOverflowClick with count and remaining children when clicked', async () => {
      const user = userEvent.setup()
      const handleOverflowClick = vi.fn()

      render(
        <AvatarGroup max={4} onOverflowClick={handleOverflowClick}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Brown" />
          <Avatar name="Evan Cole" />
          <Avatar name="Liam Park" />
        </AvatarGroup>,
      )

      const overflowButton = screen.getByText('+3')
      await user.click(overflowButton)

      expect(handleOverflowClick).toHaveBeenCalledTimes(1)
      expect(handleOverflowClick).toHaveBeenCalledWith(3, expect.any(Array))

      const [count, remainingChildren] = handleOverflowClick.mock.calls[0] as [number, React.ReactNode[]]
      expect(count).toBe(3)
      expect(remainingChildren).toHaveLength(3)
    })

    it('does not call onOverflowClick when no overflow exists', () => {
      const handleOverflowClick = vi.fn()

      render(
        <AvatarGroup max={5} onOverflowClick={handleOverflowClick}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
        </AvatarGroup>,
      )

      expect(handleOverflowClick).not.toHaveBeenCalled()
    })

    it('renders a non-clickable overflow indicator when no click or hover behavior is enabled', () => {
      render(
        <AvatarGroup max={1}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
        </AvatarGroup>,
      )

      const indicator = screen.getByLabelText('3 more')
      expect(indicator).toHaveAttribute('role', 'img')
    })

    it('enables overflow button when onOverflowClick is provided', () => {
      const handleOverflowClick = vi.fn()

      render(
        <AvatarGroup max={1} onOverflowClick={handleOverflowClick}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
        </AvatarGroup>,
      )

      const button = screen.getByText('+3')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Overflow hover cards', () => {
    it(
      'preserves explicit child hover cards when group hover cards are enabled',
      async () => {
        const user = userEvent.setup()

        render(
          <AvatarGroup hoverCard={{ title: 'All reviewers' }}>
            <Avatar
              id="john"
              name="John Doe"
              description="john@example.com"
              hoverCard={{ title: 'Lead reviewer', email: 'platform@company.com' }}
            />
            <Avatar id="jane" name="Jane Smith" description="jane@example.com" />
          </AvatarGroup>,
        )

        await user.hover(screen.getByText('JD'))

        const dialog = await screen.findByRole('dialog')
        expect(within(dialog).getByText('Lead reviewer')).toBeInTheDocument()
        expect(within(dialog).getByText('platform@company.com')).toBeInTheDocument()
      },
      HOVER_CARD_INTERACTION_TEST_TIMEOUT_MS,
    )

    it(
      'shows overflow identities in a hover card when enabled',
      async () => {
        const user = userEvent.setup()

        render(
          <AvatarGroup max={2} overflowHoverCard={{ title: 'Reviewers' }}>
            <Avatar id="john" name="John Doe" description="john@example.com" />
            <Avatar id="jane" name="Jane Smith" description="jane@example.com" />
            <Avatar id="bob" name="Bob Johnson" description="bob@example.com" />
            <Avatar id="alice" name="Alice Brown" description="alice@example.com" />
          </AvatarGroup>,
        )

        const overflowTrigger = screen.getByRole('button', { name: '3 more' })
        await user.hover(overflowTrigger)

        const overflowDialog = await screen.findByRole('dialog')
        expect(within(overflowDialog).getByText('Reviewers')).toBeInTheDocument()
        expect(within(overflowDialog).getByText('Jane Smith')).toBeInTheDocument()
        expect(within(overflowDialog).getByText('Bob Johnson')).toBeInTheDocument()
        expect(within(overflowDialog).getByText('Alice Brown')).toBeInTheDocument()
      },
      HOVER_CARD_INTERACTION_TEST_TIMEOUT_MS,
    )

    it(
      'preserves child hover-card payloads in group and overflow identity rows',
      async () => {
        const user = userEvent.setup()

        render(
          <div className="space-y-6">
            <AvatarGroup hoverCard={{ title: 'All reviewers' }} max={2}>
              <Avatar
                id="john"
                name="John Doe"
                description="john@example.com"
                hoverCard={{ title: 'Lead reviewer', email: 'platform@company.com', presence: 'online' }}
              />
              <Avatar id="jane" name="Jane Smith" description="jane@example.com" />
              <Avatar
                id="bob"
                name="Bob Johnson"
                description="bob@example.com"
                hoverCard={{ title: 'Security reviewer', managerId: 'security' }}
              />
              <Avatar id="alice" name="Alice Brown" description="alice@example.com" />
            </AvatarGroup>
            <AvatarGroup max={2} overflowHoverCard={{ title: 'Overflow reviewers' }}>
              <Avatar id="john-2" name="John Doe" description="john@example.com" />
              <Avatar id="jane-2" name="Jane Smith" description="jane@example.com" />
              <Avatar
                id="bob-2"
                name="Bob Johnson"
                description="bob@example.com"
                hoverCard={{
                  title: 'Security reviewer',
                  email: 'security@example.com',
                  presence: 'busy',
                }}
              />
              <Avatar id="alice-2" name="Alice Brown" description="alice@example.com" />
            </AvatarGroup>
          </div>,
        )

        const [groupTrigger] = screen.getAllByRole('button')
        await user.hover(groupTrigger)

        const groupDialog = await screen.findByRole('dialog')
        expect(within(groupDialog).getByText('Lead reviewer')).toBeInTheDocument()
        expect(within(groupDialog).getByText('platform@company.com')).toBeInTheDocument()
        expect(within(groupDialog).getByRole('img', { name: 'Online' })).toBeInTheDocument()

        await user.unhover(groupTrigger)
        await waitFor(() => {
          expect(screen.queryByText('Lead reviewer')).not.toBeInTheDocument()
        })

        const [, overflowTrigger] = screen.getAllByLabelText('3 more')
        await user.hover(overflowTrigger)

        const overflowDialog = await screen.findByRole('dialog')
        expect(within(overflowDialog).getByText('Overflow reviewers')).toBeInTheDocument()
        expect(within(overflowDialog).getByText('Security reviewer')).toBeInTheDocument()
        expect(within(overflowDialog).getByText('security@example.com')).toBeInTheDocument()
        expect(within(overflowDialog).getByRole('img', { name: 'Busy' })).toBeInTheDocument()
      },
      HOVER_CARD_INTERACTION_TEST_TIMEOUT_MS,
    )

    it(
      'does not open the group hover card when hovering the overflow trigger',
      async () => {
        const user = userEvent.setup()

        render(
          <AvatarGroup
            hoverCard={{ title: 'All reviewers' }}
            max={2}
            overflowHoverCard={{ title: 'Overflow reviewers' }}
          >
            <Avatar id="john" name="John Doe" description="john@example.com" />
            <Avatar id="jane" name="Jane Smith" description="jane@example.com" />
            <Avatar id="bob" name="Bob Johnson" description="bob@example.com" />
            <Avatar id="alice" name="Alice Brown" description="alice@example.com" />
          </AvatarGroup>,
        )

        await user.hover(screen.getByLabelText('3 more'))

        const overflowDialog = await screen.findByRole('dialog')
        expect(within(overflowDialog).getByText('Overflow reviewers')).toBeInTheDocument()
        expect(within(overflowDialog).queryByText('All reviewers')).not.toBeInTheDocument()
        expect(screen.queryByText('All reviewers')).not.toBeInTheDocument()
        expect(screen.getAllByRole('dialog')).toHaveLength(1)
      },
      HOVER_CARD_INTERACTION_TEST_TIMEOUT_MS,
    )
  })

  describe('Custom hover card rendering', () => {
    it(
      'renders custom group hover card content when renderHoverCard is provided',
      async () => {
        const user = userEvent.setup()

        render(
          <AvatarGroup
            hoverCard={{ title: 'Reviewers' }}
            renderHoverCard={({ entries, title }) => (
              <div>
                <div>Custom list</div>
                <div>{title}</div>
                <div>{entries.map(entry => entry.title ?? entry.avatar?.name).join(', ')}</div>
              </div>
            )}
          >
            <Avatar id="john" name="John Doe" description="john@example.com" />
            <Avatar id="jane" name="Jane Smith" description="jane@example.com" />
          </AvatarGroup>,
        )

        const [trigger] = screen.getAllByRole('button')
        await user.hover(trigger)

        const dialog = await screen.findByRole('dialog')
        expect(dialog).toHaveTextContent('Custom list')
        expect(dialog).toHaveTextContent('Reviewers')
        expect(dialog).toHaveTextContent('John Doe, Jane Smith')
        expect(dialog).not.toHaveTextContent('john@example.com')
      },
      HOVER_CARD_INTERACTION_TEST_TIMEOUT_MS,
    )
  })

  describe('Custom renderOverflow', () => {
    it('uses custom renderOverflow when provided', () => {
      const customRender = (count: number) => <div data-testid="custom-overflow">Custom +{count}</div>

      render(
        <AvatarGroup max={2} renderOverflow={customRender}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
          <Avatar name="Alice Brown" />
        </AvatarGroup>,
      )

      expect(screen.getByTestId('custom-overflow')).toHaveTextContent('Custom +3')
    })

    it('does not render default overflow when custom renderOverflow is provided', () => {
      const customRender = (count: number) => <div>Custom +{count}</div>

      render(
        <AvatarGroup max={1} overflowHoverCard={false} renderOverflow={customRender}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
          <Avatar name="Bob Johnson" />
        </AvatarGroup>,
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it(
      'still shows an overflow hover card when renderOverflow is customized',
      async () => {
        const user = userEvent.setup()

        render(
          <AvatarGroup
            max={2}
            overflowHoverCard={{ title: 'Reviewers' }}
            renderOverflow={count => <div data-testid="custom-overflow">More {count}</div>}
          >
            <Avatar name="John Doe" description="john@example.com" />
            <Avatar name="Jane Smith" description="jane@example.com" />
            <Avatar name="Bob Johnson" description="bob@example.com" />
            <Avatar name="Alice Brown" description="alice@example.com" />
          </AvatarGroup>,
        )

        await user.hover(screen.getByTestId('custom-overflow'))

        expect(await screen.findByText('Reviewers')).toBeInTheDocument()
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
        expect(screen.getByText('Alice Brown')).toBeInTheDocument()
      },
      HOVER_CARD_INTERACTION_TEST_TIMEOUT_MS,
    )

    it(
      'accepts nested hover-card config for group and overflow styling',
      async () => {
        const user = userEvent.setup()

        render(
          <AvatarGroup
            max={2}
            hoverCard={{ title: 'Reviewers', color: 'light', variant: 'surface' }}
            overflowHoverCard={{ title: 'Overflow reviewers', color: 'light', variant: 'surface' }}
          >
            <Avatar id="john-nested" name="John Doe" description="john@example.com" />
            <Avatar id="jane-nested" name="Jane Smith" description="jane@example.com" />
            <Avatar id="bob-nested" name="Bob Johnson" description="bob@example.com" />
            <Avatar id="alice-nested" name="Alice Brown" description="alice@example.com" />
          </AvatarGroup>,
        )

        const [groupTrigger] = screen.getAllByRole('button')
        await user.hover(groupTrigger)
        expect(await screen.findByText('Reviewers')).toBeInTheDocument()

        await user.unhover(groupTrigger)
        await waitFor(() => {
          expect(screen.queryByText('Reviewers')).not.toBeInTheDocument()
        })

        await user.hover(screen.getByLabelText('3 more'))
        expect(await screen.findByText('Overflow reviewers')).toBeInTheDocument()
      },
      HOVER_CARD_INTERACTION_TEST_TIMEOUT_MS,
    )
  })

  describe('Layout variants', () => {
    it('applies stack layout classes by default', () => {
      const { container } = render(
        <AvatarGroup>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
        </AvatarGroup>,
      )

      const visibleList = container.querySelector('[data-slot="avatar-group-list"]')
      expect(visibleList).toHaveClass(avatarGroupStackBySize.sm)
    })

    it('applies spread layout classes when layout is spread', () => {
      const { container } = render(
        <AvatarGroup layout="spread">
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
        </AvatarGroup>,
      )

      const group = container.firstChild as HTMLElement
      expect(group).toHaveClass(avatarGroupSpreadBySize.sm)
    })

    it('applies ring styles in stack layout', () => {
      const { container } = render(
        <AvatarGroup layout="stack">
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      const wrapper = container.querySelector('span')
      expect(wrapper).toHaveClass(avatarGroupStackItem, avatarRadiusByRadius.full)
    })

    it('does not apply ring styles in spread layout', () => {
      const { container } = render(
        <AvatarGroup layout="spread">
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      const wrapper = container.querySelector('span')
      expect(wrapper).not.toHaveClass(avatarGroupStackItem)
    })
  })

  describe('Size propagation', () => {
    it('propagates size to avatar children', () => {
      const { container } = render(
        <AvatarGroup size="lg">
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      const avatar = container.querySelector('span > span')
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles.lg)
    })

    it('uses default size sm when not specified', () => {
      const { container } = render(
        <AvatarGroup>
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      const avatar = container.querySelector('span > span')
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles.sm)
    })

    it('applies correct spacing for size xs', () => {
      const { container } = render(
        <AvatarGroup size="xs" layout="stack">
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      const visibleList = container.querySelector('[data-slot="avatar-group-list"]')
      expect(visibleList).toHaveClass(avatarGroupStackBySize.xs)
    })

    it('applies correct spacing for size md spread layout', () => {
      const { container } = render(
        <AvatarGroup size="md" layout="spread">
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      expect(container.firstChild).toHaveClass(avatarGroupSpreadBySize.md)
    })

    it('applies correct spacing for size 2x stack layout', () => {
      const { container } = render(
        <AvatarGroup size="2x" layout="stack">
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      const visibleList = container.querySelector('[data-slot="avatar-group-list"]')
      expect(visibleList).toHaveClass(avatarGroupStackBySize['2x'])
    })
  })

  describe('Z-index stacking', () => {
    it('applies z-index to stack layout children in forward order', () => {
      const { container } = render(
        <AvatarGroup layout="stack">
          <Avatar name="First" />
          <Avatar name="Second" />
          <Avatar name="Third" />
        </AvatarGroup>,
      )

      const wrappers = container.querySelectorAll('div > span')
      expect(wrappers[0]).toHaveStyle({ zIndex: 1 })
      expect(wrappers[1]).toHaveStyle({ zIndex: 2 })
      expect(wrappers[2]).toHaveStyle({ zIndex: 3 })
    })

    it('does not apply z-index to spread layout', () => {
      const { container } = render(
        <AvatarGroup layout="spread">
          <Avatar name="First" />
          <Avatar name="Second" />
        </AvatarGroup>,
      )

      const wrappers = container.querySelectorAll<HTMLElement>('[data-slot="avatar-group-list"] > span')
      expect(wrappers[0]?.style.zIndex).toBe('')
    })
  })

  describe('Child key handling', () => {
    it('preserves React keys from children', () => {
      render(
        <AvatarGroup>
          <Avatar key="user-1" name="John Doe" />
          <Avatar key="user-2" name="Jane Smith" />
        </AvatarGroup>,
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
      expect(screen.getByText('JS')).toBeInTheDocument()
    })

    it('uses index as fallback key when child has no key', () => {
      render(
        <AvatarGroup>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
        </AvatarGroup>,
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
      expect(screen.getByText('JS')).toBeInTheDocument()
    })
  })

  describe('Custom props', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <AvatarGroup className="custom-group">
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      expect(container.firstChild).toHaveClass('custom-group')
    })

    it('spreads additional props to container', () => {
      const { container } = render(
        <AvatarGroup data-testid="avatar-group">
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      const group = container.querySelector('[data-testid="avatar-group"]')
      expect(group).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles max of 0', () => {
      render(
        <AvatarGroup max={0}>
          <Avatar name="John Doe" />
          <Avatar name="Jane Smith" />
        </AvatarGroup>,
      )

      expect(screen.queryByText('JD')).not.toBeInTheDocument()
      expect(screen.getByText('+2')).toBeInTheDocument()
    })

    it('handles negative overflow count gracefully', () => {
      render(
        <AvatarGroup max={10}>
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
    })

    it('handles non-Avatar children', () => {
      render(
        <AvatarGroup>
          <div>Custom child</div>
          <Avatar name="John Doe" />
        </AvatarGroup>,
      )

      expect(screen.getByText('Custom child')).toBeInTheDocument()
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('clones children correctly with size override', () => {
      const { container } = render(
        <AvatarGroup size="xl">
          <Avatar size="xs" name="John Doe" />
        </AvatarGroup>,
      )

      const avatar = container.querySelector('span > span')
      // Size from AvatarGroup should override
      expect(avatar).toHaveClass(AVATAR_SIZE_CLASS)
      expect(avatar).toHaveClass(avatarSizeStyles.xl)
    })
  })
})
