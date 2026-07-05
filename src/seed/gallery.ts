import path from 'path'
import { fileURLToPath } from 'url'

import type { Payload } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Captions and alt text deliberately avoid student names (child-safety rule).
const items: { file: string; alt: string; caption: string }[] = [
  {
    file: 'lesson-01.jpg',
    alt: 'A young student in glasses strums a ukulele during a lesson',
    caption: 'Practicing chords at a Sol Vibrations ukulele lesson.',
  },
  {
    file: 'lesson-02.jpg',
    alt: 'Close-up of a student’s hands strumming a ukulele',
    caption: 'First strums — every song starts here.',
  },
  {
    file: 'lesson-03.jpg',
    alt: 'Mentor John Ford tunes a ukulele while a student holds his own instrument',
    caption: 'Tuning up before the lesson begins.',
  },
  {
    file: 'lesson-04.jpg',
    alt: 'John Ford plays ukulele while a student watches his hands closely',
    caption: 'Watch closely — John demonstrates a new chord.',
  },
  {
    file: 'lesson-05.jpg',
    alt: 'Close-up of John Ford’s hands fretting a chord on a ukulele',
    caption: 'Chord shapes, one finger at a time.',
  },
  {
    file: 'lesson-06.jpg',
    alt: 'A smiling student in glasses holds a ukulele over her shoulder',
    caption: 'All smiles at ukulele practice.',
  },
  {
    file: 'lesson-07.jpg',
    alt: 'Close-up of a young student’s fingers pressing ukulele strings',
    caption: 'Small hands, big sounds.',
  },
  {
    file: 'lesson-08.jpg',
    alt: 'John Ford chats with a student holding a ukulele in a classroom',
    caption: 'One-on-one lesson time.',
  },
  {
    file: 'lesson-09.jpg',
    alt: 'Overhead view of a student’s hand working through a chord on the fretboard',
    caption: 'Working through a new chord shape.',
  },
  {
    file: 'lesson-10.jpg',
    alt: 'John Ford holds a ukulele and a clip-on tuner while talking to students',
    caption: 'John shares a tip between songs.',
  },
  {
    file: 'lesson-11.jpg',
    alt: 'A student smiles while cradling her ukulele',
    caption: 'Ready to play.',
  },
  {
    file: 'lesson-12.jpg',
    alt: 'A student practices finger positions on the ukulele fretboard',
    caption: 'Finding the notes.',
  },
  {
    file: 'lesson-13.jpg',
    alt: 'John Ford reads through sheet music with a student during a lesson',
    caption: 'Reading through the songbook together.',
  },
  {
    file: 'lesson-14.jpg',
    alt: 'John Ford smiles while holding his ukulele in a classroom',
    caption: 'Co-founder John Ford and his trusty ukulele.',
  },
]

/** Uploads the lesson photos and publishes them as gallery items. */
export async function seedGallery(payload: Payload): Promise<void> {
  for (const item of items) {
    const media = await payload.create({
      collection: 'media',
      data: { alt: item.alt },
      filePath: path.resolve(dirname, 'assets/gallery', item.file),
    })

    await payload.create({
      collection: 'gallery-items',
      data: {
        image: media.id,
        caption: item.caption,
        photoReleaseConfirmed: true,
        _status: 'published',
      },
    })
  }
  payload.logger.info(`Seeded ${items.length} gallery items.`)
}
