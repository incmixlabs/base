import * as React from 'react'

function useLazyRef<T>(fn: () => T): React.RefObject<T> {
  const [initial] = React.useState(fn)
  const ref = React.useRef(initial)
  return ref
}

export { useLazyRef }
