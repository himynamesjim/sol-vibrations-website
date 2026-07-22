'use client'

import { useState } from 'react'

import type { PlaylistVideo } from '@/utilities/youtube'

export function YouTubeGallery({ videos }: { videos: PlaylistVideo[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <figure key={video.id} className="overflow-hidden rounded-2xl bg-black/40 shadow-xl">
          {playingId === video.id ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlayingId(video.id)}
              aria-label={`Play video: ${video.title}`}
              className="group relative block aspect-video w-full cursor-pointer"
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
          )}
          <figcaption className="p-4">
            <p className="font-display font-bold leading-snug text-white">{video.title}</p>
            <p className="mt-1 text-sm text-white/60">
              {new Date(video.published).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
