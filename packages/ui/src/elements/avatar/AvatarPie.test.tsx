import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'
import { AvatarPie } from './AvatarPie'
import {
  avatarPieOverflowLabel,
  avatarPieRoot,
  avatarPieSizeBySize,
  avatarPieSliceThreeFirst,
  avatarPieSliceThreeSecond,
  avatarPieSliceThreeThird,
  avatarPieSliceTwoFirst,
  avatarPieSliceTwoSecond,
} from './avatar-pie.css'

afterEach(() => {
  cleanup()
})

describe('AvatarPie', () => {
  it('renders a circular pie root with the requested size', () => {
    const { container } = render(
      <AvatarPie size="lg">
        <Avatar name="Maya" />
        <Avatar name="Nora" />
      </AvatarPie>,
    )

    expect(container.firstChild).toHaveClass(avatarPieRoot, avatarPieSizeBySize.lg)
  })

  it('renders two avatars as half-circle slices', () => {
    const { container } = render(
      <AvatarPie>
        <Avatar name="Maya" />
        <Avatar name="Nora" />
      </AvatarPie>,
    )

    const slices = Array.from(container.querySelectorAll('[data-slot="avatar-pie-slice"]')) as HTMLElement[]
    expect(slices).toHaveLength(2)
    expect(slices[0]).toHaveClass(avatarPieSliceTwoFirst)
    expect(slices[1]).toHaveClass(avatarPieSliceTwoSecond)
  })

  it('renders three avatars as pie slices', () => {
    const { container } = render(
      <AvatarPie>
        <Avatar name="Maya" />
        <Avatar name="Nora" />
        <Avatar name="Omar" />
      </AvatarPie>,
    )

    const slices = Array.from(container.querySelectorAll('[data-slot="avatar-pie-slice"]')) as HTMLElement[]
    expect(slices).toHaveLength(3)
    expect(slices[0]).toHaveClass(avatarPieSliceThreeFirst)
    expect(slices[1]).toHaveClass(avatarPieSliceThreeSecond)
    expect(slices[2]).toHaveClass(avatarPieSliceThreeThird)
  })

  it('shows overflow as the third slice when more than three avatars are provided', () => {
    const { container } = render(
      <AvatarPie>
        <Avatar name="Maya" />
        <Avatar name="Nora" />
        <Avatar name="Omar" />
        <Avatar name="Zoe" />
      </AvatarPie>,
    )

    expect(container.querySelectorAll('[data-slot="avatar-pie-slice"]')).toHaveLength(3)
    expect(screen.getByText('2+')).toBeInTheDocument()
  })

  it('shows 3+ for five avatars', () => {
    render(
      <AvatarPie>
        <Avatar name="Maya" />
        <Avatar name="Nora" />
        <Avatar name="Omar" />
        <Avatar name="Zoe" />
        <Avatar name="Liam" />
      </AvatarPie>,
    )

    expect(screen.getByText('3+')).toBeInTheDocument()
  })

  it('shows 9+ for eleven avatars', () => {
    render(
      <AvatarPie>
        {Array.from({ length: 11 }, (_, index) => (
          <Avatar key={index} name={`Person ${index + 1}`} />
        ))}
      </AvatarPie>,
    )

    expect(screen.getByText('9+')).toBeInTheDocument()
  })

  it('caps overflow labels above nine hidden avatars as a plus sign', () => {
    render(
      <AvatarPie>
        {Array.from({ length: 12 }, (_, index) => (
          <Avatar key={index} name={`Person ${index + 1}`} />
        ))}
      </AvatarPie>,
    )

    expect(screen.getByText('+')).toHaveClass(avatarPieOverflowLabel)
  })

  it('uses a contextual aria-label for the overflow slice', () => {
    render(
      <AvatarPie>
        <Avatar name="Maya" />
        <Avatar name="Nora" />
        <Avatar name="Omar" />
        <Avatar name="Zoe" />
      </AvatarPie>,
    )

    expect(screen.getByLabelText('2 more people')).toBeInTheDocument()
  })

  it('forces avatar children to fill the pie slices and use full radius', () => {
    const { container } = render(
      <AvatarPie size="sm">
        <Avatar size="xl" radius="none" name="Maya" />
        <Avatar name="Nora" />
      </AvatarPie>,
    )

    const avatars = container.querySelectorAll('[data-slot="avatar-pie-slice-avatar"]')
    expect(avatars).toHaveLength(2)
  })

  it('shows all identities in a shared hover card when enabled', async () => {
    const user = userEvent.setup()

    render(
      <AvatarPie hoverCard={{ title: 'Selected people' }}>
        <Avatar id="maya" name="Maya Lane" description="maya@example.com" />
        <Avatar id="nora" name="Nora Bell" description="nora@example.com" />
        <Avatar
          id="omar"
          name="Omar Diaz"
          description="omar@example.com"
          hoverCard={{ title: 'Approver', presence: 'busy', managerId: 'security' }}
        />
        <Avatar id="zoe" name="Zoe Park" description="zoe@example.com" />
      </AvatarPie>,
    )

    await user.hover(screen.getByLabelText('2 more people'))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Selected people')
    expect(dialog).toHaveTextContent('Maya Lane')
    expect(dialog).toHaveTextContent('Nora Bell')
    expect(dialog).toHaveTextContent('Approver')
    expect(within(dialog).getByRole('img', { name: 'Busy' })).toBeInTheDocument()
    expect(dialog).toHaveTextContent('Manager: security')
    expect(dialog).toHaveTextContent('Zoe Park')
  })
})
