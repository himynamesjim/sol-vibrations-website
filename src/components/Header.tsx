import Image from 'next/image'
import Link from 'next/link'

import { getSiteSettings } from '@/utilities/data'
import { MobileNav } from './MobileNav'

const defaultNav = [
  { label: 'About', url: '/about' },
  { label: 'Programs', url: '/programs' },
  { label: 'Events', url: '/events' },
  { label: 'News', url: '/news' },
  { label: 'Gallery', url: '/gallery' },
  { label: 'Contact', url: '/contact' },
]

export async function Header() {
  const settings = await getSiteSettings()
  const navLinks =
    settings.navLinks && settings.navLinks.length > 0
      ? settings.navLinks.map(({ label, url }) => ({ label, url }))
      : defaultNav

  return (
    <header className="sticky top-0 z-40 bg-sol-deep text-white shadow-lg shadow-sol-deep/20">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Sol Vibrations — home">
          <Image
            src="/logo.png"
            alt=""
            width={180}
            height={54}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url ?? '/'}
              className="rounded-full px-3.5 py-2 font-display font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/donate" className="btn-outline-light ml-2 px-5 py-2 text-sm">
            Donate
          </Link>
          <Link href="/enroll" className="btn-secondary ml-2 px-5 py-2 text-sm">
            Enroll
          </Link>
        </nav>

        <MobileNav
          links={[
            ...navLinks.map((l) => ({ label: l.label, url: l.url ?? '/' })),
            { label: 'Donate', url: '/donate' },
            { label: 'Enroll', url: '/enroll' },
          ]}
        />
      </div>
    </header>
  )
}
