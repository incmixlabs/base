import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'

export const qrCodeLevels = ['L', 'M', 'Q', 'H'] as const
export const qrCodeDownloadFormats = ['png', 'svg'] as const

export type QRCodeLevel = (typeof qrCodeLevels)[number]
export type QRCodeDownloadFormat = (typeof qrCodeDownloadFormats)[number]

export const qrCodePropDefs = {
  value: { type: 'string', required: true },
  width: { type: 'number', default: 200 },
  height: { type: 'number', default: 200 },
  size: { type: 'number' },
  level: { type: 'enum', values: qrCodeLevels, default: qrCodeLevels[1] },
  margin: { type: 'number', default: 1 },
  radius: { ...radiusPropDef.radius, default: 'none' },
  color: { ...colorPropDef.color, default: 'neutral' },
  foregroundColor: { type: 'string' },
  backgroundColor: { type: 'string', default: '#ffffff' },
  onError: { type: 'callback', typeFullName: '(error: Error) => void' },
  onGenerated: { type: 'callback', typeFullName: '() => void' },
  asChild: { type: 'boolean', default: false },
  className: { type: 'string' },
  children: { type: 'ReactNode' },
} satisfies Record<string, PropDef>
