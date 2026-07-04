import { describe, expect, it } from 'vitest'
import { textFieldEnhancementVariants, textFieldSurfaceColorVariants } from '../text-field.class'
import { expectClassTokens, splitClassNames } from '../test-utils'
import { getDateFieldSurfaceClassName } from './date-field-shell'

describe('getDateFieldSurfaceClassName', () => {
  it('maps regular semantic colors through the shared TextField surface lanes', () => {
    const className = getDateFieldSurfaceClassName({
      color: 'success',
      floatingStyle: null,
      radius: 'md',
      textFieldSize: 'md',
      variant: 'soft',
    })

    expectClassTokens(className, splitClassNames(textFieldSurfaceColorVariants.success.soft))
    expectClassTokens(className, splitClassNames(textFieldEnhancementVariants.success.soft))
    expect(className).not.toContain('form-color')
  })
})
