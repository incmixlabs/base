import { createResponsiveCustomPropertyMap } from './responsive-custom-properties'

const { vars: widthResponsiveVars, classes: widthResponsiveClasses } = createResponsiveCustomPropertyMap('width', {
  width: 'width',
  minWidth: 'min-width',
  maxWidth: 'max-width',
})

export { widthResponsiveClasses, widthResponsiveVars }
