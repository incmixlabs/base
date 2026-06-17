import { v7 as uuidv7 } from 'uuid'

/**
 * Create an Incmix default persisted object ID.
 *
 * This intentionally uses UUID v7 so generated IDs are globally unique and
 * roughly time-sortable. Use separate sequence/suffix helpers for user-visible
 * row numbers, column numbers, labels, or slugs.
 */
export function uuid(): string {
  return uuidv7()
}
