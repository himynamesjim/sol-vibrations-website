'use server'

import { headers } from 'next/headers'

import { getPayloadClient, getSiteSettings } from '@/utilities/data'
import { isRateLimited } from '@/utilities/rateLimit'
import { sendEmail } from '@/utilities/sendEmail'

export type EnrollFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

const yesNo = (value: unknown): 'yes' | 'no' | undefined =>
  value === 'yes' || value === 'no' ? value : undefined

const label = (value: string | undefined) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : '—'

export async function submitEnrollment(
  _prev: EnrollFormState,
  formData: FormData,
): Promise<EnrollFormState> {
  // Honeypot: real users never fill this hidden field. Pretend success so
  // bots don't learn they were caught.
  if (formData.get('website')) {
    return { status: 'success' }
  }

  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(`enroll:${ip}`)) {
    return {
      status: 'error',
      message: 'Too many submissions from this connection. Please try again in an hour.',
    }
  }

  const parentName = String(formData.get('parentName') ?? '').trim()
  const parentEmail = String(formData.get('parentEmail') ?? '').trim()
  const parentPhone = String(formData.get('parentPhone') ?? '').trim()
  const studentFirstName = String(formData.get('studentFirstName') ?? '').trim()
  const studentAge = Number(formData.get('studentAge'))
  const program = Number(formData.get('program'))
  const instrument = String(formData.get('instrument') ?? '')
  const notes = String(formData.get('notes') ?? '').trim()
  const priorLessons = yesNo(formData.get('priorLessons'))
  const playedGuitarBefore = yesNo(formData.get('playedGuitarBefore'))
  const ownsInstrument = yesNo(formData.get('ownsInstrument'))
  const ownedInstrumentRaw = String(formData.get('ownedInstrument') ?? '')
  const ownedInstrument =
    ownsInstrument === 'yes'
      ? (['guitar', 'ukulele', 'bass', 'other'] as const).find((v) => v === ownedInstrumentRaw)
      : undefined

  if (
    !parentName ||
    !parentEmail ||
    !parentPhone ||
    !studentFirstName ||
    !Number.isFinite(studentAge) ||
    !Number.isFinite(program) ||
    !priorLessons ||
    !playedGuitarBefore ||
    !ownsInstrument
  ) {
    return { status: 'error', message: 'Please fill in all required fields.' }
  }

  try {
    const payload = await getPayloadClient()
    const enrollment = await payload.create({
      collection: 'enrollments',
      draft: false,
      overrideAccess: false,
      data: {
        parentName,
        parentEmail,
        parentPhone,
        studentFirstName,
        studentAge,
        program,
        instrument: (['guitar', 'ukulele', 'undecided'] as const).find((v) => v === instrument),
        priorLessons,
        playedGuitarBefore,
        ownsInstrument,
        ownedInstrument,
        notes: notes || undefined,
        status: 'pending',
      },
      depth: 1,
    })

    const programTitle =
      enrollment.program && typeof enrollment.program === 'object'
        ? enrollment.program.title
        : 'Unknown program'

    const settings = await getSiteSettings()

    await sendEmail({
      to: parentEmail,
      subject: 'We got your enrollment request — Sol Vibrations',
      text: [
        `Hi ${parentName},`,
        '',
        `Thanks for your interest in free music lessons for ${studentFirstName}!`,
        'Our team will reach out within a few days to talk about next steps.',
        '',
        'Keep making noise,',
        'Sol Vibrations',
      ].join('\n'),
    })

    if (settings.email) {
      await sendEmail({
        to: settings.email,
        subject: `New enrollment: ${studentFirstName} (age ${studentAge}) — ${programTitle}`,
        text: [
          'New enrollment interest form submission:',
          '',
          `Student:            ${studentFirstName}, age ${studentAge}`,
          `Program interest:   ${programTitle}`,
          `Preferred instrument: ${label(instrument === 'undecided' ? 'not sure yet' : instrument)}`,
          '',
          `Parent/guardian:    ${parentName}`,
          `Email:              ${parentEmail}`,
          `Phone:              ${parentPhone}`,
          '',
          `Taken music lessons before:  ${label(priorLessons)}`,
          `Played guitar before:        ${label(playedGuitarBefore)}`,
          `Owns a stringed instrument:  ${label(ownsInstrument)}`,
          ...(ownsInstrument === 'yes' ? [`Which instrument:            ${label(ownedInstrument)}`] : []),
          '',
          notes ? `Notes: ${notes}` : 'Notes: (none)',
          '',
          'Triage this submission in the admin panel under Enrollments.',
        ].join('\n'),
      })
    }

    return { status: 'success' }
  } catch (err) {
    console.error('Enrollment submission failed:', err)
    return {
      status: 'error',
      message: 'Something went wrong saving your request. Please try again.',
    }
  }
}
