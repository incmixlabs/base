import type { SchemaRefResolutionOptions } from '@incmix/core'
import type { JsonValue } from '@incmix/ui/editor/autoform'

export interface SchemaPreviewProps {
  /**
   * Incoming schema source of truth. A new object reference resets local edits.
   * Pass a stable/memoized value unless you want to replace the current draft.
   */
  jsonSchema: JsonValue
  /**
   * Incoming UI schema source of truth. A new object reference resets local edits.
   * Pass a stable/memoized value unless you want to replace the current draft.
   */
  uiSchema: JsonValue
  externalSchemas?: SchemaRefResolutionOptions['externalSchemas']
}
