import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { iconSizeVariants } from '@/elements/button/IconButton.css'
import { FileManager } from './FileManager'

const emptyFileManagerProps = {
  folders: [],
  files: [],
}

afterEach(() => {
  cleanup()
})

describe('FileManager', () => {
  it('renders single inherited-size icons for the grid and list view toggles', () => {
    render(<FileManager {...emptyFileManagerProps} />)

    const gridToggle = screen.getByRole('button', { name: 'Grid view' })
    const listToggle = screen.getByRole('button', { name: 'List view' })

    expect(gridToggle.querySelectorAll('svg')).toHaveLength(1)
    expect(listToggle.querySelectorAll('svg')).toHaveLength(1)

    const gridIconWrapper = gridToggle.querySelector('span')
    const listIconWrapper = listToggle.querySelector('span')
    const gridIcon = gridToggle.querySelector('svg')
    const listIcon = listToggle.querySelector('svg')

    expect(gridIconWrapper).not.toBeNull()
    expect(listIconWrapper).not.toBeNull()
    expect(gridIcon).toHaveAttribute('stroke', 'currentColor')
    expect(listIcon).toHaveAttribute('stroke', 'currentColor')
    expect(gridIconWrapper?.className).toContain(iconSizeVariants.sm)
    expect(listIconWrapper?.className).toContain(iconSizeVariants.sm)
  })

  it('switches to the list placeholder when the list toggle is pressed', () => {
    render(<FileManager {...emptyFileManagerProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'List view' }))

    expect(screen.getByText('List view coming soon.')).toBeInTheDocument()
  })
})
