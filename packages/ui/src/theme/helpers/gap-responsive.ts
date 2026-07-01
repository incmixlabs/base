import { createResponsiveCustomPropertyMap } from './responsive-custom-properties'

const { vars: gapResponsiveVars, classes: gapResponsiveClasses } = createResponsiveCustomPropertyMap('gap', {
  gap: 'gap',
  gapX: 'column-gap',
  gapY: 'row-gap',
})

export { gapResponsiveClasses, gapResponsiveVars }
