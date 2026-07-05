import config from '@payload-config'
import { getPayload } from 'payload'

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

const daysFromNow = (days: number, hour = 18) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

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
      name: 'Sol Admin',
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

  await payload.create({
    collection: 'programs',
    data: {
      title: 'Healing Music Outreach',
      slug: 'healing-music-outreach',
      summary:
        'Our mentors and advanced students bring live music to nursing homes and veterans hospitals across Tulsa.',
      body: richText([
        'Music heals. Our outreach ensembles visit nursing homes and veterans hospitals to share songs, stories, and connection — and our students learn that their gift is something worth giving away.',
      ]),
      ageRange: 'Advanced students & volunteers',
      schedule: 'Monthly visits',
      active: true,
      order: 3,
    },
  })

  await payload.create({
    collection: 'events',
    data: {
      title: 'Spring Student Showcase',
      slug: 'spring-student-showcase',
      date: daysFromNow(21, 18),
      location: 'Guthrie Green, Tulsa',
      description: richText([
        'Our students take the stage! Come cheer on every strummed chord and brave solo. Free and open to the public — bring the whole family.',
      ]),
      isPublic: true,
    },
  })

  await payload.create({
    collection: 'events',
    data: {
      title: 'Healing Music at the Tulsa VA',
      slug: 'healing-music-tulsa-va',
      date: daysFromNow(35, 14),
      location: 'Jack C. Montgomery VA Medical Center',
      description: richText([
        'Our outreach ensemble visits the veterans hospital for an afternoon of familiar songs and good company.',
      ]),
      isPublic: true,
    },
  })

  await payload.create({
    collection: 'events',
    data: {
      title: 'Fall Enrollment Open House',
      slug: 'fall-enrollment-open-house',
      date: daysFromNow(60, 10),
      location: 'Sol Vibrations Studio, Tulsa',
      description: richText([
        'Meet our mentors, try a guitar or ukulele, and sign up for the fall session. Walk-ins welcome!',
      ]),
      isPublic: true,
    },
  })

  const posts = [
    {
      title: 'Welcome to the new Sol Vibrations website',
      slug: 'welcome-to-the-new-website',
      excerpt:
        'A new home for our mission: free music lessons for Tulsa kids and healing music for our community.',
      body: [
        'We’re thrilled to launch our new website — a home for everything Sol Vibrations: programs, events, stories, and ways to get involved.',
        'Enrollment for lessons is open year-round, and our event calendar is filling up. Take a look around, and come make some noise with us.',
      ],
    },
    {
      title: 'Twelve new guitars, twelve new guitarists',
      slug: 'twelve-new-guitars',
      excerpt: 'Thanks to a generous donor, a dozen students just received their first guitar.',
      body: [
        'There are few moments better than watching a kid open a guitar case for the first time and realize it’s theirs.',
        'Thanks to a generous local donor, twelve of our graduating students received instruments of their own this month. Every practice session at home starts here.',
      ],
    },
    {
      title: 'An afternoon of songs at the VA',
      slug: 'afternoon-of-songs-at-the-va',
      excerpt: 'Our outreach ensemble shared two hours of music and memories with Tulsa veterans.',
      body: [
        'Last weekend our healing music ensemble visited the Jack C. Montgomery VA Medical Center. We played the songs they asked for — and heard the stories behind every request.',
        'This is why we do outreach: music opens doors that conversation alone can’t.',
      ],
    },
  ]

  for (const post of posts) {
    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        slug: post.slug,
        publishedDate: new Date().toISOString(),
        author: admin.id,
        excerpt: post.excerpt,
        body: richText(post.body),
        _status: 'published',
      },
    })
  }

  const team = [
    {
      name: 'Jim Peterson',
      title: 'Founder & Executive Director',
      bio: 'Musician, teacher, and believer that every kid deserves a chance to make music.',
      order: 1,
    },
    {
      name: 'Marcus Rivera',
      title: 'Lead Guitar Mentor',
      bio: 'Twenty years of playing, five years of teaching, endless patience for beginners.',
      order: 2,
    },
    {
      name: 'Dana Whitfield',
      title: 'Outreach Coordinator',
      bio: 'Organizes our healing music visits and keeps every performance running on time.',
      order: 3,
    },
  ]

  for (const member of team) {
    await payload.create({ collection: 'team-members', data: member })
  }

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
        { label: 'Events', url: '/events' },
        { label: 'News', url: '/news' },
        { label: 'Gallery', url: '/gallery' },
        { label: 'Contact', url: '/contact' },
      ],
      footerLinks: [
        { label: 'About', url: '/about' },
        { label: 'Programs', url: '/programs' },
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
