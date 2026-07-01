import { createResponsiveCustomPropertyMap } from './responsive-custom-properties'

const { vars: heightResponsiveVars, classes: heightResponsiveClasses } = createResponsiveCustomPropertyMap('height', {
  height: 'height',
  minHeight: 'min-height',
  maxHeight: 'max-height',
})

export { heightResponsiveClasses, heightResponsiveVars }
