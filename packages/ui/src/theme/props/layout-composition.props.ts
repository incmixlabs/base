import { layoutTokens } from '@/theme/tokens'
import { gapPropDefs } from './gap.props'
import type { GetPropDefTypes, PropDef } from './prop-def'

const layoutCompositionModes = ['block', 'flex', 'row', 'column', 'grid'] as const
const layoutCompositionColumnValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'none'] as const
const layoutCompositionRowValues = ['1', '2', '3', '4', '5', '6', 'none'] as const
const layoutCompositionFlowValues = ['row', 'column', 'dense', 'row-dense', 'column-dense'] as const

const layoutCompositionPropDefs = {
  /**
   * Selects the child layout mode applied to the component root.
   *
   * @example
   * layout="row"
   * layout="grid"
   */
  layout: { type: 'enum', values: layoutCompositionModes },
  /**
   * Sets the CSS **flex-direction** property when using flex layout.
   *
   * @example
   * direction="column"
   * direction={{ initial: 'column', md: 'row' }}
   */
  direction: {
    type: 'enum',
    className: 'af-fd',
    values: layoutTokens.flexDirection,
    responsive: true,
  },
  /**
   * Sets the CSS **align-items** property when using flex or grid layout.
   *
   * @example
   * align="center"
   * align={{ initial: 'stretch', md: 'center' }}
   */
  align: {
    type: 'enum',
    className: 'af-ai',
    values: layoutTokens.alignItems,
    responsive: true,
  },
  /**
   * Sets the CSS **justify-content** property when using flex or grid layout.
   *
   * @example
   * justify="between"
   * justify={{ initial: 'start', md: 'between' }}
   */
  justify: {
    type: 'enum',
    className: 'af-jc',
    values: layoutTokens.justifyContent,
    responsive: true,
  },
  /**
   * Sets the CSS **flex-wrap** property when using flex layout.
   *
   * @example
   * wrap="wrap"
   */
  wrap: {
    type: 'enum',
    className: 'af-fw',
    values: layoutTokens.flexWrap,
    responsive: true,
  },
  ...gapPropDefs,
  /**
   * Sets the CSS **grid-template-areas** property when using grid layout.
   *
   * @example
   * areas='"header header" "nav main"'
   */
  areas: {
    type: 'string',
    className: 'af-gta',
    customProperties: ['--grid-template-areas'],
    responsive: true,
  },
  /**
   * Sets the CSS **grid-template-columns** property when using grid layout.
   *
   * @example
   * columns="3"
   * columns="minmax(0, 1fr) auto"
   */
  columns: {
    type: 'enum | string',
    className: 'af-gtc',
    customProperties: ['--grid-template-columns'],
    values: layoutCompositionColumnValues,
    responsive: true,
  },
  /**
   * Sets the CSS **grid-template-rows** property when using grid layout.
   *
   * @example
   * rows="2"
   * rows="auto minmax(0, 1fr)"
   */
  rows: {
    type: 'enum | string',
    className: 'af-gtr',
    customProperties: ['--grid-template-rows'],
    values: layoutCompositionRowValues,
    responsive: true,
  },
  /**
   * Sets the CSS **grid-auto-flow** property when using grid layout.
   *
   * @example
   * flow="row"
   * flow="row-dense"
   */
  flow: {
    type: 'enum',
    className: 'af-gaf',
    values: layoutCompositionFlowValues,
    responsive: true,
  },
  /**
   * Sets the CSS **align-content** property when using flex or grid layout.
   *
   * @example
   * alignContent="between"
   */
  alignContent: {
    type: 'enum',
    className: 'af-ac',
    values: layoutTokens.alignContent,
    responsive: true,
  },
  /**
   * Sets the CSS **justify-items** property when using grid layout.
   *
   * @example
   * justifyItems="center"
   */
  justifyItems: {
    type: 'enum',
    className: 'af-ji',
    values: layoutTokens.justifyItems,
    responsive: true,
  },
} satisfies {
  layout: PropDef<(typeof layoutCompositionModes)[number]>
  direction: PropDef<(typeof layoutTokens.flexDirection)[number]>
  align: PropDef<(typeof layoutTokens.alignItems)[number]>
  justify: PropDef<(typeof layoutTokens.justifyContent)[number]>
  wrap: PropDef<(typeof layoutTokens.flexWrap)[number]>
  gap: PropDef<(typeof gapPropDefs.gap.values)[number]>
  gapX: PropDef<(typeof gapPropDefs.gapX.values)[number]>
  gapY: PropDef<(typeof gapPropDefs.gapY.values)[number]>
  areas: PropDef<string>
  columns: PropDef<(typeof layoutCompositionColumnValues)[number]>
  rows: PropDef<(typeof layoutCompositionRowValues)[number]>
  flow: PropDef<(typeof layoutCompositionFlowValues)[number]>
  alignContent: PropDef<(typeof layoutTokens.alignContent)[number]>
  justifyItems: PropDef<(typeof layoutTokens.justifyItems)[number]>
}

type LayoutCompositionPropDefProps = GetPropDefTypes<typeof layoutCompositionPropDefs>
type LayoutCompositionMode = (typeof layoutCompositionModes)[number]

export type { LayoutCompositionMode, LayoutCompositionPropDefProps }
export {
  layoutCompositionColumnValues,
  layoutCompositionFlowValues,
  layoutCompositionModes,
  layoutCompositionPropDefs,
  layoutCompositionRowValues,
}
