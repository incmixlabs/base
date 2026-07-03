import type { GetPropDefTypes, PropDef } from './prop-def'

const heightPropDefs = {
  /**
   * Sets the CSS **height** property.
   * Supports common height tokens, CSS strings, and responsive objects.
   *
   * @example
   * height="full"
   * height="4"
   * height="100px"
   * height={{ md: '100vh', xl: '600px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/height
   */
  height: {
    type: 'string',
    responsive: true,
  },
  /**
   * Sets the CSS **min-height** property.
   * Supports common height tokens, CSS strings, and responsive objects.
   *
   * @example
   * minHeight="0"
   * minHeight="100svh"
   * minHeight="100px"
   * minHeight={{ md: '100vh', xl: '600px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/min-height
   */
  minHeight: {
    type: 'string',
    responsive: true,
  },
  /**
   * Sets the CSS **max-height** property.
   * Supports common height tokens, CSS strings, and responsive objects.
   *
   * @example
   * maxHeight="screen"
   * maxHeight="100px"
   * maxHeight={{ md: '100vh', xl: '600px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/max-height
   */
  maxHeight: {
    type: 'string',
    responsive: true,
  },
} satisfies {
  height: PropDef<string>
  minHeight: PropDef<string>
  maxHeight: PropDef<string>
}

type HeightProps = GetPropDefTypes<typeof heightPropDefs>

export type { HeightProps }
export { heightPropDefs }
