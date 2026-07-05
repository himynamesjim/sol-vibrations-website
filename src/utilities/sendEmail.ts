type SendEmailArgs = {
  to: string
  subject: string
  text: string
  html?: string
}

/**
 * Single entry point for all transactional email.
 *
 * Delivery is driven by env: when RESEND_API_KEY is set, mail is sent through
 * Resend's HTTP API (EMAIL_FROM must be a sender on a domain verified in
 * Resend). Without the key, messages are logged to the console so local dev
 * and staging keep working without a provider.
 */
export async function sendEmail({ to, subject, text, html }: SendEmailArgs): Promise<void> {
  const from = process.env.EMAIL_FROM || 'hello@solvibrations.net'
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    // Console/log adapter (no provider configured)
    console.info(
      `[email stub] from=${from} to=${to} subject="${subject}"\n${text
        .split('\n')
        .map((line) => `  ${line}`)
        .join('\n')}`,
    )
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Sol Vibrations <${from}>`,
        to: [to],
        subject,
        text,
        ...(html ? { html } : {}),
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`Email send failed (${res.status}): ${body}`)
    }
  } catch (err) {
    // Never let a failed notification break a form submission.
    console.error('Email send failed:', err)
  }
}
