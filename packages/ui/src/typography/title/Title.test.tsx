import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { designTokens } from '@/theme/tokens'
import { SubTitle } from './SubTitle'
import { Title } from './Title'

describe('Title', () => {
  it('renders a semantic heading by default', () => {
    render(<Title>Profile</Title>)

    expect(screen.getByRole('heading', { name: 'Profile', level: 3 })).toBeInTheDocument()
  })
})

describe('SubTitle', () => {
  it('uses readable text color with muted opacity by default', () => {
    render(<SubTitle>regina_cooper@mail.com</SubTitle>)

    const subtitle = screen.getByText('regina_cooper@mail.com')
    expect(subtitle).toHaveClass('opacity-70')
    expect(subtitle).toHaveStyle({ color: designTokens.color.neutral.text })
  })
})
