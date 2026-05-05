import { globalStyle } from '@vanilla-extract/css'
import {
  chartDarkContrastTokenMap,
  chartDarkTokenColorMap,
  chartLightContrastTokenMap,
  chartLightTokenColorMap,
} from './chart-token-map'

globalStyle(':root, .af-themes', {
  '--chart-1': chartLightTokenColorMap.chart1,
  '--chart-2': chartLightTokenColorMap.chart2,
  '--chart-3': chartLightTokenColorMap.chart3,
  '--chart-4': chartLightTokenColorMap.chart4,
  '--chart-5': chartLightTokenColorMap.chart5,
  '--chart-1-contrast': chartLightContrastTokenMap.chart1,
  '--chart-2-contrast': chartLightContrastTokenMap.chart2,
  '--chart-3-contrast': chartLightContrastTokenMap.chart3,
  '--chart-4-contrast': chartLightContrastTokenMap.chart4,
  '--chart-5-contrast': chartLightContrastTokenMap.chart5,
} as Record<string, string>)

globalStyle('.dark, .af-themes.dark', {
  '--chart-1': chartDarkTokenColorMap.chart1,
  '--chart-2': chartDarkTokenColorMap.chart2,
  '--chart-3': chartDarkTokenColorMap.chart3,
  '--chart-4': chartDarkTokenColorMap.chart4,
  '--chart-5': chartDarkTokenColorMap.chart5,
  '--chart-1-contrast': chartDarkContrastTokenMap.chart1,
  '--chart-2-contrast': chartDarkContrastTokenMap.chart2,
  '--chart-3-contrast': chartDarkContrastTokenMap.chart3,
  '--chart-4-contrast': chartDarkContrastTokenMap.chart4,
  '--chart-5-contrast': chartDarkContrastTokenMap.chart5,
} as Record<string, string>)
