import { describe, expect, it } from 'vitest'
import { blockquotePropDefs } from './blockquote/blockquote.props'
import { codePropDefs } from './code/code.props'
import { emPropDefs } from './em/em.props'
import { quotePropDefs } from './quote/quote.props'
import { strongPropDefs } from './strong/strong.props'

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
})
