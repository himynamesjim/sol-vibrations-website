'use client'

import { useActionState } from 'react'

import { submitContact, type ContactFormState } from './actions'

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContact,
    { status: 'idle' },
  )

  if (state.status === 'success') {
    return (
      <div className="card p-8 text-center" role="status">
        <h2 className="text-xl text-sol-deep">Message sent 🎸</h2>
        <p className="mt-2 leading-relaxed">Thanks for reaching out — we’ll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="card space-y-5 p-6 sm:p-8">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="field-label" htmlFor="contact-name">
          Name <span aria-hidden="true">*</span>
        </label>
        <input id="contact-name" name="name" type="text" required autoComplete="name" className="field-input" />
      </div>
      <div>
        <label className="field-label" htmlFor="contact-email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" className="field-input" />
      </div>
      <div>
        <label className="field-label" htmlFor="contact-message">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea id="contact-message" name="message" rows={6} required className="field-input" />
      </div>

      {state.status === 'error' && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
