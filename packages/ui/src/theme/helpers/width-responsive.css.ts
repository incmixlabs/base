import { createResponsiveDimensionMap } from './responsive-dimension.css'

const properties = ['width', 'minWidth', 'maxWidth'] as const

const { vars: widthResponsiveVars, classes: widthResponsiveClasses } = createResponsiveDimensionMap(properties)

export { widthResponsiveClasses, widthResponsiveVars }
