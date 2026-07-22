const EVENTS_PLAYLIST_ID = 'PLQEooRic_f9s'

export const EVENTS_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${EVENTS_PLAYLIST_ID}`

export type PlaylistVideo = {
  id: string
  title: string
  published: string
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/**
 * Videos in the Events playlist, newest first, via YouTube's public RSS feed
 * (no API key needed). The feed caps at the 15 most recent entries.
 */
export async function getEventsPlaylistVideos(): Promise<PlaylistVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${EVENTS_PLAYLIST_ID}`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const xml = await res.text()

    const videos: PlaylistVideo[] = []
    for (const [, entry] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
      const title = entry.match(/<title>([^<]*)<\/title>/)?.[1]
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1]
      if (id && title && published) {
        videos.push({ id, title: decodeEntities(title), published })
      }
    }

    return videos.sort((a, b) => b.published.localeCompare(a.published))
  } catch {
    return []
  }
}
