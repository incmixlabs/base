import type { ComponentPropsWithoutRef } from 'react'
import { asChildPropDef } from '@/theme/props/as-child.prop'
import { layoutPropDefs } from '@/theme/props/layout.props'
import { layoutCompositionPropDefs } from '@/theme/props/layout-composition.props'
import type { PropDef } from '@/theme/props/prop-def'
import type {
  ContainerAlign,
  ContainerSize,
  LayoutCompositionProps,
  Responsive,
  SharedLayoutProps,
} from '../layout-utils'

const sizes = ['1', '2', '3', '4'] as const
const displayValues = ['none', 'initial'] as const
const alignValues = ['left', 'center', 'right'] as const

export type ContainerDisplay = (typeof displayValues)[number]

export interface ContainerOwnProps extends SharedLayoutProps {
  /** Merge props onto child element */
  asChild?: boolean
  /** CSS display property */
  display?: Responsive<ContainerDisplay>
  /** Maximum width of container */
  size?: Responsive<ContainerSize>
  /** Horizontal alignment */
  align?: Responsive<ContainerAlign>
  /** Child layout mode applied to the inner container. */
  layout?: LayoutCompositionProps['layout']
  /** Child layout props applied to the inner container. */
  layoutProps?: Omit<LayoutCompositionProps, 'layout'>
}

export interface ContainerProps
  extends ContainerOwnProps,
    Omit<ComponentPropsWithoutRef<'div'>, keyof ContainerOwnProps> {}

export namespace ContainerProps {
  export type Root = ContainerProps
  export type Display = ContainerDisplay
}

const containerPropDefs = {
  ...asChildPropDef,
  ...layoutPropDefs,
  /**
   * Controls the **max-width** of the content within the container.
   * Supports the predefined values and responsive objects.
   *
   * @values
   * | Size     | Max. width |
   * | :------- | ---------: |
   * | size="1" | 448px      |
   * | size="2" | 688px      |
   * | size="3" | 880px      |
   * | size="4" | 1136px     |
   *
   * @example
   * size="4"
   * size={{ sm: '3', lg: '4' }}
   *
   * @link
   * https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/container.css
   */
  size: {
    type: 'enum',
    className: 'af-size',
    values: sizes,
    default: '4',
    responsive: true,
  },
  /**
   * Controls whether the container is visible or hidden.
   * Supports "none", "initial", and responsive object values.
   *
   * @example
   * display="none"
   * display={{ sm: 'none', lg: 'initial' }}
   */
  display: {
    type: 'enum',
    className: 'af-display',
    values: displayValues,
    parseValue: parseDisplayValue,
    responsive: true,
  },
  /**
   * Controls the alignment of the content within the container.
   *
   * @example
   * align="center"
   * align={{ initial: 'left', lg: 'center' }}
   */
  align: {
    type: 'enum',
    className: 'af-ai',
    values: alignValues,
    parseValue: parseAlignValue,
    responsive: true,
  },
  layout: layoutCompositionPropDefs.layout,
  layoutProps: {
    type: 'object',
    typeFullName: "Omit<LayoutCompositionProps, 'layout'>",
  },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  display: PropDef<(typeof displayValues)[number]>
  align: PropDef<(typeof alignValues)[number]>
  layout: typeof layoutCompositionPropDefs.layout
  layoutProps: PropDef<Omit<LayoutCompositionProps, 'layout'>>
}

function parseDisplayValue(value: string) {
  return value === 'initial' ? 'flex' : value
}

function parseAlignValue(value: string) {
  return value === 'left' ? 'start' : value === 'right' ? 'end' : value
}

export { containerPropDefs }
