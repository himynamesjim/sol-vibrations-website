import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrMentor, publishedOrStaff } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidatePaths, revalidatePathsAfterDelete } from '@/hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate', '_status'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrStaff,
    create: isAdminOrMentor,
    update: isAdminOrMentor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidatePaths('/news', '/news/[slug]')],
    afterDelete: [revalidatePathsAfterDelete('/news', '/news/[slug]')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary shown in post listings and search results.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText', required: true },
  ],
}
