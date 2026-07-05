import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// revalidatePath throws an invariant when called outside a Next.js request
// (e.g. from the seed script or a payload CLI run) — safe to ignore there.
const isOutsideRequestError = (err: unknown) =>
  err instanceof Error && err.message.includes('static generation store missing')

/**
 * On-demand ISR: revalidate the affected frontend paths whenever content
 * changes in the admin. Paths may contain `[slug]`, which is replaced with
 * the document's slug.
 */
export const revalidatePaths =
  (...paths: string[]): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req }) => {
    try {
      const { revalidatePath } = await import('next/cache')
      for (const path of paths) {
        if (path.includes('[slug]')) {
          if (doc?.slug) revalidatePath(path.replace('[slug]', doc.slug))
          if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
            revalidatePath(path.replace('[slug]', previousDoc.slug))
          }
        } else {
          revalidatePath(path)
        }
      }
    } catch (err) {
      if (!isOutsideRequestError(err)) {
        req.payload.logger.error({ err, msg: 'Failed to revalidate paths' })
      }
    }
    return doc
  }

export const revalidatePathsAfterDelete =
  (...paths: string[]): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    try {
      const { revalidatePath } = await import('next/cache')
      for (const path of paths) {
        if (path.includes('[slug]')) {
          if (doc?.slug) revalidatePath(path.replace('[slug]', doc.slug))
        } else {
          revalidatePath(path)
        }
      }
    } catch (err) {
      if (!isOutsideRequestError(err)) {
        req.payload.logger.error({ err, msg: 'Failed to revalidate paths' })
      }
    }
    return doc
  }

export const revalidateGlobalPaths =
  (...paths: string[]): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    try {
      const { revalidatePath } = await import('next/cache')
      for (const path of paths) {
        // Globals (nav, footer, contact info) affect every page.
        revalidatePath(path, 'layout')
      }
    } catch (err) {
      if (!isOutsideRequestError(err)) {
        req.payload.logger.error({ err, msg: 'Failed to revalidate paths' })
      }
    }
    return doc
  }
