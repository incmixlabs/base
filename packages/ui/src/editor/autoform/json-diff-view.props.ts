import type * as React from 'react'
import type { JsonValue } from './json-value.types'

export interface JsonDiffViewProps extends React.HTMLAttributes<HTMLDivElement> {
  before: JsonValue
  after: JsonValue
  name?: string
  hideUnchanged?: boolean
  defaultExpandAll?: boolean
}
