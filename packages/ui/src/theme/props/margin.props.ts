import type { GetPropDefTypes, PropDef } from './prop-def'

// prettier-ignore
const marginValues = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '-1',
  '-2',
  '-3',
  '-4',
  '-5',
  '-6',
  '-7',
  '-8',
  '-9',
] as const

const marginPropDefs = {
  /**
   * Sets the CSS **margin** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * m="4"
   * m="-2"
   * m={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin
   */
  m: {
    type: 'enum',
    values: marginValues,
    responsive: true,
  },
  /**
   * Sets the CSS **margin-left** and **margin-right** properties.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * mx="4"
   * mx="-2"
   * mx={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right
   */
  mx: {
    type: 'enum',
    values: marginValues,
    responsive: true,
  },
  /**
   * Sets the CSS **margin-top** and **margin-bottom** properties.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * my="4"
   * my="-2"
   * my={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom
   */
  my: {
    type: 'enum',
    values: marginValues,
    responsive: true,
  },
  /**
   * Sets the CSS **margin-top** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * mt="4"
   * mt="-2"
   * mt={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top
   */
  mt: {
    type: 'enum',
    values: marginValues,
    responsive: true,
  },
  /**
   * Sets the CSS **margin-right** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * mr="4"
   * mr="-2"
   * mr={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right
   */
  mr: {
    type: 'enum',
    values: marginValues,
    responsive: true,
  },
  /**
   * Sets the CSS **margin-bottom** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * mb="4"
   * mb="-2"
   * mb={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom
   */
  mb: {
    type: 'enum',
    values: marginValues,
    responsive: true,
  },
  /**
   * Sets the CSS **margin-left** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * ml="4"
   * ml="-2"
   * ml={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left
   */
  ml: {
    type: 'enum',
    values: marginValues,
    responsive: true,
  },
} satisfies {
  m: PropDef<(typeof marginValues)[number]>
  mx: PropDef<(typeof marginValues)[number]>
  my: PropDef<(typeof marginValues)[number]>
  mt: PropDef<(typeof marginValues)[number]>
  mr: PropDef<(typeof marginValues)[number]>
  mb: PropDef<(typeof marginValues)[number]>
  ml: PropDef<(typeof marginValues)[number]>
}

type MarginProps = GetPropDefTypes<typeof marginPropDefs>

export type { MarginProps }
export { marginPropDefs }
