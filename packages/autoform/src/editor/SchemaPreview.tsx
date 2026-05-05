'use client'

import type { JsonValue } from '@incmix/ui/editor/autoform'
import * as React from 'react'
import { AutoFormWorkbench } from './AutoFormWorkbench'
import type { SchemaPreviewProps } from './schema-preview.props'

export type { SchemaPreviewProps } from './schema-preview.props'

export function SchemaPreview({ jsonSchema, uiSchema, externalSchemas }: SchemaPreviewProps) {
  const [currentJsonSchema, setCurrentJsonSchema] = React.useState<JsonValue>(jsonSchema)
  const [currentUiSchema, setCurrentUiSchema] = React.useState<JsonValue>(uiSchema)

  React.useEffect(() => {
    setCurrentJsonSchema(jsonSchema)
  }, [jsonSchema])

  React.useEffect(() => {
    setCurrentUiSchema(uiSchema)
  }, [uiSchema])

  return (
    <AutoFormWorkbench
      jsonSchema={currentJsonSchema}
      uiSchema={currentUiSchema}
      externalSchemas={externalSchemas}
      onJsonSchemaChange={setCurrentJsonSchema}
      onUiSchemaChange={setCurrentUiSchema}
    />
  )
}
