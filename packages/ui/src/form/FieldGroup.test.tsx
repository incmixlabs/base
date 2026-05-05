import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FieldGroup } from './FieldGroup'
import { fieldGroupRowBase, fieldGroupRowResponsive, fieldGroupSideLabelsBase } from './FieldGroup.css'

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
    expect(view.container.querySelector(`.${fieldGroupSideLabelsBase}`)).toBeInTheDocument()
    expect(view.container.querySelector(`.${fieldGroupRowBase}`)).toBeInTheDocument()
    expect(view.container.querySelector(`.${fieldGroupRowResponsive}`)).toBeInTheDocument()
  })
})
