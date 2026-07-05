import type { Field, FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return format(value)
    const fallback = data?.[fallbackField]
    if (typeof fallback === 'string' && fallback.length > 0) return format(fallback)
    return value
  }

export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL-friendly identifier. Leave blank to generate from the title.',
  },
  hooks: {
    beforeValidate: [formatSlug(fallbackField)],
  },
})
