import Link from 'next/link'

import { SunMotif } from '@/components/SunMotif'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <SunMotif className="h-40 w-40" />
      <h1 className="mt-8 text-4xl text-sol-deep">That note doesn’t exist</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed">
        The page you’re looking for has moved or never existed. Let’s get you back to the music.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </section>
  )
}
