'use client'

import { Box } from '@incmix/ui/elements'
import { Code, Text } from '@incmix/ui/typography'
import type { PropDef } from '../lib/props'
import { definitions } from '../lib/props'

export function ThemesPropsTable({ defs }: { defs: keyof typeof definitions }) {
  const data = (definitions[defs] ?? []) as PropDef[]

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
          {data.map(item => (
            <tr key={item.name} className="docs-props-row">
              <th>
                <Text size="sm" weight="medium" color="info">
                  {item.name}
                  {item.required ? '*' : null}
                </Text>
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
