import { feature } from 'topojson-client'
import countries110m from 'world-atlas/countries-110m.json'
import type { MapChartFeature, MapChartLocationDatum } from './MapChart'

type WorldAtlasTopology = Parameters<typeof feature>[0] & {
  objects: {
    countries: Parameters<typeof feature>[1]
  }
}

const countriesTopology = countries110m as unknown as WorldAtlasTopology
const countriesFeatureCollection = feature(countriesTopology, countriesTopology.objects.countries) as unknown as {
  features: MapChartFeature[]
}

export const sampleWorldMapFeatures = countriesFeatureCollection.features.filter(
  country => country.properties?.name !== 'Antarctica',
)

export const sampleSalesLocations: MapChartLocationDatum[] = [
  { id: 'australia', name: 'Australia', value: 17159, color: 'chart2', flag: 'AU' },
  { id: 'canada', name: 'Canada', value: 15854, color: 'chart3', flag: 'CA' },
  { id: 'brazil', name: 'Brazil', value: 9573, color: 'chart1', flag: 'BR' },
  { id: 'greenland', name: 'Greenland', value: 2362, color: 'chart5', flag: 'GL' },
  { id: 'sweden', name: 'Sweden', value: 820, color: 'chart4' },
  { id: 'norway', name: 'Norway', value: 70, color: 'chart4' },
  { id: 'kazakhstan', name: 'Kazakhstan', value: 60, color: 'chart1' },
  { id: 'mongolia', name: 'Mongolia', value: 55, color: 'chart3' },
  { id: 'afghanistan', name: 'Afghanistan', value: 50, color: 'chart3' },
  { id: 'japan', name: 'Japan', value: 45, color: 'chart5' },
  { id: 'mexico', name: 'Mexico', value: 40, color: 'chart1' },
  { id: 'cuba', name: 'Cuba', value: 36, color: 'chart2' },
  { id: 'peru', name: 'Peru', value: 32, color: 'chart2' },
  { id: 'indonesia', name: 'Indonesia', value: 28, color: 'chart1' },
  { id: 'papua-new-guinea', name: 'Papua New Guinea', value: 24, color: 'chart1' },
  { id: 'morocco', name: 'Morocco', value: 22, color: 'chart3' },
  { id: 'mauritania', name: 'Mauritania', value: 20, color: 'chart1' },
  { id: 'mali', name: 'Mali', value: 18, color: 'chart1' },
  { id: 'senegal', name: 'Senegal', value: 16, color: 'chart3' },
  { id: 'niger', name: 'Niger', value: 37, color: 'chart1' },
]
