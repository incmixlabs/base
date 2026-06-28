import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'
import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { EmbeddedResponsiveShell } from './embedded-responsive-preview'
import { embeddedResponsiveShell, embeddedResponsiveState } from './embedded-responsive-preview.class'

describe('EmbeddedResponsiveShell', () => {
  it('forwards its ref to the measured state wrapper only', () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <EmbeddedResponsiveShell ref={ref} width={360}>
        Preview
      </EmbeddedResponsiveShell>,
    )

    const shell = container.firstElementChild
    expect(shell).toHaveClass(embeddedResponsiveShell)
    expect(ref.current).toHaveClass(embeddedResponsiveState)
    expect(ref.current).not.toBe(shell)
  })
})
