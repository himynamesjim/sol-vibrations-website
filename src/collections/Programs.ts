import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidatePaths, revalidatePathsAfterDelete } from '@/hooks/revalidate'

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'ageRange', 'active', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidatePaths('/programs', '/', '/enroll')],
    afterDelete: [revalidatePathsAfterDelete('/programs', '/', '/enroll')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'Short description shown on program cards.' },
    },
    { name: 'body', type: 'richText' },
    {
      name: 'ageRange',
      type: 'text',
      admin: { description: 'e.g. “Ages 7–17”' },
    },
    {
      name: 'schedule',
      type: 'text',
      admin: { description: 'e.g. “Saturdays, 10am–12pm”' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Inactive programs are hidden from the site and the enrollment form.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
