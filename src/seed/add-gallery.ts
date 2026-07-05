import config from '@payload-config'
import { getPayload } from 'payload'

import { seedGallery } from './gallery'

// One-off: add the lesson photos to an existing environment's gallery.
async function run() {
  const payload = await getPayload({ config })
  const existing = await payload.count({ collection: 'gallery-items' })
  if (existing.totalDocs > 0) {
    payload.logger.info(`Gallery already has ${existing.totalDocs} items — aborting to avoid duplicates.`)
    process.exit(0)
  }
  await seedGallery(payload)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
