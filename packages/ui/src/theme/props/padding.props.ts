import type { GetPropDefTypes, PropDef } from './prop-def'

const paddingValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

const paddingPropDefs = {
  /**
   * Sets the CSS **padding** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * p="4"
   * p={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding
   */
  p: {
    type: 'enum',
    values: paddingValues,
    responsive: true,
  },
  /**
   * Sets the CSS **padding-left** and **padding-right** properties.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * px="4"
   * px={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right
   */
  px: {
    type: 'enum',
    values: paddingValues,
    responsive: true,
  },
  /**
   * Sets the CSS **padding-top** and **padding-bottom** properties.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * py="4"
   * py={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom
   */
  py: {
    type: 'enum',
    values: paddingValues,
    responsive: true,
  },
  /**
   * Sets the CSS **padding-top** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * pt="4"
   * pt={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top
   */
  pt: {
    type: 'enum',
    values: paddingValues,
    responsive: true,
  },
  /**
   * Sets the CSS **padding-right** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * pr="4"
   * pr={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right
   */
  pr: {
    type: 'enum',
    values: paddingValues,
    responsive: true,
  },
  /**
   * Sets the CSS **padding-bottom** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * pb="4"
   * pb={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom
   */
  pb: {
    type: 'enum',
    values: paddingValues,
    responsive: true,
  },
  /**
   * Sets the CSS **padding-left** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * pl="4"
   * pl={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left
   */
  pl: {
    type: 'enum',
    values: paddingValues,
    responsive: true,
  },
} satisfies {
  p: PropDef<(typeof paddingValues)[number]>
  px: PropDef<(typeof paddingValues)[number]>
  py: PropDef<(typeof paddingValues)[number]>
  pt: PropDef<(typeof paddingValues)[number]>
  pr: PropDef<(typeof paddingValues)[number]>
  pb: PropDef<(typeof paddingValues)[number]>
  pl: PropDef<(typeof paddingValues)[number]>
}

type PaddingProps = GetPropDefTypes<typeof paddingPropDefs>

export type { PaddingProps }
export { paddingPropDefs }
