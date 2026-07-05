import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings' })
})

export const getDonateSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'donate-settings' })
})

export const getActivePrograms = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'programs',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 50,
  })
  return docs
})

export const getUpcomingEvents = cache(async (limit = 20) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: {
      and: [{ isPublic: { equals: true } }, { date: { greater_than_equal: new Date().toISOString() } }],
    },
    sort: 'date',
    limit,
  })
  return docs
})

export const getPastEvents = cache(async (limit = 20) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: {
      and: [{ isPublic: { equals: true } }, { date: { less_than: new Date().toISOString() } }],
    },
    sort: '-date',
    limit,
  })
  return docs
})

export const getPublishedPosts = cache(async (limit = 20) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    limit,
  })
  return docs
})
