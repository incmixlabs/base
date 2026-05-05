export type Scope = Record<string, unknown> & {
  import?: Record<string, unknown>
}

export type RunnerOptions = {
  code: string
  scope?: Scope
  componentProps?: Record<string, unknown>
}
