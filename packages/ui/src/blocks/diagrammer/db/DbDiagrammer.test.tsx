import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Diagrammer } from '../Diagrammer'
import { toDbDiagrammerDocument } from './model'
import { sampleDbSchemaDiagramDocument } from './sample-data'

describe('DB Diagrammer story data', () => {
  it('renders generated DB schema nodes', async () => {
    render(
      <Diagrammer
        defaultDocument={toDbDiagrammerDocument(sampleDbSchemaDiagramDocument)}
        height={480}
        fitView={false}
      />,
    )

    expect(await screen.findByText('users')).toBeInTheDocument()
    expect(screen.getByText('orders')).toBeInTheDocument()
    expect(screen.getByText('order_items')).toBeInTheDocument()
    expect(screen.getByText('order_summary')).toBeInTheDocument()
  })
})
