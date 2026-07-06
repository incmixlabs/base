import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Theme } from '@/theme'
import { designTokens } from '@/theme/tokens'
import { Image } from './Image'

describe('Image', () => {
  it('passes responsive image attributes through to the img element', () => {
    render(
      <Image
        src="https://example.com/photo-960.jpg"
        alt="Responsive sample"
        srcSet="https://example.com/photo-640.jpg 640w, https://example.com/photo-960.jpg 960w"
        sizes="(min-width: 768px) 50vw, 100vw"
      />,
    )

    const image = screen.getByAltText('Responsive sample')
    expect(image).toHaveAttribute(
      'srcset',
      'https://example.com/photo-640.jpg 640w, https://example.com/photo-960.jpg 960w',
    )
    expect(image).toHaveAttribute('sizes', '(min-width: 768px) 50vw, 100vw')
  })

  it('applies object-fit classes', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Contained sample" objectFit="contain" />)

    expect(screen.getByAltText('Contained sample')).toHaveClass('object-contain')
  })

  it('applies an explicit radius token', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Rounded sample" radius="lg" />)

    const image = screen.getByAltText('Rounded sample')
    expect(image).toHaveClass('rounded-[var(--element-border-radius)]')
    expect(image.style.getPropertyValue('--element-border-radius')).toBe(designTokens.radius.lg)
  })

  it('defaults radius to the Theme radius', () => {
    render(
      <Theme radius="sm">
        <Image src="https://example.com/photo.jpg" alt="Theme rounded sample" />
      </Theme>,
    )

    expect(screen.getByAltText('Theme rounded sample').style.getPropertyValue('--element-border-radius')).toBe(
      designTokens.radius.sm,
    )
  })

  it('applies objectPosition directly', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Positioned sample" objectPosition="center 20%" />)

    expect(screen.getByAltText('Positioned sample')).toHaveStyle({ objectPosition: 'center 20%' })
  })

  it('maps focalPoint to object-position percentages', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Focal sample" focalPoint={{ x: 50, y: 15 }} />)

    expect(screen.getByAltText('Focal sample')).toHaveStyle({ objectPosition: '50% 15%' })
  })

  it('lets objectPosition override focalPoint', () => {
    render(
      <Image
        src="https://example.com/photo.jpg"
        alt="Override sample"
        focalPoint={{ x: 50, y: 15 }}
        objectPosition="center bottom"
      />,
    )

    expect(screen.getByAltText('Override sample')).toHaveStyle({
      objectPosition: 'center bottom',
    })
  })

  it('switches to fallbackSrc on error and clears responsive source attributes', () => {
    const onError = vi.fn()

    render(
      <Image
        src="https://example.com/photo-960.jpg"
        fallbackSrc="https://example.com/photo-fallback.jpg"
        alt="Fallback sample"
        srcSet="https://example.com/photo-640.jpg 640w, https://example.com/photo-960.jpg 960w"
        sizes="100vw"
        onError={onError}
      />,
    )

    const image = screen.getByAltText('Fallback sample')
    fireEvent.error(image)

    expect(image).toHaveAttribute('src', 'https://example.com/photo-fallback.jpg')
    expect(image).not.toHaveAttribute('srcset')
    expect(image).not.toHaveAttribute('sizes')
    expect(onError).toHaveBeenCalledTimes(1)
  })
})
