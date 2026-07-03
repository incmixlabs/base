import type { GetPropDefTypes, PropDef } from './prop-def'

const widthPropDefs = {
  /**
   * Sets the CSS **width** property.
   * Supports common width tokens, CSS strings, and responsive objects.
   *
   * @example
   * width="full"
   * width="4"
   * width="100px"
   * width={{ md: '100vw', xl: '1400px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/width
   */
  width: {
    type: 'string',
    responsive: true,
  },
  /**
   * Sets the CSS **min-width** property.
   * Supports common width tokens, CSS strings, and responsive objects.
   *
   * @example
   * minWidth="0"
   * minWidth="100px"
   * minWidth={{ md: '100vw', xl: '1400px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/min-width
   */
  minWidth: {
    type: 'string',
    responsive: true,
  },
  /**
   * Sets the CSS **max-width** property.
   * Supports common width tokens, CSS strings, and responsive objects.
   *
   * @example
   * maxWidth="md"
   * maxWidth="100px"
   * maxWidth={{ md: '100vw', xl: '1400px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/max-width
   */
  maxWidth: {
    type: 'string',
    responsive: true,
  },
} satisfies {
  width: PropDef<string>
  minWidth: PropDef<string>
  maxWidth: PropDef<string>
}

type WidthProps = GetPropDefTypes<typeof widthPropDefs>

export type { WidthProps }
export { widthPropDefs }
