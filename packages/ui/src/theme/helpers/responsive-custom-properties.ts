const responsiveClassPrefix = {
  initial: '',
  xs: 'xs:',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
} as const

type ResponsiveCustomBreakpoint = keyof typeof responsiveClassPrefix
type ResponsiveCustomProperties<Property extends string> = Record<Property, Record<ResponsiveCustomBreakpoint, string>>
type ResponsiveCssProperties<Property extends string> = Record<Property, string | readonly string[]>

const responsiveBreakpoints = Object.keys(responsiveClassPrefix) as ResponsiveCustomBreakpoint[]

function toCustomPropertySegment(value: string): string {
  return value.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

function createResponsiveCustomProperties<Property extends string>(
  namespace: string,
  properties: readonly Property[],
): ResponsiveCustomProperties<Property> {
  return Object.fromEntries(
    properties.map(property => [
      property,
      Object.fromEntries(
        responsiveBreakpoints.map(breakpoint => [
          breakpoint,
          `--af-${namespace}-${toCustomPropertySegment(property)}-${breakpoint}`,
        ]),
      ),
    ]),
  ) as ResponsiveCustomProperties<Property>
}

function createResponsiveClass(
  cssProperty: string,
  customProperty: string,
  breakpoint: ResponsiveCustomBreakpoint,
): string {
  return `${responsiveClassPrefix[breakpoint]}[${cssProperty}:var(${customProperty})]`
}

function createResponsiveClasses<Property extends string>(
  vars: ResponsiveCustomProperties<Property>,
  cssProperties: ResponsiveCssProperties<Property>,
): Record<Property, string> {
  return Object.fromEntries(
    Object.entries(cssProperties).map(([property, cssProperty]) => {
      const cssPropertyList = Array.isArray(cssProperty) ? cssProperty : [cssProperty]
      const classes = responsiveBreakpoints.flatMap(breakpoint =>
        cssPropertyList.map(propertyName =>
          createResponsiveClass(propertyName, vars[property as Property][breakpoint], breakpoint),
        ),
      )

      return [property, classes.join(' ')]
    }),
  ) as Record<Property, string>
}

export function createResponsiveCustomPropertyMap<Property extends string>(
  namespace: string,
  cssProperties: ResponsiveCssProperties<Property>,
) {
  const properties = Object.keys(cssProperties) as Property[]
  const vars = createResponsiveCustomProperties(namespace, properties)
  const classes = createResponsiveClasses(vars, cssProperties)

  return { vars, classes }
}
