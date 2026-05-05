'use client'

import { StatusPage, StatusPageAction } from './StatusPage'

export function RootNotFound() {
  return (
    <StatusPage
      title="Page not found"
      description="This app only has a small set of prototype routes right now."
      action={
        <StatusPageAction asChild>
          <a href="/">Back to home</a>
        </StatusPageAction>
      }
    />
  )
}
