import * as React from 'react'

export const ChartPaletteSignatureContext = React.createContext<string | undefined>(undefined)

export function useChartPaletteSignature() {
  return React.useContext(ChartPaletteSignatureContext)
}
