import type { CollectionConfig } from 'payload'

import { isAdmin, publishedOrStaff } from '@/access'
import { pageBlocks } from '@/blocks'
import { slugField } from '@/fields/slug'
import { revalidatePaths, revalidatePathsAfterDelete } from '@/hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrStaff,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidatePaths('/[slug]')],
    afterDelete: [revalidatePathsAfterDelete('/[slug]')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'layout',
      type: 'blocks',
      blocks: pageBlocks,
      required: true,
      minRows: 1,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Used for SEO. Aim for under 160 characters.',
      },
    },
  ],
}
