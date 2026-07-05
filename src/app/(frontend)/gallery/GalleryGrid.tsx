'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryPhoto = {
  id: number
  url: string
  width: number
  height: number
  alt: string
  caption?: string | null
}

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setOpenIndex(null)
    // Return focus to the thumbnail that opened the modal.
    triggerRef.current?.focus()
  }, [])

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length))
    },
    [photos.length],
  )

  // Keyboard controls + scroll lock while the modal is open.
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

  const current = openIndex !== null ? photos[openIndex] : null

  return (
    <>
      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
        {photos.map((photo, index) => (
          <li key={photo.id} className="break-inside-avoid">
            <figure className="card overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget
                  setOpenIndex(index)
                }}
                className="block w-full cursor-zoom-in focus-visible:outline-3 focus-visible:outline-sol-violet"
              >
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="w-full"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="sr-only">View larger</span>
              </button>
              {photo.caption && (
                <figcaption className="px-5 py-4 text-sm text-sol-ink/80">{photo.caption}</figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || current.alt}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sol-deep/95 p-4 sm:p-8"
          onClick={(e) => {
            // Click on the backdrop (not the image/controls) closes.
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
            <span className="sr-only">Previous photo</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
          >
            <span className="sr-only">Next photo</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <Image
            src={current.url}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="90vw"
            className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain"
            priority
          />
          <div className="mt-4 flex items-center gap-4 text-white/85">
            {current.caption && <p className="text-sm">{current.caption}</p>}
            <p className="text-xs text-white/50" aria-live="polite">
              {(openIndex ?? 0) + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
