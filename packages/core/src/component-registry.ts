export const COMPONENT_REGISTRY_ENTRY_KIND = 'component-registry-entry' as const
export const COMPONENT_REGISTRY_SCHEMA_VERSION = '1.0.0' as const

export type ComponentRegistryScope = 'public' | 'organization' | 'workspace' | 'private'
export type ComponentRegistryOwnerKind = 'system' | 'organization' | 'workspace' | 'user'
export type ComponentRegistryPersistenceSource = 'code' | 'registry'
export type ComponentRegistryRuntimeKind = 'known-renderer'

export type ComponentRegistryRuntimeBinding = {
  kind: ComponentRegistryRuntimeKind
  rendererId: string
  componentName: string
}

export type ComponentRegistryDiscoveryMetadata = {
  summary?: string
  group?: string
  hierarchy?: string[]
  tags?: string[]
  keywords?: string[]
}

export type ComponentRegistryOwnershipMetadata = {
  scope: ComponentRegistryScope
  ownerKind?: ComponentRegistryOwnerKind
  ownerId?: string
}

export type ComponentRegistryPersistenceSemantics = {
  source: ComponentRegistryPersistenceSource
  mutable: boolean
  scope: 'repository'
  notes?: string
}

export type ComponentRegistryEntry = {
  schemaVersion: typeof COMPONENT_REGISTRY_SCHEMA_VERSION
  kind: typeof COMPONENT_REGISTRY_ENTRY_KIND
  id: string
  slug: string
  title: string
  description?: string
  runtime: ComponentRegistryRuntimeBinding
  discovery: ComponentRegistryDiscoveryMetadata
  ownership: ComponentRegistryOwnershipMetadata
  persistence: ComponentRegistryPersistenceSemantics
  meta?: Record<string, unknown>
}

export type ComponentRegistryValidationResult = {
  entry?: ComponentRegistryEntry
  errors: string[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString)
}

function validateDiscoveryMetadata(
  value: unknown,
  errors: string[],
  path: string,
): value is ComponentRegistryDiscoveryMetadata {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`)
    return false
  }

  if ('summary' in value && value.summary !== undefined && !isNonEmptyString(value.summary)) {
    errors.push(`${path}.summary must be a non-empty string when provided`)
  }
  if ('group' in value && value.group !== undefined && !isNonEmptyString(value.group)) {
    errors.push(`${path}.group must be a non-empty string when provided`)
  }
  if ('hierarchy' in value && value.hierarchy !== undefined && !isStringArray(value.hierarchy)) {
    errors.push(`${path}.hierarchy must be a string array when provided`)
  }
  if ('tags' in value && value.tags !== undefined && !isStringArray(value.tags)) {
    errors.push(`${path}.tags must be a string array when provided`)
  }
  if ('keywords' in value && value.keywords !== undefined && !isStringArray(value.keywords)) {
    errors.push(`${path}.keywords must be a string array when provided`)
  }

  return true
}

function validateOwnershipMetadata(
  value: unknown,
  errors: string[],
  path: string,
): value is ComponentRegistryOwnershipMetadata {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`)
    return false
  }

  const scope = value.scope
  if (scope !== 'public' && scope !== 'organization' && scope !== 'workspace' && scope !== 'private') {
    errors.push(`${path}.scope must be one of public|organization|workspace|private`)
  }

  if (
    'ownerKind' in value &&
    value.ownerKind !== undefined &&
    value.ownerKind !== 'system' &&
    value.ownerKind !== 'organization' &&
    value.ownerKind !== 'workspace' &&
    value.ownerKind !== 'user'
  ) {
    errors.push(`${path}.ownerKind must be one of system|organization|workspace|user when provided`)
  }

  if ('ownerId' in value && value.ownerId !== undefined && !isNonEmptyString(value.ownerId)) {
    errors.push(`${path}.ownerId must be a non-empty string when provided`)
  }

  return true
}

function validatePersistenceSemantics(
  value: unknown,
  errors: string[],
  path: string,
): value is ComponentRegistryPersistenceSemantics {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`)
    return false
  }

  if (value.source !== 'code' && value.source !== 'registry') {
    errors.push(`${path}.source must be one of code|registry`)
  }
  if (typeof value.mutable !== 'boolean') {
    errors.push(`${path}.mutable must be a boolean`)
  }
  if (value.scope !== 'repository') {
    errors.push(`${path}.scope must equal repository`)
  }
  if ('notes' in value && value.notes !== undefined && !isNonEmptyString(value.notes)) {
    errors.push(`${path}.notes must be a non-empty string when provided`)
  }

  return true
}

function validateRuntimeBinding(
  value: unknown,
  errors: string[],
  path: string,
): value is ComponentRegistryRuntimeBinding {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`)
    return false
  }

  if (value.kind !== 'known-renderer') {
    errors.push(`${path}.kind must equal known-renderer`)
  }
  if (!isNonEmptyString(value.rendererId)) {
    errors.push(`${path}.rendererId must be a non-empty string`)
  }
  if (!isNonEmptyString(value.componentName)) {
    errors.push(`${path}.componentName must be a non-empty string`)
  }

  return true
}

export function validateComponentRegistryEntry(value: unknown): ComponentRegistryValidationResult {
  const errors: string[] = []

  if (!isRecord(value)) {
    return {
      errors: ['component registry entry must be an object'],
    }
  }

  if (value.schemaVersion !== COMPONENT_REGISTRY_SCHEMA_VERSION) {
    errors.push(`schemaVersion must equal ${COMPONENT_REGISTRY_SCHEMA_VERSION}`)
  }
  if (value.kind !== COMPONENT_REGISTRY_ENTRY_KIND) {
    errors.push(`kind must equal ${COMPONENT_REGISTRY_ENTRY_KIND}`)
  }
  if (!isNonEmptyString(value.id)) {
    errors.push('id must be a non-empty string')
  }
  if (!isNonEmptyString(value.slug)) {
    errors.push('slug must be a non-empty string')
  }
  if (!isNonEmptyString(value.title)) {
    errors.push('title must be a non-empty string')
  }
  if ('description' in value && value.description !== undefined && !isNonEmptyString(value.description)) {
    errors.push('description must be a non-empty string when provided')
  }

  validateRuntimeBinding(value.runtime, errors, 'runtime')
  validateDiscoveryMetadata(value.discovery, errors, 'discovery')
  validateOwnershipMetadata(value.ownership, errors, 'ownership')
  validatePersistenceSemantics(value.persistence, errors, 'persistence')

  if ('meta' in value && value.meta !== undefined && !isRecord(value.meta)) {
    errors.push('meta must be an object when provided')
  }

  return {
    entry: errors.length === 0 ? (value as ComponentRegistryEntry) : undefined,
    errors,
  }
}

export function isComponentRegistryEntry(value: unknown): value is ComponentRegistryEntry {
  return validateComponentRegistryEntry(value).errors.length === 0
}
