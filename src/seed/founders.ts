import path from 'path'
import { fileURLToPath } from 'url'

import type { Payload } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Creates (or refreshes) the founder TeamMembers with their photos.
 * Used by the seed script and by one-off environment updates.
 */
export async function seedFounders(payload: Payload): Promise<void> {
  const johnPhoto = await payload.create({
    collection: 'media',
    data: { alt: 'John Ford, co-founder of Sol Vibrations, standing in front of a colorful mural' },
    filePath: path.resolve(dirname, 'assets/john-ford.jpg'),
  })

  const jessicaPhoto = await payload.create({
    collection: 'media',
    data: {
      alt: 'Jessica Ford, co-founder of Sol Vibrations, standing in front of a colorful mural',
    },
    filePath: path.resolve(dirname, 'assets/jessica-ford.jpg'),
  })

  await payload.create({
    collection: 'team-members',
    data: {
      name: 'John Ford',
      title: 'Co-Founder · Musician & Professor',
      bio: 'John is a professional musician, professor, and vibrational alchemist who believes in the transformative power of music. He earned his Bachelor of Music in Performance (Oboe) from Oral Roberts University in 2000 and has taught oboe and guitar at Tulsa Community College and ORU, alongside directing music in academic and church settings. A professional guitarist and multi-instrumentalist, he has performed extensively in symphonies, concert halls, theaters, and community spaces. His journey — from overcoming personal struggles with addiction to rediscovering music as medicine — fuels the heart of Sol Vibrations.',
      photo: johnPhoto.id,
      order: 1,
    },
  })

  await payload.create({
    collection: 'team-members',
    data: {
      name: 'Jessica Ford',
      title: 'Co-Founder · Educator & Musician',
      bio: 'For more than 15 years, Jessica has poured love into the classroom as a public school teacher. A graduate of Northeastern State University, she holds a BS in Education with certifications in Elementary Education and English as a Second Language, and she mentors and tutors through after-school clubs at Bell Elementary, creating safe spaces for students to grow and shine. She also carries rhythm through her bass and nurtures the people around her with intention and care — an educator, a musician, and a heart-led nurturer committed to inspiring and empowering others.',
      photo: jessicaPhoto.id,
      order: 2,
    },
  })
}
