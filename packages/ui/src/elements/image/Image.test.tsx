import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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
