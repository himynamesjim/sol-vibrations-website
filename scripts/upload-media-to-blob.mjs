/**
 * One-time migration: push every file in ./media (created while the site ran
 * on local storage) into the Vercel Blob store, keyed by filename — exactly
 * where @payloadcms/storage-vercel-blob expects them for the existing
 * media rows in the production database.
 *
 * Usage: BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... node scripts/upload-media-to-blob.mjs
 */
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { put } from '@vercel/blob'

const mediaDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../media')

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Set BLOB_READ_WRITE_TOKEN (Vercel dashboard → Storage → your Blob store).')
  process.exit(1)
}

const files = (await readdir(mediaDir)).filter((f) => !f.startsWith('.'))
console.log(`Uploading ${files.length} files from ${mediaDir}…`)

for (const [i, filename] of files.entries()) {
  const data = await readFile(path.join(mediaDir, filename))
  await put(filename, data, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  })
  console.log(`  [${i + 1}/${files.length}] ${filename}`)
}

console.log('Done — all media uploaded to Vercel Blob.')
