import path from 'path'
import { fileURLToPath } from 'url'

import type { Payload } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const paragraph = (text: string) => ({
  type: 'paragraph',
  format: '' as const,
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  textFormat: 0,
  children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
})

const uploadNode = (mediaId: number) => ({
  type: 'upload',
  version: 1,
  format: '' as const,
  relationTo: 'media',
  value: mediaId,
  fields: null,
})

/** Creates the "Stand by Me" lesson post with cover and inline photos. */
export async function seedFirstPost(payload: Payload, authorId: number): Promise<void> {
  const cover = await payload.create({
    collection: 'media',
    data: {
      alt: 'John Ford and a young student play ukulele together at a classroom table',
    },
    filePath: path.resolve(dirname, 'assets/post-standbyme-cover.jpg'),
  })

  const inline = await payload.create({
    collection: 'media',
    data: {
      alt: 'John Ford plays ukulele while a student follows along with sheet music',
    },
    filePath: path.resolve(dirname, 'assets/post-standbyme-inline.jpg'),
  })

  await payload.create({
    collection: 'posts',
    data: {
      title: 'This week in Sol Vibrations, healing and learning moved together through music.',
      slug: 'healing-and-learning-through-music',
      publishedDate: new Date().toISOString(),
      author: authorId,
      excerpt:
        'During this lesson, Stand by Me became more than a song — it became an exercise in trust, listening, rhythm, and presence.',
      coverImage: cover.id,
      body: {
        root: {
          type: 'root',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            paragraph(
              'This week in Sol Vibrations, healing and learning moved together through music. 🎶',
            ),
            paragraph(
              'During this lesson, Stand by Me became more than a song — it became an exercise in trust, listening, rhythm, and presence. As chords and bass lines came together, so did confidence, patience, and connection.',
            ),
            uploadNode(inline.id),
            paragraph(
              'We believe music offers children more than technique. It gives them a space to feel steady, expressive, and capable. In every lesson, sound becomes a pathway for growth, empowerment, and emotional grounding.',
            ),
            paragraph(
              'This is the heart of Sol Vibes: bringing healing through music, one child, one lesson, one moment at a time. 💜🖤',
            ),
            paragraph('Special thank you to Ma Bringier for her gorgeous photographs!'),
          ],
        },
      },
      _status: 'published',
    },
  })

  payload.logger.info('First post created.')
}
