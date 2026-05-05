import { getLabel, type ParsedField } from '@bwalkt/core'
import type React from 'react'
import { AutoFormField } from './AutoFormField'
import { useAutoForm } from './context'

export const ObjectField: React.FC<{
  field: ParsedField
  path: string[]
}> = ({ field, path }) => {
  const { uiComponents } = useAutoForm()

  return (
    <uiComponents.ObjectWrapper label={getLabel(field)} field={field}>
      {field.schema &&
        Object.entries(field.schema).map(([_key, subField]) => (
          <AutoFormField key={`${path.join('.')}.${subField.key}`} field={subField} path={[...path, subField.key]} />
        ))}
      {!field.schema && <div>No schema defined for object field</div>}
    </uiComponents.ObjectWrapper>
  )
}
