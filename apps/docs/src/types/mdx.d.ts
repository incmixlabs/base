declare module '*.mdx' {
  import type { ComponentType } from 'react'

  type MDXProps = {
    components?: Record<string, ComponentType<any>>
  }

  const MDXComponent: ComponentType<MDXProps>
  export default MDXComponent
}
