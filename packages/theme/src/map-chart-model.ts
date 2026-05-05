export type MapChartPosition = [number, number] | [number, number, number]

export type MapChartGeometry =
  | {
      type: 'Polygon'
      coordinates: MapChartPosition[][]
    }
  | {
      type: 'MultiPolygon'
      coordinates: MapChartPosition[][][]
    }
  | {
      type: 'GeometryCollection'
      geometries: MapChartGeometry[]
    }

export type MapChartFeature = {
  type: 'Feature'
  id?: string | number
  properties?: Record<string, unknown>
  geometry: MapChartGeometry
}

export type MapChartLocationDatum = {
  id: string
  name: string
  value: number
  featureId?: string
  isoCode?: string
  color?: string
  flag?: string
}

export type MapChartFeatureProperties = Record<string, unknown> & {
  __mapActive: boolean
  __mapFill: string
  __mapStroke: string
  __mapName: string
  __mapValue: number | undefined
  __mapFormattedValue: string
  __mapTextFill: string
}

export type MapChartModelFeature = MapChartFeature & {
  properties: MapChartFeatureProperties
}

export type MapChartModelColors = {
  baseFill: string
  baseStroke: string
  activeStroke: string
  activeTextFill: string
  mutedText: string
}

export type MapChartLocationColorResolverInput = {
  location: MapChartLocationDatum
  index: number
}

export type MapChartLocationColorResolver = (input: MapChartLocationColorResolverInput) => string

export type CreateMapChartModelOptions = {
  features: readonly MapChartFeature[]
  locations: readonly MapChartLocationDatum[]
  colors: MapChartModelColors
  valueFormatter: (value: number) => string
  resolveLocationColor: MapChartLocationColorResolver
}

type EnrichedMapChartLocation = MapChartLocationDatum & { color: string }

function normalizeKey(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

export function getMapChartFeatureId(feature: MapChartFeature) {
  return (
    feature.properties?.id ??
    feature.properties?.isoCode ??
    feature.properties?.iso ??
    feature.id ??
    feature.properties?.name
  )
}

export function getMapChartFeatureName(feature: MapChartFeature) {
  return String(
    feature.properties?.name ?? feature.properties?.label ?? getMapChartFeatureId(feature) ?? 'Unknown location',
  )
}

function createLocationLookup({
  locations,
  resolveLocationColor,
}: {
  locations: readonly MapChartLocationDatum[]
  resolveLocationColor: MapChartLocationColorResolver
}) {
  const idLookup = new Map<string, EnrichedMapChartLocation>()
  const nameLookup = new Map<string, EnrichedMapChartLocation>()

  for (const [index, location] of locations.entries()) {
    const enriched = { ...location, color: resolveLocationColor({ location, index }) }
    for (const key of [location.id, location.featureId, location.isoCode].filter(Boolean)) {
      const normalizedKey = normalizeKey(key)
      // Preserve the first owner of an alias so duplicate names/IDs do not silently remap earlier locations.
      if (!idLookup.has(normalizedKey)) {
        idLookup.set(normalizedKey, enriched)
      }
    }

    const normalizedName = normalizeKey(location.name)
    if (normalizedName && !nameLookup.has(normalizedName)) {
      nameLookup.set(normalizedName, enriched)
    }
  }

  return { idLookup, nameLookup }
}

export function createMapChartModel({
  features,
  locations,
  colors,
  valueFormatter,
  resolveLocationColor,
}: CreateMapChartModelOptions) {
  const { idLookup, nameLookup } = createLocationLookup({ locations, resolveLocationColor })
  const modelFeatures = features.map((feature): MapChartModelFeature => {
    const featureId = getMapChartFeatureId(feature)
    const featureName = getMapChartFeatureName(feature)
    const location = idLookup.get(normalizeKey(featureId)) ?? nameLookup.get(normalizeKey(featureName))
    const value = location?.value
    const fill = location?.color ?? colors.baseFill

    return {
      ...feature,
      properties: {
        ...feature.properties,
        __mapActive: Boolean(location),
        __mapFill: fill,
        __mapStroke: location ? colors.activeStroke : 'transparent',
        __mapName: location?.name ?? featureName,
        __mapValue: value,
        __mapFormattedValue: typeof value === 'number' ? valueFormatter(value) : 'No data',
        __mapTextFill: location ? colors.activeTextFill : colors.mutedText,
      },
    }
  })

  return {
    features: modelFeatures,
  }
}
