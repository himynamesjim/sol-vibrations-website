import type { Metadata } from 'next'

import { PostCard } from '@/components/cards'
import { PageHero } from '@/components/PageHero'
import { getPublishedPosts } from '@/utilities/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'News',
  description: 'Stories, updates, and announcements from Sol Vibrations.',
}

export default async function NewsPage() {
  const posts = await getPublishedPosts(30)

  return (
    <>
      <PageHero title="News" intro="Stories and updates from our students, mentors, and community." />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {posts.length === 0 ? (
          <p className="text-lg">No posts yet — our first stories are on the way!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
