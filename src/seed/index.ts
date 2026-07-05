import config from '@payload-config'
import { getPayload } from 'payload'

import { seedFounders } from './founders'
import { seedGallery } from './gallery'
import { seedFirstPost } from './posts'

/**
 * Seeds a realistic starting dataset: an admin, a mentor, programs, events,
 * posts, team members, and site settings. Run with `pnpm seed`.
 *
 * Idempotent-ish: skips seeding entirely if any user already exists.
 */

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [{ type: 'text', text, format: 0, version: 1, detail: 0, mode: 'normal', style: '' }],
    })),
  },
})

async function seed() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.totalDocs > 0) {
    payload.logger.info('Users already exist — skipping seed. Wipe the database to re-seed.')
    process.exit(0)
  }

  payload.logger.info('Seeding Sol Vibrations…')

  const admin = await payload.create({
    collection: 'users',
    data: {
      name: 'John Ford',
      email: 'admin@solvibrations.net',
      password: 'changeme123',
      role: 'admin',
    },
  })

  await payload.create({
    collection: 'users',
    data: {
      name: 'Marcus the Mentor',
      email: 'mentor@solvibrations.net',
      password: 'changeme123',
      role: 'mentor',
    },
  })

  await payload.create({
    collection: 'programs',
    data: {
      title: 'Guitar Lessons',
      slug: 'guitar-lessons',
      summary:
        'Free weekly group guitar lessons for kids. Guitars provided, no experience needed — just bring your curiosity.',
      body: richText([
        'Our flagship program. Students meet weekly in small groups with a volunteer mentor, learning chords, rhythm, and songs they actually want to play.',
        'Every student receives a guitar to use for the duration of the program, and graduating students often earn an instrument of their own to keep.',
      ]),
      ageRange: 'Ages 8–17',
      schedule: 'Saturdays, 10am–12pm',
      active: true,
      order: 1,
    },
  })

  await payload.create({
    collection: 'programs',
    data: {
      title: 'Ukulele Lessons',
      slug: 'ukulele-lessons',
      summary:
        'The friendliest first instrument there is. Perfect for younger kids and small hands — ukuleles provided.',
      body: richText([
        'Four strings, big smiles. Ukulele is the perfect gateway into music for younger students, and our uke players are often performing songs within their first month.',
      ]),
      ageRange: 'Ages 6–12',
      schedule: 'Saturdays, 1pm–2:30pm',
      active: true,
      order: 2,
    },
  })

  await seedFirstPost(payload, admin.id)

  await seedFounders(payload)
  await seedGallery(payload)

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Sol Vibrations',
      tagline: 'Our sound is light, our light is sound.',
      nonprofitBlurb:
        'Sol Vibrations is a 501(c)(3) nonprofit organization based in Tulsa, OK. Donations are tax-deductible to the extent allowed by law.',
      ein: 'XX-XXXXXXX',
      email: 'johndford77@gmail.com',
      phone: '(918) 902-7245',
      address: '6734 S 111th E Ave\nTulsa, OK 74133',
      navLinks: [
        { label: 'About', url: '/about' },
        { label: 'Programs', url: '/programs' },
        { label: 'Community', url: '/community' },
        { label: 'Healing', url: '/healing' },
        { label: 'Events', url: '/events' },
        { label: 'News', url: '/news' },
        { label: 'Gallery', url: '/gallery' },
        { label: 'Contact', url: '/contact' },
      ],
      footerLinks: [
        { label: 'About', url: '/about' },
        { label: 'Programs', url: '/programs' },
        { label: 'Community', url: '/community' },
        { label: 'Healing', url: '/healing' },
        { label: 'Events', url: '/events' },
        { label: 'News', url: '/news' },
        { label: 'Enroll', url: '/enroll' },
        { label: 'Donate', url: '/donate' },
      ],
      socialLinks: [
        { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61575955051143' },
        { platform: 'youtube', url: 'https://www.youtube.com/channel/UCK9Nn0Q1Jz9t0shY1v1thQw' },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'donate-settings',
    data: {
      heading: 'Help us put instruments in kids’ hands',
      body: richText([
        'Every dollar you give goes directly to instruments, strings, picks, and the volunteer-run lessons that put them to use. $75 buys a starter ukulele. $150 puts a guitar in a student’s hands for good.',
        'Sol Vibrations accepts donations through the trusted external platforms below — we never process payments on this site.',
      ]),
      givingLinks: [
        {
          label: 'PayPal Giving Fund',
          url: 'https://www.paypal.com/us/fundraiser/hub',
          description: 'One-time or recurring gifts, no platform fees.',
        },
      ],
    },
  })

  payload.logger.info('Seed complete!')
  payload.logger.info('Admin login: admin@solvibrations.net / changeme123')
  payload.logger.info('Mentor login: mentor@solvibrations.net / changeme123')
  payload.logger.info('CHANGE THESE PASSWORDS immediately in any real environment.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
