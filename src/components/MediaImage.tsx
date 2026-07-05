import Image from 'next/image'

import type { Media } from '@/payload-types'

type Props = {
  media?: Media | number | null
  size?: 'thumbnail' | 'card' | 'hero' | 'og'
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
}

/**
 * Renders a Payload Media doc with next/image. Falls back to the original
 * upload when the requested size wasn't generated (e.g. small source images).
 */
export function MediaImage({ media, size, className, sizes, priority, fill }: Props) {
  if (!media || typeof media === 'number') return null

  const sized = size ? media.sizes?.[size] : undefined
  const url = sized?.url || media.url
  const width = sized?.width || media.width
  const height = sized?.height || media.height

  if (!url) return null

  if (fill) {
    return (
      <Image
        src={url}
        alt={media.alt || ''}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  if (!width || !height) return null

  return (
    <Image
      src={url}
      alt={media.alt || ''}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
