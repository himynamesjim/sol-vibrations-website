import type { Metadata } from 'next'

import { PageHero } from '@/components/PageHero'
import { getActivePrograms } from '@/utilities/data'
import { EnrollForm } from './EnrollForm'

export const metadata: Metadata = {
  title: 'Enroll',
  description:
    'Sign up for free guitar or ukulele lessons with Sol Vibrations in Tulsa, OK. Instruments provided, no experience needed.',
}

type Props = { searchParams: Promise<{ program?: string }> }

export default async function EnrollPage({ searchParams }: Props) {
  const [programs, { program }] = await Promise.all([getActivePrograms(), searchParams])

  return (
    <>
      <PageHero
        title="Enroll a student"
        intro="Tell us a little about your family and we’ll reach out about next steps. Lessons and instruments are always free."
      />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <EnrollForm
          programs={programs.map((p) => ({ id: p.id, title: p.title, slug: p.slug }))}
          preselectedProgram={program}
        />
      </section>
    </>
  )
}
