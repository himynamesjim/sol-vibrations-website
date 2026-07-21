'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { PlaylistVideo } from '@/utilities/youtube'

export function VideoGallery({ videos }: { videos: PlaylistVideo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setOpenIndex(null)
    // Return focus to the thumbnail that opened the player.
    triggerRef.current?.focus()
  }, [])

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((i) => (i === null ? i : (i + delta + videos.length) % videos.length))
    },
    [videos.length],
  )

  // Keyboard controls + scroll lock while the player is open.
  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.documentElement.style.overflow = previousOverflow
    }
  }, [openIndex, close, step])

  const current = openIndex !== null ? videos[openIndex] : null

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <li key={video.id}>
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget
                setOpenIndex(index)
              }}
              className="card group block w-full overflow-hidden text-left focus-visible:outline-3 focus-visible:outline-sol-violet"
            >
              <span className="relative block aspect-video overflow-hidden bg-sol-deep">
                <Image
                  src={video.thumbnail}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sol-deep/70 text-white transition-colors group-hover:bg-sol-violet">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="block px-5 py-4">
                <span className="line-clamp-2 font-display font-bold text-sol-deep">{video.title}</span>
                <span className="sr-only">Play video</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sol-deep/95 p-4 sm:p-8"
          onClick={(e) => {
            // Click on the backdrop (not the player/controls) closes.
            if (e.target === e.currentTarget) close()
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <span className="sr-only">Close</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => step(-1)}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
          >
            <span className="sr-only">Previous video</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
          >
            <span className="sr-only">Next video</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black">
            <iframe
              key={current.id}
              src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0`}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
          <div className="mt-4 flex items-center gap-4 text-white/85">
            <p className="max-w-2xl text-sm">{current.title}</p>
            <p className="shrink-0 text-xs text-white/50" aria-live="polite">
              {(openIndex ?? 0) + 1} / {videos.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
