type SendEmailArgs = {
  to: string
  subject: string
  text: string
  html?: string
}

/**
 * Single entry point for all transactional email.
 *
 * TODO: wire provider (Resend or SES) — driven by env vars. Until then this
 * logs the message so local dev and staging keep working without a provider.
 */
export async function sendEmail({ to, subject, text }: SendEmailArgs): Promise<void> {
  const from = process.env.EMAIL_FROM || 'hello@solvibrations.net'

  // Console/log adapter (no provider configured yet)
  console.info(
    `[email stub] from=${from} to=${to} subject="${subject}"\n${text
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n')}`,
  )
}
