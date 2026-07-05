import type { Metadata } from 'next'
import { Nunito_Sans, Quicksand } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSiteSettings } from '@/utilities/data'
import { getSiteUrl } from '@/utilities/siteUrl'

import './globals.css'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || 'Sol Vibrations'
  const description =
    'Sol Vibrations is a Tulsa, OK 501(c)(3) nonprofit providing free guitar and ukulele lessons to children in underserved communities and bringing healing music to nursing homes and veterans hospitals.'

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${siteName} — Free Music Lessons for Tulsa Kids`,
      template: `%s — ${siteName}`,
    },
    description,
    openGraph: {
      siteName,
      title: `${siteName} — Free Music Lessons for Tulsa Kids`,
      description,
      type: 'website',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: siteName }],
    },
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunitoSans.variable} ${quicksand.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-sol-violet focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
