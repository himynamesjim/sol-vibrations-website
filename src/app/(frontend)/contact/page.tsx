import type { Metadata } from 'next'

import { PageHero } from '@/components/PageHero'
import { getSiteSettings } from '@/utilities/data'
import { ContactForm } from './ContactForm'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Sol Vibrations in Tulsa, OK.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <PageHero
        title="Contact us"
        intro="Questions about lessons, volunteering, or bringing music to your facility? We’d love to hear from you."
      />

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-2xl text-sol-deep">Reach us directly</h2>
          <ul className="mt-5 space-y-4">
            {settings.email && (
              <li>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-sol-violet-strong">
                  Email
                </p>
                <a href={`mailto:${settings.email}`} className="mt-0.5 block hover:underline">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-sol-violet-strong">
                  Phone
                </p>
                <a
                  href={`tel:${settings.phone.replace(/[^+\d]/g, '')}`}
                  className="mt-0.5 block hover:underline"
                >
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.address && (
              <li>
                <p className="font-display text-sm font-bold uppercase tracking-wider text-sol-violet-strong">
                  Mail
                </p>
                <p className="mt-0.5 whitespace-pre-line">{settings.address}</p>
              </li>
            )}
          </ul>
        </div>

        <ContactForm />
      </section>
    </>
  )
}
