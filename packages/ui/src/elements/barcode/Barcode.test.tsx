import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import JsBarcode from 'jsbarcode'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Barcode } from './Barcode'

vi.mock('jsbarcode', () => ({
  default: vi.fn((svg: SVGSVGElement) => {
    svg.setAttribute('data-generated', 'true')
  }),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('Barcode', () => {
  it('renders an SVG barcode with format and color options', async () => {
    const onGenerated = vi.fn()

    render(
      <Barcode
        data-testid="barcode"
        value="SKU-123"
        format="CODE128"
        foregroundColor="#111111"
        backgroundColor="#ffffff"
        width={2}
        height={80}
        displayValue={false}
        onGenerated={onGenerated}
      />,
    )

    await waitFor(() => {
      expect(JsBarcode).toHaveBeenCalled()
    })

    expect(JsBarcode).toHaveBeenCalledWith(
      expect.any(SVGSVGElement),
      'SKU-123',
      expect.objectContaining({
        format: 'CODE128',
        height: 80,
        width: 2,
        lineColor: '#111111',
        background: '#ffffff',
        displayValue: false,
        fontOptions: '',
      }),
    )
    expect(screen.getByTestId('barcode')).toHaveAttribute('data-format', 'CODE128')
    expect(screen.getByTestId('barcode')).toHaveAttribute('data-generated', 'true')
    expect(onGenerated).toHaveBeenCalled()
  })

  it('clears the SVG and reports generation errors', async () => {
    const error = new Error('Invalid barcode')
    vi.mocked(JsBarcode).mockImplementationOnce(() => {
      throw error
    })
    const onError = vi.fn()

    render(<Barcode data-testid="barcode" value="bad" format="EAN13" onError={onError} />)

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error)
    })

    expect(screen.getByTestId('barcode')).toHaveAttribute('aria-invalid', 'true')
  })
})
