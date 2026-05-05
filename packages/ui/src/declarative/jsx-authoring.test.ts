import { describe, expect, it } from 'vitest'
import { compileDeclarativeJsxToPage, DeclarativeJsxAuthoringError, projectDeclarativePageToJsx } from './jsx-authoring'

describe('jsx authoring bridge', () => {
  it('lowers constrained JSX into a declarative page document', () => {
    const result = compileDeclarativeJsxToPage(`
      <Layout direction="vertical" gap={12}>
        <Template template="Support Controls" />
        <Button label="Review Queue" variant="outline" />
        <Slider defaultValue={[20, 80]} />
      </Layout>
    `)

    expect(result.page.root).toMatchObject({
      type: 'layout',
      props: {
        direction: 'vertical',
        gap: 12,
      },
      children: [
        {
          type: 'template',
          props: {
            template: 'Support Controls',
          },
        },
        {
          type: 'component',
          props: {
            component: 'Button',
            label: 'Review Queue',
            variant: 'outline',
          },
        },
        {
          type: 'component',
          props: {
            component: 'Slider',
            defaultValue: [20, 80],
          },
        },
      ],
    })
    expect(result.projectedJsx).toContain('<Slider defaultValue={[20,80]} />')
  })

  it('maps simple text children to component labels', () => {
    const result = compileDeclarativeJsxToPage(`
      <Layout>
        <Button>Review Queue</Button>
      </Layout>
    `)

    const root = result.page.root
    if (!('type' in root) || !root.children?.[0] || !('type' in root.children[0])) {
      throw new Error('expected normalized authoring node shape')
    }

    expect(root.children[0].props).toMatchObject({
      component: 'Button',
      label: 'Review Queue',
    })
  })

  it('surfaces syntax errors with location when available', () => {
    let caughtError: unknown
    try {
      compileDeclarativeJsxToPage(`
        <Layout>
          <Button />
      `)
    } catch (error) {
      caughtError = error
    }

    expect(caughtError).toBeInstanceOf(DeclarativeJsxAuthoringError)
    expect((caughtError as DeclarativeJsxAuthoringError).location).toBeDefined()
  })

  it('rejects unsupported nested children on catalog-backed components', () => {
    expect(() =>
      compileDeclarativeJsxToPage(`
        <Layout>
          <Button>
            <Badge label="Nested" />
          </Button>
        </Layout>
      `),
    ).toThrow('does not support nested JSX children')
  })

  it('projects declarative pages back into stable JSX', () => {
    const result = compileDeclarativeJsxToPage(`
      <Layout gap={8}>
        <Template template="Stable Projection" />
      </Layout>
    `)

    expect(projectDeclarativePageToJsx(result.page)).toContain('<Template template="Stable Projection" />')
  })
})
