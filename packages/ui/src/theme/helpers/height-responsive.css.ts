import { createResponsiveDimensionMap } from './responsive-dimension.css'

const properties = ['height', 'minHeight', 'maxHeight'] as const

const { vars: heightResponsiveVars, classes: heightResponsiveClasses } = createResponsiveDimensionMap(properties)

export { heightResponsiveVars, heightResponsiveClasses }
