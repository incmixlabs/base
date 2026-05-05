'use client'

import { Box } from '@/elements'
import { Table } from '@/table'
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
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Prop</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Default</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item: PropDef) => (
            <Table.Row key={item.name} className="docs-props-row">
              <Table.RowHeaderCell>
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
