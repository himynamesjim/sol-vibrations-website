#!/usr/bin/env node
// Trigger a Vercel production deploy via a Deploy Hook.
//
// Usage:
//   VERCEL_DEPLOY_HOOK_URL="https://api.vercel.com/v1/integrations/deploy/prj_.../..." pnpm deploy
//
// Create the hook in Vercel → Project → Settings → Git → Deploy Hooks.

const url = process.env.VERCEL_DEPLOY_HOOK_URL

if (!url) {
  console.error(
    'VERCEL_DEPLOY_HOOK_URL is not set.\n' +
      'Create a Deploy Hook in Vercel (Project → Settings → Git → Deploy Hooks),\n' +
      'then run: VERCEL_DEPLOY_HOOK_URL="<hook url>" pnpm deploy',
  )
  process.exit(1)
}

console.log('Triggering Vercel production deploy…')

try {
  const res = await fetch(url, { method: 'POST' })
  const body = await res.text()
  if (body) console.log(body)
  if (!res.ok) {
    console.error(`Deploy hook returned HTTP ${res.status}`)
    process.exit(1)
  }
  console.log(`Deploy triggered (HTTP ${res.status}). Track progress in the Vercel dashboard.`)
} catch (error) {
  console.error('Failed to reach the deploy hook:', error)
  process.exit(1)
}
