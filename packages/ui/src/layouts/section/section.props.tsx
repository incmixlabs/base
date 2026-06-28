import { asChildPropDef } from '@/theme/props/as-child.prop'

import type { GetPropDefTypes, PropDef } from '@/theme/props/prop-def'

export const sectionSizes = ['1', '2', '3', '4'] as const
export type SectionSize = (typeof sectionSizes)[number]

export const sectionDisplayValues = ['none', 'initial'] as const
export type SectionDisplay = (typeof sectionDisplayValues)[number]

const sectionPropDefs = {
  ...asChildPropDef,
  /**
   * Controls the vertical padding of the section.
   *
   * @values
   * | Size     | Padding |
   * | :------- | ------: |
   * | size="1" | 24px    |
   * | size="2" | 40px    |
   * | size="3" | 64px    |
   * | size="4" | 96px    |
   *
   * @example
   * size="4"
   * size={{ sm: '3', lg: '4' }}
   *
   * @link
   * https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/section.css
   */
  size: {
    type: 'enum',
    className: 'af-size',
    values: sectionSizes,
    default: '3',
    responsive: true,
  },
  /**
   * Controls whether the section is visible or hidden.
   * Supports "none", "initial", and responsive object values.
   *
   * @example
   * display="none"
   * display={{ sm: 'none', lg: 'initial' }}
   */
  display: {
    type: 'enum',
    className: 'af-display',
    values: sectionDisplayValues,
    responsive: true,
  },
} satisfies {
  size: PropDef<SectionSize>
  display: PropDef<SectionDisplay>
}

// Use all of the imported prop defs to ensure that JSDoc works
type SectionOwnProps = GetPropDefTypes<typeof sectionPropDefs & typeof asChildPropDef>

export type { SectionOwnProps }
export { sectionPropDefs }
