import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrMentor } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidatePaths, revalidatePathsAfterDelete } from '@/hooks/revalidate'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location', 'isPublic'],
    group: 'Content',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'mentor') return true
      return { isPublic: { equals: true } }
    },
    create: isAdminOrMentor,
    update: isAdminOrMentor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidatePaths('/events', '/events/[slug]', '/')],
    afterDelete: [revalidatePathsAfterDelete('/events', '/events/[slug]', '/')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
        description: 'Optional end time.',
      },
    },
    { name: 'location', type: 'text', required: true },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide from the public site (internal events).',
      },
    },
  ],
}
