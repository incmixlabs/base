import { controlSizeTokens } from '@/theme/token-maps'
import type { TableSize } from './basic/Table'

export interface TableSizeToken {
  paddingX: string
  paddingY: string
  fontSize: string
  lineHeight: string
  editableMinHeight: string
  estimatedRowHeight: number
}

const BASE_REM_PX = 16

function remToNumber(value: string) {
  return Number.parseFloat(value.replace('rem', ''))
}

function remToPixels(value: string) {
  return Math.round(remToNumber(value) * BASE_REM_PX)
}

function subtractDoubleRem(height: string, paddingY: string) {
  return `${Math.max(0, remToNumber(height) - remToNumber(paddingY) * 2)}rem`
}

function createTableSizeToken(size: TableSize): TableSizeToken {
  const token = controlSizeTokens[size]
  return {
    paddingX: token.paddingX,
    paddingY: token.paddingY,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    editableMinHeight: subtractDoubleRem(token.height, token.paddingY),
    estimatedRowHeight: remToPixels(token.height),
  }
}

export const tableSizeTokens: Record<TableSize, TableSizeToken> = {
  xs: createTableSizeToken('xs'),
  sm: createTableSizeToken('sm'),
  md: createTableSizeToken('md'),
  lg: createTableSizeToken('lg'),
}
