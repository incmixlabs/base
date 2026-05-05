import { describe, expect, it } from 'vitest'
import { getCatalogEntriesForJsx, getJsxComponentTagNames, loadCatalogRuntimeScopeForJsx } from './runtime-scope'

describe('live editor runtime scope', () => {
  it('extracts component tag names from JSX snippets', () => {
    expect(
      getJsxComponentTagNames(`
        <Flex gap="3">
          <Button>Save</Button>
          <Tabs.Root>
            <Tabs.List />
          </Tabs.Root>
          <div data-example="<Unknown />" />
          {/* <Ignored /> */}
        </Flex>
      `),
    ).toEqual(['Flex', 'Button', 'Tabs'])
  })

  it('handles empty source gracefully', () => {
    expect(getJsxComponentTagNames('')).toEqual([])
  })

  it('ignores JSX-like patterns inside template literals', () => {
    expect(getJsxComponentTagNames('const msg = `Hello <Fake />`')).toEqual([])
  })

  it('ignores JSX-like patterns inside regular strings', () => {
    expect(getJsxComponentTagNames('const html = "<Fake />"')).toEqual([])
  })

  it('resolves component tags against catalog entries', () => {
    expect(
      getCatalogEntriesForJsx('<Container><Button><Text>Save</Text></Button></Container>').map(entry => entry.slug),
    ).toEqual(['container', 'button', 'text'])
  })

  it('allows caller-provided scope bindings without catalog resolution', () => {
    expect(getCatalogEntriesForJsx('<CustomPreview />', { CustomPreview: () => null })).toEqual([])
  })

  it('rejects unknown component tags with a readable error', () => {
    expect(() => getCatalogEntriesForJsx('<UnknownPreview />')).toThrow(
      'Unknown JSX component "UnknownPreview". Add it to the UI catalog before previewing it.',
    )
  })

  it('loads only catalog runtime bindings needed by the source', async () => {
    const scope = await loadCatalogRuntimeScopeForJsx('<Container><Button>Save</Button></Container>')

    expect(scope.Container).toBeDefined()
    expect(scope.Button).toBeDefined()
    expect(scope.Card).toBeUndefined()
  })
})
