import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QRCode } from './QRCode'

const toCanvas = vi.fn()
const toDataURL = vi.fn()
const toString = vi.fn()

vi.mock('qrcode', () => ({
  toCanvas,
  toDataURL,
  toString,
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('QRCode', () => {
  it('generates canvas, SVG, and image output from one root value', async () => {
    toCanvas.mockResolvedValue(undefined)
    toDataURL.mockResolvedValue('data:image/png;base64,qr')
    toString.mockResolvedValue('<svg viewBox="0 0 1 1" />')

    render(
      <QRCode value="https://incmix.com" width={128} height={128} level="H" color="primary">
        <QRCode.Skeleton data-testid="skeleton" />
        <QRCode.Canvas data-testid="canvas" />
        <QRCode.Svg data-testid="svg" />
        <QRCode.Image data-testid="image" alt="Verification code" />
      </QRCode>,
    )

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()

    await waitFor(() => {
      expect(toCanvas).toHaveBeenCalled()
    })

    expect(toDataURL).toHaveBeenCalledWith(
      'https://incmix.com',
      expect.objectContaining({
        errorCorrectionLevel: 'H',
        width: 128,
      }),
    )
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
    expect(screen.getByTestId('canvas')).toHaveAttribute('width', '128')
    expect(screen.getByTestId('svg').innerHTML).toContain('<svg')
    expect(screen.getByTestId('image')).toHaveAttribute('src', 'data:image/png;base64,qr')
    expect(screen.getByTestId('image')).toHaveAttribute('alt', 'Verification code')
  })

  it('disables download until the requested output exists', async () => {
    toCanvas.mockResolvedValue(undefined)
    toDataURL.mockResolvedValue('data:image/png;base64,qr')
    toString.mockResolvedValue('<svg viewBox="0 0 1 1" />')

    render(
      <QRCode value="INV-123">
        <QRCode.Download data-testid="download" format="png" />
      </QRCode>,
    )

    expect(screen.getByTestId('download')).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByTestId('download')).not.toBeDisabled()
    })
  })

  it('starts a new generation when the value changes while a previous generation is pending', async () => {
    const canvasResolves: Array<() => void> = []

    toCanvas.mockImplementation(
      () =>
        new Promise<void>(resolve => {
          canvasResolves.push(resolve)
        }),
    )
    toDataURL.mockImplementation(async value => `data:image/png;base64,${value}`)
    toString.mockImplementation(async value => `<svg>${value}</svg>`)

    const { rerender } = render(
      <QRCode value="INV-1">
        <QRCode.Canvas />
        <QRCode.Svg data-testid="svg" />
      </QRCode>,
    )

    await waitFor(() => {
      expect(toCanvas).toHaveBeenCalledTimes(1)
    })

    rerender(
      <QRCode value="INV-2">
        <QRCode.Canvas />
        <QRCode.Svg data-testid="svg" />
      </QRCode>,
    )

    await waitFor(() => {
      expect(toCanvas).toHaveBeenCalledTimes(2)
    })

    for (const resolve of canvasResolves) {
      resolve()
    }

    await waitFor(() => {
      expect(screen.getByTestId('svg').innerHTML).toContain('INV-2')
    })
    expect(toCanvas).toHaveBeenNthCalledWith(2, expect.any(HTMLCanvasElement), 'INV-2', expect.anything())
  })
})
