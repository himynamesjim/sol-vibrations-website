'use client'

import { useRef, useState } from 'react'

import type { PlaylistVideo } from '@/utilities/youtube'

function formatDate(published: string): string {
  return new Date(published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function YouTubeGallery({ videos }: { videos: PlaylistVideo[] }) {
  const [currentId, setCurrentId] = useState(videos[0]?.id)
  // Only autoplay once the visitor has picked a video themselves.
  const [autoplay, setAutoplay] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)

  if (videos.length === 0) return null

  const current = videos.find((video) => video.id === currentId) ?? videos[0]
  const others = videos.filter((video) => video.id !== current.id)

  const select = (id: string) => {
    setCurrentId(id)
    setAutoplay(true)
    // Bring the player back into view — the thumbnails sit below it.
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div>
      {/* Featured player */}
      <div ref={playerRef} className="scroll-mt-24">
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
          <iframe
            key={current.id}
            src={`https://www.youtube-nocookie.com/embed/${current.id}?rel=0${autoplay ? '&autoplay=1' : ''}`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
        <div className="mt-4">
          <h3 className="font-display text-xl font-bold text-white">{current.title}</h3>
          <p className="mt-1 text-sm text-white/60">{formatDate(current.published)}</p>
        </div>
      </div>

      {others.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-sol-gold">
            More videos
          </h3>
          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((video) => (
              <figure key={video.id} className="overflow-hidden rounded-2xl bg-black/40 shadow-xl">
                <button
                  type="button"
                  onClick={() => select(video.id)}
                  aria-label={`Play video: ${video.title}`}
                  className="group relative block aspect-video w-full cursor-pointer focus-visible:outline-3 focus-visible:outline-sol-gold"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- YouTube already serves optimized thumbnails */}
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sol-gold text-sol-deep shadow-lg transition-transform group-hover:scale-110">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </button>
                <figcaption className="p-4">
                  <p className="font-display font-bold leading-snug text-white">{video.title}</p>
                  <p className="mt-1 text-sm text-white/60">{formatDate(video.published)}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
