'use client'

import { Box } from '@/elements'
import { Code, Text } from '@/typography'
import { type DocsPropDefinitionKey, docsPropDefinitions, type PropDef } from '../prop-defs'

type ThemesPropsTableProps = {
  defs: DocsPropDefinitionKey | PropDef[]
}

export function ThemesPropsTable({ defs }: ThemesPropsTableProps) {
  const resolvedDefs = Array.isArray(defs) ? defs : docsPropDefinitions[defs]
  const data = Array.isArray(resolvedDefs) ? resolvedDefs : Object.values(resolvedDefs ?? {}).flat()

  return (
    <Box my="5" className="docs-props-table">
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: PropDef) => (
            <tr key={item.name} className="docs-props-row">
              <th>
                <Box>
                  <Text size="sm" weight="medium" color="info">
                    {item.name}
                    {item.required ? '*' : null}
                  </Text>
                  {item.description ? (
                    <Text size="xs" className="mt-1 text-muted-foreground">
                      {item.description}
                    </Text>
                  ) : null}
                </Box>
              </th>
              <td>
                <Code size="sm" className="docs-props-chip docs-props-chip-type">
                  {item.typeSimple}
                </Code>
              </td>
              <td>
                {item.default !== undefined ? (
                  <Code size="sm" className="docs-props-chip docs-props-chip-default">
                    {String(item.default)}
                  </Code>
                ) : (
                  <Text size="sm" className="docs-props-empty">
                    —
                  </Text>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}
