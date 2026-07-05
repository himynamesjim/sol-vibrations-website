import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrMentor, publishedOrStaff } from '@/access'
import { revalidatePaths, revalidatePathsAfterDelete } from '@/hooks/revalidate'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: { singular: 'Gallery Item', plural: 'Gallery Items' },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['image', 'caption', 'photoReleaseConfirmed', '_status'],
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
    beforeChange: [
      // Child-safety rule: nothing goes public without a confirmed photo release.
      ({ data }) => {
        if (data?._status === 'published' && !data?.photoReleaseConfirmed) {
          throw new Error(
            'A gallery item cannot be published until “Photo release confirmed” is checked.',
          )
        }
        return data
      },
    ],
    afterChange: [revalidatePaths('/gallery')],
    afterDelete: [revalidatePathsAfterDelete('/gallery')],
  },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'IMPORTANT: never include a student’s full name — first name only, or no name at all.',
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: { position: 'sidebar', description: 'Optional: the event this photo is from.' },
    },
    {
      name: 'photoReleaseConfirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Confirm a signed photo release is on file for every identifiable person in this image. Required before publishing.',
      },
    },
  ],
}
