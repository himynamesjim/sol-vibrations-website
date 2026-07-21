import { cache } from 'react'

export type PlaylistVideo = {
  /** YouTube video ID */
  id: string
  title: string
  /** Public watch URL */
  url: string
  /** Thumbnail image URL (16:9) */
  thumbnail: string
  /** ISO 8601 publish date */
  publishedAt: string
}

// The Sol Vibrations YouTube playlist. Override with YOUTUBE_PLAYLIST_ID.
const DEFAULT_PLAYLIST_ID = 'PLQEooRic_f9s'

function playlistId() {
  return process.env.YOUTUBE_PLAYLIST_ID || DEFAULT_PLAYLIST_ID
}

// A clean 16:9 thumbnail derived straight from the video ID — no API needed.
function thumbnailFor(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

function decodeEntities(input: string) {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

/**
 * Fetch playlist videos via the YouTube RSS feed. No API key required, but the
 * feed only exposes the ~15 most recent videos. Returned newest-first.
 */
async function fetchViaRss(): Promise<PlaylistVideo[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId()}`,
    { next: { revalidate: 3600 } },
  )
  if (!res.ok) throw new Error(`YouTube RSS feed responded ${res.status}`)

  const xml = await res.text()
  const entries = xml.split('<entry>').slice(1)

  return entries.flatMap((entry): PlaylistVideo[] => {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    if (!id) return []
    const title = entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? ''
    return [
      {
        id,
        title: decodeEntities(title),
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: thumbnailFor(id),
        publishedAt,
      },
    ]
  })
}

type ApiItem = {
  snippet?: {
    title?: string
    resourceId?: { videoId?: string }
  }
  contentDetails?: { videoPublishedAt?: string }
}

/**
 * Fetch the entire playlist via the YouTube Data API v3. Requires YOUTUBE_API_KEY.
 * Pages through every video so the full playlist is returned.
 */
async function fetchViaApi(apiKey: string): Promise<PlaylistVideo[]> {
  const videos: PlaylistVideo[] = []
  let pageToken = ''

  do {
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
    url.searchParams.set('part', 'snippet,contentDetails')
    url.searchParams.set('maxResults', '50')
    url.searchParams.set('playlistId', playlistId())
    url.searchParams.set('key', apiKey)
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`YouTube Data API responded ${res.status}`)
    const data: { items?: ApiItem[]; nextPageToken?: string } = await res.json()

    for (const item of data.items ?? []) {
      const id = item.snippet?.resourceId?.videoId
      const title = item.snippet?.title
      // Skip private/deleted videos, which have no publish date.
      if (!id || !item.contentDetails?.videoPublishedAt) continue
      videos.push({
        id,
        title: title ?? '',
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: thumbnailFor(id),
        publishedAt: item.contentDetails.videoPublishedAt,
      })
    }

    pageToken = data.nextPageToken ?? ''
  } while (pageToken)

  return videos
}

/**
 * Returns the playlist's videos sorted newest to oldest. Uses the Data API when
 * YOUTUBE_API_KEY is set (full playlist), otherwise the public RSS feed (latest
 * ~15). Returns an empty array on any failure so the page still renders.
 */
export const getPlaylistVideos = cache(async (): Promise<PlaylistVideo[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY
  try {
    const videos = apiKey ? await fetchViaApi(apiKey) : await fetchViaRss()
    return videos.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  } catch (error) {
    console.error('Failed to load YouTube playlist videos:', error)
    return []
  }
})
