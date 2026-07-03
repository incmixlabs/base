import { asChildPropDef } from '@/theme/props/as-child.prop'
import { gapPropDefs } from '@/theme/props/gap.props'
import { layoutCompositionColumnValues, layoutCompositionRowValues } from '@/theme/props/layout-composition.props'

import type { GetPropDefTypes, PropDef } from '@/theme/props/prop-def'

const as = ['div', 'span'] as const
const displayValues = ['none', 'inline-grid', 'grid'] as const
const columnsValues = layoutCompositionColumnValues
const rowsValues = layoutCompositionRowValues
const flowValues = ['row', 'column', 'dense', 'row-dense', 'column-dense'] as const
const alignValues = ['start', 'center', 'end', 'baseline', 'stretch'] as const
const justifyValues = ['start', 'center', 'end', 'between'] as const
const alignContentValues = ['start', 'center', 'end', 'baseline', 'between', 'around', 'evenly', 'stretch'] as const
const justifyItemsValues = ['start', 'center', 'end', 'baseline', 'stretch'] as const

const gridPropDefs = {
  /**
   * Controls whether to render **div** or **span**
   *
   * @example
   * as="div"
   * as="span"
   */
  as: { type: 'enum', values: as, default: 'div' },
  ...asChildPropDef,
  /**
   * Sets the CSS **display** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * display="inline-grid"
   * display={{ sm: 'none', lg: 'grid' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/display
   */
  display: {
    type: 'enum',
    values: displayValues,
    responsive: true,
  },
  /**
   * Sets the CSS **grid-template** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * template='"header header" "sidebar content"'
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas
   */
  areas: {
    type: 'string',
    responsive: true,
  },
  /**
   * Sets the CSS **grid-template-columns** property.
   * Supports numeric string values, CSS strings and responsive objects.
   *
   * Use numeric string values to create grid columns of even size.
   *
   * @example
   * columns="3"
   * columns="100px 1fr"
   * columns={{ xs: '1', md: 'auto 1fr' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns
   */
  columns: {
    type: 'enum | string',
    values: columnsValues,
    responsive: true,
  },
  /**
   * Sets the CSS **grid-template-rows** property.
   * Supports numeric string values, CSS strings and responsive objects.
   *
   * Use numeric string values to create grid rows of even size.
   *
   * @example
   * rows="3"
   * rows="100px 1fr"
   * rows={{ xs: '1', md: 'auto 1fr' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows
   */
  rows: {
    type: 'enum | string',
    values: rowsValues,
    responsive: true,
  },
  /**
   * Sets the CSS **grid-auto-flow** property.
   * Supports the corresponding CSS values and responsive objects.
   *
   * @example
   * flow="column"
   * flow={{ sm: 'column', lg: 'row' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow
   */
  flow: {
    type: 'enum',
    values: flowValues,
    responsive: true,
  },
  /**
   * Sets the CSS **align-items** property.
   * Supports the corresponding CSS values and responsive objects.
   *
   * @example
   * align="center"
   * align={{ sm: 'baseline', lg: 'center' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
   */
  align: {
    type: 'enum',
    values: alignValues,
    responsive: true,
  },
  /**
   * Sets the CSS **justify-content** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * justify="between"
   * justify={{ sm: 'start', lg: 'center' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
   */
  justify: {
    type: 'enum',
    values: justifyValues,
    responsive: true,
  },
  /**
   * Sets the CSS **align-content** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * alignContent="between"
   * alignContent={{ sm: 'start', lg: 'center' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/align-content
   */
  alignContent: {
    type: 'enum',
    values: alignContentValues,
    responsive: true,
  },
  /**
   * Sets the CSS **justify-items** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * justifyItems="center"
   * justifyItems={{ sm: 'start', lg: 'center' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/align-content
   */
  justifyItems: {
    type: 'enum',
    values: justifyItemsValues,
    responsive: true,
  },
  ...gapPropDefs,
} satisfies {
  as: PropDef<(typeof as)[number]>
  display: PropDef<(typeof displayValues)[number]>
  areas: PropDef<string>
  columns: PropDef<(typeof columnsValues)[number]>
  rows: PropDef<(typeof rowsValues)[number]>
  flow: PropDef<(typeof flowValues)[number]>
  align: PropDef<(typeof alignValues)[number]>
  justify: PropDef<(typeof justifyValues)[number]>
  alignContent: PropDef<(typeof alignContentValues)[number]>
  justifyItems: PropDef<(typeof justifyItemsValues)[number]>
}

// Use all of the imported prop defs to ensure that JSDoc works
type GridOwnProps = GetPropDefTypes<typeof gridPropDefs & typeof asChildPropDef>

export type { GridOwnProps }
export { gridPropDefs }
