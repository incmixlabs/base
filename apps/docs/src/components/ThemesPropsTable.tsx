'use client'

import { Box } from '@bwalkt/ui/elements'
import { Table } from '@bwalkt/ui/table'
import { Code, Text } from '@bwalkt/ui/typography'
import type { PropDef } from '../lib/props'
import { definitions } from '../lib/props'

export function ThemesPropsTable({ defs }: { defs: keyof typeof definitions }) {
  const data = (definitions[defs] ?? []) as PropDef[]

  return (
    <Box my="5" className="docs-props-table">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Prop</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Default</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(item => (
            <Table.Row key={item.name} className="docs-props-row">
              <Table.RowHeaderCell>
                <Text size="sm" weight="medium" color="info">
                  {item.name}
                  {item.required ? '*' : null}
                </Text>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Code size="sm" className="docs-props-chip docs-props-chip-type">
                  {item.typeSimple}
                </Code>
              </Table.Cell>
              <Table.Cell>
                {item.default !== undefined ? (
                  <Code size="sm" className="docs-props-chip docs-props-chip-default">
                    {String(item.default)}
                  </Code>
                ) : (
                  <Text size="sm" className="docs-props-empty">
                    —
                  </Text>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
