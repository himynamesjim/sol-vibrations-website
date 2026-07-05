import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'
import { revalidatePaths, revalidatePathsAfterDelete } from '@/hooks/revalidate'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team Member', plural: 'Team Members' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidatePaths('/about')],
    afterDelete: [revalidatePathsAfterDelete('/about')],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Role or title, e.g. “Founder & Executive Director”.' },
    },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
