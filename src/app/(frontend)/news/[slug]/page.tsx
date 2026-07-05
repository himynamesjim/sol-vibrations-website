import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { getPayloadClient } from '@/utilities/data'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'America/Chicago',
})

async function getPost(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const ogImage =
    post.coverImage && typeof post.coverImage !== 'number'
      ? post.coverImage.sizes?.og?.url || post.coverImage.url
      : undefined
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: ogImage
      ? { images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] }
      : undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const authorName =
    post.author && typeof post.author !== 'number' ? post.author.name : null

  return (
    <article>
      <section className="bg-sol-deep text-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <Link href="/news" className="font-display text-sm font-bold text-sol-gold hover:underline">
            ← All news
          </Link>
          <h1 className="mt-4 text-4xl leading-tight">{post.title}</h1>
          <p className="mt-4 text-white/80">
            {dateFormat.format(new Date(post.publishedDate))}
            {authorName && ` · ${authorName}`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {post.coverImage && typeof post.coverImage !== 'number' && (
          <MediaImage
            media={post.coverImage}
            size="hero"
            className="mb-8 w-full rounded-2xl"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        )}
        <RichText data={post.body} />
      </div>
    </article>
  )
}
