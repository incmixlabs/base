import { createResponsiveCustomPropertyMap } from './responsive-custom-properties'

const { vars: marginResponsiveVars, classes: marginResponsiveClasses } = createResponsiveCustomPropertyMap('margin', {
  m: 'margin',
  mx: ['margin-left', 'margin-right'],
  my: ['margin-top', 'margin-bottom'],
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
})

export { marginResponsiveClasses, marginResponsiveVars }
