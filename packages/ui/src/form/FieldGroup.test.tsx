import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FieldGroup } from './FieldGroup'
import { expectClassTokens } from './test-utils'

describe('FieldGroup', () => {
  it('places the side-label container query on the group root and applies responsive row classes to descendants', () => {
    const view = render(
      <FieldGroup layout="side-labels">
        <FieldGroup.Row label="Email" description="Work address">
          <div>Field</div>
        </FieldGroup.Row>
      </FieldGroup>,
    )

    expect(screen.getByText('Field')).toBeInTheDocument()
    expectClassTokens(view.container.firstElementChild?.className, ['[container-type:inline-size]'])

    const row = screen.getByText('Email').closest('div')?.parentElement
    expectClassTokens(row?.className, [
      'grid',
      'grid-cols-[minmax(0,1fr)]',
      'items-start',
      'gap-y-[var(--theme-rhythm-field-group-row-gap,1rem)]',
      'cq-md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]',
      'cq-md:gap-x-[var(--theme-rhythm-field-group-column-gap,2rem)]',
    ])
    expectClassTokens(screen.getByText('Work address').className, ['mt-1', 'text-sm', 'text-muted'])
  })
})
