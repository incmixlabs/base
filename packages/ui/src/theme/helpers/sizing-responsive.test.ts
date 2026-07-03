import { describe, expect, it } from 'vitest'
import { heightResponsiveUtilityClassNames } from './height-responsive'
import { widthResponsiveUtilityClassNames } from './width-responsive'

describe('responsive sizing utility safelists', () => {
  it('includes breakpoint-prefixed width token utilities emitted by layout props', () => {
    expect(widthResponsiveUtilityClassNames).toEqual(expect.arrayContaining(['md:w-3', 'sm:min-w-0', 'xl:max-w-md']))
  })

  it('includes breakpoint-prefixed height token utilities emitted by layout props', () => {
    expect(heightResponsiveUtilityClassNames).toEqual(
      expect.arrayContaining(['md:h-4', 'sm:min-h-0', 'xl:max-h-screen']),
    )
  })
})
