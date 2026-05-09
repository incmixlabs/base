import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'

export const barcodeFormats = [
  'CODE128',
  'CODE128A',
  'CODE128B',
  'CODE128C',
  'EAN13',
  'EAN8',
  'UPC',
  'CODE39',
  'ITF14',
  'ITF',
  'MSI',
  'MSI10',
  'MSI11',
  'MSI1010',
  'MSI1110',
  'pharmacode',
  'codabar',
] as const

export const barcodeTextAlignments = ['left', 'center', 'right'] as const
export const barcodeTextPositions = ['top', 'bottom'] as const

export type BarcodeFormat = (typeof barcodeFormats)[number]
export type BarcodeTextAlign = (typeof barcodeTextAlignments)[number]
export type BarcodeTextPosition = (typeof barcodeTextPositions)[number]

export const barcodePropDefs = {
  value: { type: 'string', required: true },
  format: { type: 'enum', values: barcodeFormats, default: barcodeFormats[0] },
  color: { ...colorPropDef.color, default: 'neutral' },
  foregroundColor: { type: 'string' },
  backgroundColor: { type: 'string', default: '#ffffff' },
  width: { type: 'number', default: 2 },
  height: { type: 'number', default: 100 },
  margin: { type: 'number', default: 10 },
  displayValue: { type: 'boolean', default: true },
  text: { type: 'string' },
  font: { type: 'string', default: 'monospace' },
  fontSize: { type: 'number', default: 20 },
  fontOptions: { type: 'string', default: '' },
  textAlign: { type: 'enum', values: barcodeTextAlignments, default: barcodeTextAlignments[1] },
  textPosition: { type: 'enum', values: barcodeTextPositions, default: barcodeTextPositions[1] },
  textMargin: { type: 'number', default: 2 },
  onError: { type: 'callback', typeFullName: '(error: Error) => void' },
  onGenerated: { type: 'callback', typeFullName: '() => void' },
  className: { type: 'string' },
} satisfies Record<string, PropDef>
