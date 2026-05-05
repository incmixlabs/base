import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Diagrammer } from './Diagrammer'
import { sampleDbDiagramDocument } from './sample-data'

describe('Diagrammer', () => {
  it('renders default document nodes', async () => {
    render(<Diagrammer defaultDocument={sampleDbDiagramDocument} height={480} fitView={false} />)

    expect(await screen.findByText('users')).toBeInTheDocument()
    expect(screen.getByText('orders')).toBeInTheDocument()
  })
})
