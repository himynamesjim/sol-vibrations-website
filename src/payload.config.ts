import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { ContactSubmissions } from './collections/ContactSubmissions'
import { Enrollments } from './collections/Enrollments'
import { Events } from './collections/Events'
import { GalleryItems } from './collections/GalleryItems'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Programs } from './collections/Programs'
import { TeamMembers } from './collections/TeamMembers'
import { Users } from './collections/Users'
import { DonateSettings } from './globals/DonateSettings'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Uploads live in cloud storage so they survive serverless deploys:
// Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production), or any
// S3-compatible bucket via the S3_* vars. Locally, with neither configured,
// files fall back to the ./media directory — never rely on that in production.
// TODO: for lesson videos at scale, replace direct file playback with a
// streaming service (Mux / Cloudflare Stream).
const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN)
const s3Configured = Boolean(process.env.S3_BUCKET)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Sol Vibrations',
    },
  },
  collections: [
    Pages,
    Programs,
    Events,
    Posts,
    GalleryItems,
    TeamMembers,
    Media,
    Enrollments,
    ContactSubmissions,
    Users,
  ],
  globals: [SiteSettings, DonateSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    ...(blobConfigured
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
    ...(!blobConfigured && s3Configured
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.S3_BUCKET || '',
            config: {
              endpoint: process.env.S3_ENDPOINT || undefined,
              region: process.env.S3_REGION || 'auto',
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
            },
          }),
        ]
      : []),
  ],
})
