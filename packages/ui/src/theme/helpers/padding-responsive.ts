import { createResponsiveCustomPropertyMap } from './responsive-custom-properties'

const { vars: paddingResponsiveVars, classes: paddingResponsiveClasses } = createResponsiveCustomPropertyMap(
  'padding',
  {
    p: 'padding',
    px: ['padding-left', 'padding-right'],
    py: ['padding-top', 'padding-bottom'],
    pt: 'padding-top',
    pr: 'padding-right',
    pb: 'padding-bottom',
    pl: 'padding-left',
  },
)

export { paddingResponsiveClasses, paddingResponsiveVars }
