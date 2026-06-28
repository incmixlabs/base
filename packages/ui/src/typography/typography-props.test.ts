import { describe, expect, it } from 'vitest'
import { blockquotePropDefs } from './blockquote/blockquote.props'
import { codePropDefs } from './code/code.props'
import { emPropDefs } from './em/em.props'
import { headingPropDefs } from './heading/heading.props'
import { linkPropDefs } from './link/link.props'
import { quotePropDefs } from './quote/quote.props'
import { strongPropDefs } from './strong/strong.props'
import { textPropDefs } from './text/text.props'

function expectScalarPropDef(def: unknown) {
  expect(def).not.toHaveProperty('responsive')
  expect(def).not.toHaveProperty('className')
}

describe('typography prop defs', () => {
  it('does not expose unsupported Code props', () => {
    expect(codePropDefs).not.toHaveProperty('asChild')
    expect(codePropDefs).not.toHaveProperty('weight')
    expect(codePropDefs).not.toHaveProperty('truncate')
    expect(codePropDefs).not.toHaveProperty('wrap')
  })

  it('does not expose unsupported Strong and Em props', () => {
    expect(strongPropDefs).not.toHaveProperty('asChild')
    expect(strongPropDefs).not.toHaveProperty('truncate')
    expect(strongPropDefs).not.toHaveProperty('wrap')
    expect(emPropDefs).not.toHaveProperty('asChild')
    expect(emPropDefs).not.toHaveProperty('truncate')
    expect(emPropDefs).not.toHaveProperty('wrap')
  })

  it('does not expose asChild for Quote and Blockquote', () => {
    expect(quotePropDefs).not.toHaveProperty('asChild')
    expect(quotePropDefs).toHaveProperty('truncate')
    expect(quotePropDefs).toHaveProperty('wrap')

    expect(blockquotePropDefs).not.toHaveProperty('asChild')
    expect(blockquotePropDefs).toHaveProperty('truncate')
    expect(blockquotePropDefs).toHaveProperty('wrap')
  })

  it('does not advertise responsive scalar typography props', () => {
    expectScalarPropDef(textPropDefs.weight)
    expectScalarPropDef(textPropDefs.align)
    expectScalarPropDef(textPropDefs.trim)
    expectScalarPropDef(textPropDefs.wrap)

    expectScalarPropDef(headingPropDefs.weight)
    expectScalarPropDef(headingPropDefs.align)
    expectScalarPropDef(headingPropDefs.trim)
    expectScalarPropDef(headingPropDefs.wrap)

    expectScalarPropDef(linkPropDefs.weight)
    expectScalarPropDef(linkPropDefs.trim)
    expectScalarPropDef(linkPropDefs.wrap)

    expectScalarPropDef(blockquotePropDefs.weight)
    expectScalarPropDef(blockquotePropDefs.wrap)
    expectScalarPropDef(quotePropDefs.wrap)
  })

  it('keeps typography size responsive without legacy af class metadata', () => {
    expect(textPropDefs.size).toHaveProperty('responsive', true)
    expect(textPropDefs.size).not.toHaveProperty('className')
    expect(headingPropDefs.size).toHaveProperty('responsive', true)
    expect(headingPropDefs.size).not.toHaveProperty('className')
    expect(linkPropDefs.size).toHaveProperty('responsive', true)
    expect(linkPropDefs.size).not.toHaveProperty('className')
  })
})
