import Image from 'next/image'
import Link from 'next/link'

import { getSiteSettings } from '@/utilities/data'

const defaultFooterLinks = [
  { label: 'About', url: '/about' },
  { label: 'Programs', url: '/programs' },
  { label: 'Community', url: '/community' },
  { label: 'Healing', url: '/healing' },
  { label: 'Events', url: '/events' },
  { label: 'Enroll', url: '/enroll' },
  { label: 'Donate', url: '/donate' },
  { label: 'Contact', url: '/contact' },
]

const socialLabels: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X (Twitter)',
}

export async function Footer() {
  const settings = await getSiteSettings()
  const footerLinks =
    settings.footerLinks && settings.footerLinks.length > 0
      ? settings.footerLinks
      : defaultFooterLinks

  return (
    <footer className="bg-sol-deep text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Image src="/logo.png" alt="Sol Vibrations" width={200} height={60} className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            {settings.tagline || 'Our sound is light, our light is sound.'}
          </p>
          {settings.socialLinks && settings.socialLinks.length > 0 && (
            <ul className="mt-4 flex gap-3">
              {settings.socialLinks.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-sol-gold hover:underline"
                  >
                    {socialLabels[social.platform] ?? social.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-sol-gold">
            Explore
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.url}>
                <Link href={link.url ?? '/'} className="text-sm hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-sol-gold">
            Get in touch
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-white hover:underline">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white hover:underline">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.address && <li className="whitespace-pre-line">{settings.address}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-white/60 sm:px-6">
          <p>{settings.nonprofitBlurb}</p>
          {settings.ein && <p className="mt-1">EIN: {settings.ein}</p>}
          <p className="mt-1">
            © {new Date().getFullYear()} {settings.siteName || 'Sol Vibrations'}. Tulsa, Oklahoma.
          </p>
        </div>
      </div>
    </footer>
  )
}
