import { heightPropDefs } from './height.props'
import { paddingPropDefs } from './padding.props'
import type { GetPropDefTypes, PropDef } from './prop-def'
import { widthPropDefs } from './width.props'

const overflowValues = ['visible', 'hidden', 'clip', 'scroll', 'auto'] as const
const positionValues = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const
// prettier-ignore
const positionEdgeValues = [
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
const flexShrinkValues = ['0', '1'] as const
const flexGrowValues = ['0', '1'] as const
const alignSelfValues = ['start', 'center', 'end', 'baseline', 'stretch'] as const
const justifySelfValues = ['start', 'center', 'end', 'baseline', 'stretch'] as const

const layoutPropDefs = {
  ...paddingPropDefs,
  ...widthPropDefs,
  ...heightPropDefs,
  /**
   * Sets the background color from a design token.
   * Accepts raw palette tokens like "green-6" and semantic tokens like "success-soft".
   *
   * @example
   * bg="green-6"
   * bg="success-soft"
   */
  bg: {
    type: 'string',
  },
  /**
   * Sets the border color from a design token.
   * Accepts raw palette tokens like "indigo-7" and semantic tokens like "success-border".
   * When used on Box or Container, a default `border` utility is applied if no border-width utility is present.
   *
   * @example
   * borderColor="indigo-7"
   * borderColor="success-border"
   */
  borderColor: {
    type: 'string',
  },
  /**
   * Sets the CSS **position** property.
   * Supports the corresponding CSS values and responsive objects.
   *
   * @example
   * position="absolute"
   * position={{ sm: 'absolute', lg: 'sticky' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/position
   */
  position: {
    type: 'enum',
    values: positionValues,
    responsive: true,
  },
  /**
   * Sets the CSS **inset** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * inset="4"
   * inset="-2"
   * inset={{ sm: '0', lg: '4' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/inset
   */
  inset: {
    type: 'enum',
    values: positionEdgeValues,
    responsive: true,
  },
  /**
   * Sets the CSS **top** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * top="4"
   * top="-2"
   * top={{ sm: '0', lg: '4' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/top
   */
  top: {
    type: 'enum',
    values: positionEdgeValues,
    responsive: true,
  },
  /**
   * Sets the CSS **right** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * right="4"
   * right="-2"
   * right={{ sm: '0', lg: '4' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/right
   */
  right: {
    type: 'enum',
    values: positionEdgeValues,
    responsive: true,
  },
  /**
   * Sets the CSS **bottom** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * bottom="4"
   * bottom="-2"
   * bottom={{ sm: '0', lg: '4' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/bottom
   */
  bottom: {
    type: 'enum',
    values: positionEdgeValues,
    responsive: true,
  },
  /**
   * Sets the CSS **left** property.
   * Supports space scale tokens and responsive token objects.
   *
   * @example
   * left="4"
   * left="-2"
   * left={{ sm: '0', lg: '4' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/left
   */
  left: {
    type: 'enum',
    values: positionEdgeValues,
    responsive: true,
  },
  /**
   * Sets the CSS **overflow** property.
   * Supports the corresponding CSS values and responsive objects.
   *
   * @example
   * overflow="hidden"
   * overflow={{ sm: 'hidden', lg: 'visible' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
   */
  overflow: {
    type: 'enum',
    values: overflowValues,
    responsive: true,
  },
  /**
   * Sets the CSS **overflow-x** property.
   * Supports the corresponding CSS values and responsive objects.
   *
   * @example
   * overflowX="hidden"
   * overflowX={{ sm: 'hidden', md: 'visible' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
   */
  overflowX: {
    type: 'enum',
    values: overflowValues,
    responsive: true,
  },
  /**
   * Sets the CSS **overflow-y** property.
   * Supports the corresponding CSS values and responsive objects.
   *
   * @example
   * overflowY="hidden"
   * overflowY={{ sm: 'hidden', md: 'visible' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
   */
  overflowY: {
    type: 'enum',
    values: overflowValues,
    responsive: true,
  },
  /**
   * Sets the CSS **flex-basis** property.
   * Supports CSS strings.
   *
   * @example
   * flexBasis="0"
   * flexBasis="100%"
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis
   */
  flexBasis: {
    type: 'string',
  },
  /**
   * Sets the CSS **flex-shrink** property.
   * Supports the corresponding token values and responsive objects.
   *
   * @example
   * flexShrink="0"
   * flexShrink="1"
   * flexShrink={{ sm: '0', lg: '1' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink
   */
  flexShrink: {
    type: 'enum',
    values: flexShrinkValues,
    responsive: true,
  },
  /**
   * Sets the CSS **flex-grow** property.
   * Supports the corresponding token values and responsive objects.
   *
   * @example
   * flexGrow="0"
   * flexGrow="1"
   * flexGrow={{ sm: '0', lg: '1' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow
   */
  flexGrow: {
    type: 'enum',
    values: flexGrowValues,
    responsive: true,
  },
  /**
   * Sets the CSS **grid-area** property.
   * Supports CSS strings.
   *
   * @example
   * gridArea="header"
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area
   */
  gridArea: {
    type: 'string',
  },
  /**
   * Sets the CSS **grid-column** property.
   * Supports CSS strings.
   *
   * @example
   * gridColumn="1"
   * gridColumn="1 / -1"
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column
   */
  gridColumn: {
    type: 'string',
  },
  /**
   * Sets the CSS **grid-column-start** property.
   * Supports CSS strings.
   *
   * @example
   * gridColumnStart="1"
   * gridColumnStart="auto"
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start
   */
  gridColumnStart: {
    type: 'string',
  },
  /**
   * Sets the CSS **grid-column-end** property.
   * Supports CSS strings.
   *
   * @example
   * gridColumnEnd="1"
   * gridColumnEnd="auto"
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end
   */
  gridColumnEnd: {
    type: 'string',
  },
  /**
   * Sets the CSS **grid-row** property.
   * Supports CSS strings.
   *
   * @example
   * gridRow="1"
   * gridRow="auto"
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row
   */
  gridRow: {
    type: 'string',
  },
  /**
   * Sets the CSS **grid-row-start** property.
   * Supports CSS strings.
   *
   * @example
   * gridRowStart="1"
   * gridRowStart="auto"
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-start
   */
  gridRowStart: {
    type: 'string',
  },
  /**
   * Sets the CSS **grid-row-end** property.
   * Supports CSS strings.
   *
   * @example
   * gridRowEnd="1"
   * gridRowEnd="auto"
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-end
   */
  gridRowEnd: {
    type: 'string',
  },
  /**
   * Sets the CSS **align-self** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * alignSelf="center"
   * alignSelf={{ sm: 'start', lg: 'center' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/align-self
   */
  alignSelf: {
    type: 'enum',
    values: alignSelfValues,
    responsive: true,
  },
  /**
   * Sets the CSS **justify-self** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * justifySelf="center"
   * justifySelf={{ sm: 'start', lg: 'center' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self
   */
  justifySelf: {
    type: 'enum',
    values: justifySelfValues,
    responsive: true,
  },
} satisfies {
  bg: PropDef<string>
  borderColor: PropDef<string>
  position: PropDef<(typeof positionValues)[number]>
  inset: PropDef<(typeof positionEdgeValues)[number]>
  top: PropDef<(typeof positionEdgeValues)[number]>
  right: PropDef<(typeof positionEdgeValues)[number]>
  bottom: PropDef<(typeof positionEdgeValues)[number]>
  left: PropDef<(typeof positionEdgeValues)[number]>
  overflow: PropDef<(typeof overflowValues)[number]>
  overflowX: PropDef<(typeof overflowValues)[number]>
  overflowY: PropDef<(typeof overflowValues)[number]>
  flexBasis: PropDef<string>
  flexShrink: PropDef<(typeof flexShrinkValues)[number]>
  flexGrow: PropDef<(typeof flexGrowValues)[number]>
  gridColumn: PropDef<string>
  gridColumnStart: PropDef<string>
  gridColumnEnd: PropDef<string>
  gridRow: PropDef<string>
  gridRowStart: PropDef<string>
  gridRowEnd: PropDef<string>
  gridArea: PropDef<string>
  alignSelf: PropDef<(typeof alignSelfValues)[number]>
  justifySelf: PropDef<(typeof justifySelfValues)[number]>
}

// Use all of the imported prop defs to ensure that JSDoc works
type LayoutProps = GetPropDefTypes<
  typeof paddingPropDefs & typeof widthPropDefs & typeof heightPropDefs & typeof layoutPropDefs
>

export type { LayoutProps }
export { layoutPropDefs }
