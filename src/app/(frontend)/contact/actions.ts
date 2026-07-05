'use server'

import { headers } from 'next/headers'

import { getPayloadClient, getSiteSettings } from '@/utilities/data'
import { isRateLimited } from '@/utilities/rateLimit'
import { sendEmail } from '@/utilities/sendEmail'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (formData.get('website')) {
    return { status: 'success' }
  }

  const headerList = await headers()
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(`contact:${ip}`)) {
    return {
      status: 'error',
      message: 'Too many messages from this connection. Please try again in an hour.',
    }
  }

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in all fields.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-submissions',
      overrideAccess: false,
      data: { name, email, message },
    })

    const settings = await getSiteSettings()
    if (settings.email) {
      await sendEmail({
        to: settings.email,
        subject: `New contact form message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      })
    }

    return { status: 'success' }
  } catch (err) {
    console.error('Contact submission failed:', err)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
