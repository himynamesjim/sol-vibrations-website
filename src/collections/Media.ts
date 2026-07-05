import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrMentor } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    create: isAdminOrMentor,
    update: isAdminOrMentor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for screen readers. Never include a student’s full name.',
      },
    },
  ],
  upload: {
    // Files are stored in S3-compatible storage via @payloadcms/storage-s3
    // (see payload.config.ts). staticDir is only the local fallback for dev
    // before a bucket is configured.
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 480, height: 360, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1600 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
}
