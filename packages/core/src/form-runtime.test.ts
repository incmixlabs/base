import { describe, expect, it } from 'vitest'
import {
  clearAutoFormServerError,
  clearAutoFormServerErrors,
  createAutoFormRuntimeState,
  createAutoFormStringOptions,
  createAutoFormValueMappingFromModel,
  getAutoFormStringArrayValue,
  getAutoFormStringValue,
  mapAutoFormDefinitionValues,
  mapAutoFormValuesToTarget,
  resetAutoFormState,
  setAutoFormErrors,
  setAutoFormFormErrors,
  setAutoFormServerErrors,
  setAutoFormValue,
  touchAutoFormField,
} from './form-runtime'
import { normalizeJsonSchemaWithUiSchema } from './ui-schema-normalization'

describe('form-runtime', () => {
  it('tracks dirty and touched state per path', () => {
    const initial = createAutoFormRuntimeState({
      traveler: {
        email: 'ada@example.com',
      },
    })

    const touched = touchAutoFormField(initial, 'traveler.email')
    const updated = setAutoFormValue(touched, 'traveler.email', 'grace@example.com')

    expect(updated.touched['traveler.email']).toBe(true)
    expect(updated.dirtyFields['traveler.email']).toBe(true)
    expect(updated.isDirty).toBe(true)
  })

  it('updates validity from field errors and resets cleanly', () => {
    const initial = createAutoFormRuntimeState({ traveler: { email: '' } })
    const withErrors = setAutoFormErrors(initial, {
      'traveler.email': ['Must be a valid email'],
    })

    expect(withErrors.isValid).toBe(false)

    const reset = resetAutoFormState(withErrors, { traveler: { email: 'ada@example.com' } })

    expect(reset.errors).toEqual({})
    expect(reset.isValid).toBe(true)
    expect(reset.isDirty).toBe(false)
    expect(reset.values).toEqual({ traveler: { email: 'ada@example.com' } })
  })

  it('merges validation and server field errors and tracks form-level errors', () => {
    const initial = createAutoFormRuntimeState({ traveler: { email: '' } })
    const withValidationErrors = setAutoFormErrors(initial, {
      'traveler.email': ['Must be a valid email'],
    })
    const withServerErrors = setAutoFormServerErrors(
      withValidationErrors,
      {
        'traveler.email': ['Email already exists'],
      },
      ['Unable to create trip'],
    )

    expect(withServerErrors.errors['traveler.email']).toEqual(['Must be a valid email', 'Email already exists'])
    expect(withServerErrors.validationErrors['traveler.email']).toEqual(['Must be a valid email'])
    expect(withServerErrors.serverErrors['traveler.email']).toEqual(['Email already exists'])
    expect(withServerErrors.formErrors).toEqual(['Unable to create trip'])
    expect(withServerErrors.isValid).toBe(false)
  })

  it('clears server errors by path without removing validation errors', () => {
    const initial = createAutoFormRuntimeState({ traveler: { email: '' } })
    const withValidationErrors = setAutoFormErrors(initial, {
      'traveler.email': ['Must be a valid email'],
    })
    const withServerErrors = setAutoFormServerErrors(withValidationErrors, {
      'traveler.email': ['Email already exists'],
    })

    const cleared = clearAutoFormServerError(withServerErrors, 'traveler.email')

    expect(cleared.errors['traveler.email']).toEqual(['Must be a valid email'])
    expect(cleared.serverErrors).toEqual({})
    expect(cleared.validationErrors['traveler.email']).toEqual(['Must be a valid email'])
  })

  it('normalizes validation and server error paths before merging and clearing', () => {
    const initial = createAutoFormRuntimeState({
      dependents: [{ name: '' }],
    })
    const withValidationErrors = setAutoFormErrors(initial, {
      'dependents[0].name': ['Name is required'],
    })
    const withServerErrors = setAutoFormServerErrors(withValidationErrors, {
      'dependents.0.name': ['Name already exists'],
    })

    expect(withServerErrors.errors['dependents.0.name']).toEqual(['Name is required', 'Name already exists'])
    expect(withServerErrors.validationErrors['dependents.0.name']).toEqual(['Name is required'])
    expect(withServerErrors.serverErrors['dependents.0.name']).toEqual(['Name already exists'])

    const cleared = clearAutoFormServerError(withServerErrors, 'dependents[0].name')

    expect(cleared.serverErrors).toEqual({})
    expect(cleared.errors['dependents.0.name']).toEqual(['Name is required'])
  })

  it('clears all server errors and form-level errors together', () => {
    const initial = createAutoFormRuntimeState({ traveler: { email: 'ada@example.com' } })
    const withServerErrors = setAutoFormServerErrors(
      initial,
      {
        'traveler.email': ['Email already exists'],
      },
      ['Unable to create trip'],
    )

    const cleared = clearAutoFormServerErrors(withServerErrors)

    expect(cleared.errors).toEqual({})
    expect(cleared.serverErrors).toEqual({})
    expect(cleared.formErrors).toEqual([])
    expect(cleared.isValid).toBe(true)
  })

  it('updates validity from form-level errors even when field errors are empty', () => {
    const initial = createAutoFormRuntimeState({ traveler: { email: 'ada@example.com' } })
    const withFormErrors = setAutoFormFormErrors(initial, ['Request failed'])

    expect(withFormErrors.formErrors).toEqual(['Request failed'])
    expect(withFormErrors.isValid).toBe(false)
  })

  it('sanitizes empty validation error arrays when clearing server errors', () => {
    const initial = createAutoFormRuntimeState({ traveler: { email: 'ada@example.com' } })
    const withValidationErrors = setAutoFormErrors(initial, {
      'traveler.email': [],
    })
    const withServerErrors = setAutoFormServerErrors(withValidationErrors, {
      'traveler.email': ['Email already exists'],
    })

    const cleared = clearAutoFormServerErrors(withServerErrors)

    expect(cleared.errors).toEqual({})
    expect(cleared.validationErrors).toEqual({})
    expect(cleared.isValid).toBe(true)
  })

  it('initializes dirty state from differing controlled values', () => {
    const runtime = createAutoFormRuntimeState(
      { traveler: { email: 'ada@example.com' } },
      { traveler: { email: 'grace@example.com' } },
    )

    expect(runtime.isDirty).toBe(true)
    expect(runtime.dirtyFields['traveler.email']).toBe(true)
  })

  it('recomputes dirty fields for object-path writes', () => {
    const initial = createAutoFormRuntimeState({
      traveler: {
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
      },
    })

    const dirty = setAutoFormValue(initial, 'traveler', {
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
    })

    expect(dirty.dirtyFields['traveler.fullName']).toBe(true)
    expect(dirty.dirtyFields['traveler.email']).toBe(true)

    const reset = setAutoFormValue(dirty, 'traveler', {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
    })

    expect(reset.isDirty).toBe(false)
    expect(reset.dirtyFields).toEqual({})
  })

  it('reads and writes indexed array paths', () => {
    const initial = createAutoFormRuntimeState({
      dependents: [
        { name: 'Ada', relationship: 'spouse' },
        { name: 'Byron', relationship: 'child' },
      ],
    })

    const updated = setAutoFormValue(initial, 'dependents.1.name', 'Augusta')

    expect(updated.values).toEqual({
      dependents: [
        { name: 'Ada', relationship: 'spouse' },
        { name: 'Augusta', relationship: 'child' },
      ],
    })
    expect(updated.dirtyFields['dependents.1.name']).toBe(true)
  })

  it('supports bracketed array paths', () => {
    const initial = createAutoFormRuntimeState({
      tags: ['visa'],
    })

    const updated = setAutoFormValue(initial, 'tags[1]', 'passport')

    expect(updated.values).toEqual({
      tags: ['visa', 'passport'],
    })
    expect(updated.dirtyFields['tags.1']).toBe(true)
  })

  it('coerces string and string-array runtime values by path', () => {
    const values = {
      title: 'Support Badge',
      tags: ['support', 42, 'badge'],
      nested: {
        summary: 'Reusable status badge.',
      },
    }

    expect(getAutoFormStringValue(values, 'title')).toBe('Support Badge')
    expect(getAutoFormStringValue(values, 'nested.summary')).toBe('Reusable status badge.')
    expect(getAutoFormStringValue(values, 'missing')).toBe('')
    expect(getAutoFormStringArrayValue(values, 'tags')).toEqual(['support', 'badge'])
    expect(getAutoFormStringArrayValue(values, 'title')).toEqual([])
  })

  it('creates deduplicated string options from strings and option objects', () => {
    expect(
      createAutoFormStringOptions(
        [
          { value: 'local', label: 'Local' },
          { value: 'layout', label: 'Layout' },
        ],
        ['local', 'form'],
        [{ value: 'data-display', description: 'Tables and summaries' }],
      ),
    ).toEqual([
      { value: 'local', label: 'Local' },
      { value: 'layout', label: 'Layout' },
      { value: 'form', label: 'form' },
      { value: 'data-display', label: 'data-display', description: 'Tables and summaries' },
    ])
  })

  it('maps runtime values to a target object with coercions and field transforms', () => {
    const current = {
      title: 'Old title',
      slug: 'old-title',
      tags: '',
      summary: '',
    }

    const mapped = mapAutoFormValuesToTarget(
      {
        title: 'New title',
        slug: 'new-title',
        tags: ['design', 'system'],
        category: 'Design systems',
      },
      current,
      {
        title: {
          path: 'title',
          coerce: 'string',
        },
        slug: 'slug',
        tags: {
          path: 'tags',
          coerce: 'stringArray',
          joinWith: ', ',
        },
        summary: {
          path: 'category',
          coerce: 'string',
          transform: (value, context) => `${value} for ${context.current.slug}`,
        },
      },
    )

    expect(mapped).toEqual({
      title: 'New title',
      slug: 'new-title',
      tags: 'design, system',
      summary: 'Design systems for old-title',
    })
  })

  it('maps runtime values through an AutoForm definition value mapping', () => {
    const current = {
      title: 'Old title',
      tags: '',
    }

    const mapped = mapAutoFormDefinitionValues(
      {
        valueMapping: {
          title: {
            path: 'title',
            coerce: 'string',
          },
          tags: {
            path: 'tags',
            coerce: 'stringArray',
            joinWith: ', ',
          },
        },
      },
      {
        title: 'New title',
        tags: ['schema', 'mapping'],
      },
      current,
    )

    expect(mapped).toEqual({
      title: 'New title',
      tags: 'schema, mapping',
    })
  })

  it('creates value mappings from normalized schema hints', () => {
    const model = normalizeJsonSchemaWithUiSchema({
      type: 'object',
      properties: {
        title: {
          type: 'string',
          '$autoform:valueMapping': {
            coerce: 'string',
          },
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          '$autoform:valueMapping': {
            target: 'tagList',
            coerce: 'stringArray',
            joinWith: ', ',
          },
        },
      },
    })

    const mapped = mapAutoFormValuesToTarget(
      {
        title: 'Mapped title',
        tags: ['schema', 'hint'],
      },
      {
        title: '',
        tagList: '',
      },
      createAutoFormValueMappingFromModel(model),
    )

    expect(mapped).toEqual({
      title: 'Mapped title',
      tagList: 'schema, hint',
    })
  })

  it('writes model-derived mappings to nested target paths', () => {
    const model = normalizeJsonSchemaWithUiSchema({
      type: 'object',
      properties: {
        profile: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              '$autoform:valueMapping': {
                coerce: 'string',
              },
            },
          },
        },
      },
    })

    const mapped = mapAutoFormValuesToTarget(
      {
        profile: {
          name: 'Ada Lovelace',
        },
      },
      {
        profile: {
          name: '',
        },
      },
      createAutoFormValueMappingFromModel(model),
    )

    expect(mapped).toEqual({
      profile: {
        name: 'Ada Lovelace',
      },
    })
    expect(Object.hasOwn(mapped, 'profile.name')).toBe(false)
  })
})
