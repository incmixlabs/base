import { SPACING_SCALE_VALUES } from '@incmix/theme'
import type { PropDef } from './prop-def'

const gapValues = SPACING_SCALE_VALUES

const gapPropDefs = {
  /**
   * Sets the CSS **gap** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * gap="4"
   * gap={{ sm: '2', lg: '6' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/gap
   */
  gap: {
    type: 'enum',
    values: gapValues,
    responsive: true,
  },
  /**
   * Sets the CSS **column-gap** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * gapX="4"
   * gapX={{ sm: '2', lg: '6' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap
   */
  gapX: {
    type: 'enum',
    values: gapValues,
    responsive: true,
  },
  /**
   * Sets the CSS **row-gap** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * gapY="4"
   * gapY={{ sm: '2', lg: '6' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap
   */
  gapY: {
    type: 'enum',
    values: gapValues,
    responsive: true,
  },
} satisfies {
  gap: PropDef<(typeof gapValues)[number]>
  gapX: PropDef<(typeof gapValues)[number]>
  gapY: PropDef<(typeof gapValues)[number]>
}

export { gapPropDefs }
