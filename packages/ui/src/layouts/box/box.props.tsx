import { asChildPropDef } from '@/theme/props/as-child.prop'
import { layoutPropDefs } from '@/theme/props/layout.props'
import { layoutCompositionPropDefs } from '@/theme/props/layout-composition.props'
import { marginPropDefs } from '@/theme/props/margin.props'
import { paddingPropDefs } from '@/theme/props/padding.props'
import type { GetPropDefTypes, PropDef } from '@/theme/props/prop-def'
import { layoutTokens, SURFACE_COLOR_KEYS } from '@/theme/tokens'

const as = ['div', 'span'] as const
const displayValues = layoutTokens.display
const boxVariants = ['solid', 'soft', 'surface'] as const
const boxTextValues = ['auto', 'contrast', 'text', 'primary', 'inverse'] as const
type BoxPaddingValue = (typeof paddingPropDefs.p.values)[number]
type BoxMarginValue = (typeof marginPropDefs.m.values)[number]

const boxPropDefs = {
  /**
   * Controls whether to render **div** or **span**
   *
   * @example
   * as="div"
   * as="span"
   */
  as: { type: 'enum', values: as, default: 'div' },
  ...asChildPropDef,
  ...layoutPropDefs,
  ...layoutCompositionPropDefs,
  ...marginPropDefs,
  /**
   * Alias for `p`.
   * Sets the CSS **padding** property.
   * Supports space scale values, CSS strings, and responsive objects.
   *
   * @example
   * padding="4"
   * padding="100px"
   * padding={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/padding
   */
  padding: {
    ...paddingPropDefs.p,
  },
  /**
   * Alias for `m`.
   * Sets the CSS **margin** property.
   * Supports space scale values, CSS strings, and responsive objects.
   *
   * @example
   * margin="4"
   * margin="100px"
   * margin={{ sm: '6', lg: '9' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/margin
   */
  margin: {
    ...marginPropDefs.m,
  },
  /**
   * Sets the CSS **display** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * display="inline-block"
   * display={{ sm: 'none', lg: 'block' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/display
   */
  display: {
    type: 'enum',
    className: 'af-display',
    values: displayValues,
    responsive: true,
  },
  /**
   * Resolves paired background and text colors from a semantic or chart color lane.
   *
   * @example
   * color="primary"
   * color="chart1"
   * color="chart-1"
   */
  color: {
    type: 'enum',
    values: SURFACE_COLOR_KEYS,
  },
  /**
   * Preferred alias for `color` when using Box as a surface host.
   *
   * @example
   * tone="primary"
   * tone="chart1"
   * tone="chart-1"
   */
  tone: {
    type: 'enum',
    values: SURFACE_COLOR_KEYS,
  },
  /**
   * Selects the surface treatment for `color`.
   *
   * @example
   * variant="solid"
   * variant="soft"
   * variant="surface"
   */
  variant: {
    type: 'enum',
    values: boxVariants,
    default: 'surface',
  },
  /**
   * Selects the text color treatment for `color`.
   *
   * @example
   * text="contrast"
   * text="primary"
   */
  text: {
    type: 'enum',
    values: boxTextValues,
    default: 'auto',
  },
} satisfies {
  as: PropDef<(typeof as)[number]>
  padding: PropDef<BoxPaddingValue>
  margin: PropDef<BoxMarginValue>
  display: PropDef<(typeof displayValues)[number]>
  color: PropDef<(typeof SURFACE_COLOR_KEYS)[number]>
  tone: PropDef<(typeof SURFACE_COLOR_KEYS)[number]>
  variant: PropDef<(typeof boxVariants)[number]>
  text: PropDef<(typeof boxTextValues)[number]>
}

// Use all of the imported prop defs to ensure that JSDoc works
type BoxOwnProps = GetPropDefTypes<typeof boxPropDefs & typeof asChildPropDef & typeof layoutPropDefs>

export { boxPropDefs }
export type { BoxOwnProps }
