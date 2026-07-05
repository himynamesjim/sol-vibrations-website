'use client'

import { useActionState, useRef, useState } from 'react'

import { submitEnrollment, type EnrollFormState } from './actions'

type ProgramOption = { id: number; title: string; slug?: string | null }

const steps = ['Parent or guardian', 'Student & program', 'Review & submit'] as const

export function EnrollForm({
  programs,
  preselectedProgram,
}: {
  programs: ProgramOption[]
  preselectedProgram?: string
}) {
  const [state, formAction, isPending] = useActionState<EnrollFormState, FormData>(
    submitEnrollment,
    { status: 'idle' },
  )
  const [step, setStep] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const defaultProgramId = programs.find(
    (p) => p.slug === preselectedProgram || String(p.id) === preselectedProgram,
  )?.id

  if (state.status === 'success') {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center" role="status">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sol-gold" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#241344" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl text-sol-deep">You’re on the list! 🎶</h2>
        <p className="mt-3 leading-relaxed">
          Thanks for reaching out — we’ve saved your request and sent a confirmation email. Our
          team will contact you within a few days to talk about next steps.
        </p>
      </div>
    )
  }

  // Advance only if the current step's fields are valid.
  const goNext = () => {
    const form = formRef.current
    if (!form) return
    const currentFields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      `[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`,
    )
    for (const field of currentFields) {
      if (!field.reportValidity()) return
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  return (
    <form ref={formRef} action={formAction} className="card mx-auto max-w-xl p-6 sm:p-10" noValidate={false}>
      {/* Step indicator */}
      <ol className="mb-8 flex items-center gap-2" aria-label="Form progress">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={`h-1.5 rounded-full ${i <= step ? 'bg-sol-violet' : 'bg-sol-deep/10'}`}
              aria-hidden="true"
            />
            <span
              className={`text-xs font-semibold ${i === step ? 'text-sol-violet-strong' : 'text-sol-ink/50'}`}
              aria-current={i === step ? 'step' : undefined}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {/* Honeypot — hidden from real users, tempting to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Step 1: parent */}
      <fieldset data-step="0" className={step === 0 ? 'space-y-5' : 'hidden'}>
        <legend className="sr-only">Parent or guardian information</legend>
        <div>
          <label className="field-label" htmlFor="parentName">
            Parent/guardian name <span aria-hidden="true">*</span>
          </label>
          <input id="parentName" name="parentName" type="text" required autoComplete="name" className="field-input" />
        </div>
        <div>
          <label className="field-label" htmlFor="parentEmail">
            Email <span aria-hidden="true">*</span>
          </label>
          <input id="parentEmail" name="parentEmail" type="email" required autoComplete="email" className="field-input" />
        </div>
        <div>
          <label className="field-label" htmlFor="parentPhone">
            Phone <span aria-hidden="true">*</span>
          </label>
          <input id="parentPhone" name="parentPhone" type="tel" required autoComplete="tel" className="field-input" />
        </div>
      </fieldset>

      {/* Step 2: student & program */}
      <fieldset data-step="1" className={step === 1 ? 'space-y-5' : 'hidden'}>
        <legend className="sr-only">Student and program information</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="studentFirstName">
              Student first name <span aria-hidden="true">*</span>
            </label>
            <input id="studentFirstName" name="studentFirstName" type="text" required className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="studentAge">
              Student age <span aria-hidden="true">*</span>
            </label>
            <input id="studentAge" name="studentAge" type="number" min={3} max={21} required className="field-input" />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="program">
            Program interest <span aria-hidden="true">*</span>
          </label>
          <select id="program" name="program" required defaultValue={defaultProgramId ?? ''} className="field-input">
            <option value="" disabled>
              Choose a program…
            </option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="instrument">
            Preferred instrument
          </label>
          <select id="instrument" name="instrument" defaultValue="undecided" className="field-input">
            <option value="guitar">Guitar</option>
            <option value="ukulele">Ukulele</option>
            <option value="undecided">Not sure yet</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="notes">
            Anything we should know?
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="field-input"
            placeholder="Accessibility needs, scheduling constraints, musical experience…"
          />
        </div>
      </fieldset>

      {/* Step 3: review */}
      <div data-step="2" className={step === 2 ? '' : 'hidden'}>
        <h2 className="text-xl text-sol-deep">Almost there!</h2>
        <p className="mt-2 leading-relaxed">
          Hit submit and we’ll be in touch within a few days. Lessons and instruments are always
          100% free.
        </p>
        {state.status === 'error' && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {state.message}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            className="font-display font-bold text-sol-violet-strong hover:underline"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        {step < steps.length - 1 ? (
          <button type="button" onClick={goNext} className="btn-primary">
            Continue
          </button>
        ) : (
          <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
            {isPending ? 'Submitting…' : 'Submit enrollment'}
          </button>
        )}
      </div>
    </form>
  )
}
