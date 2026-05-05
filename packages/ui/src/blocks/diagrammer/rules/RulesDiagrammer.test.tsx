import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Diagrammer } from '../Diagrammer'
import { toRulesDiagrammerDocument } from './model'
import { sampleRulesDiagramModelDocument } from './sample-data'

describe('Rules Diagrammer story data', () => {
  it('renders generated rules nodes', async () => {
    render(
      <Diagrammer
        defaultDocument={toRulesDiagrammerDocument(sampleRulesDiagramModelDocument)}
        height={480}
        fitView={false}
      />,
    )

    expect(await screen.findByText('Order received')).toBeInTheDocument()
    expect(screen.getByText('Customer is VIP?')).toBeInTheDocument()
    expect(screen.getByText('Apply VIP discount')).toBeInTheDocument()
  })
})
