import { withPayload } from '@payloadcms/next/withPayload'

// Tolerate NEXT_PUBLIC_SITE_URL values without a protocol (e.g. "example.com").
function parseSiteUrl(raw) {
  const value = (raw || '').trim()
  if (!value) return new URL('http://localhost:3000')
  try {
    return new URL(value.includes('://') ? value : `https://${value}`)
  } catch {
    console.warn(`Invalid NEXT_PUBLIC_SITE_URL "${raw}" — falling back to localhost.`)
    return new URL('http://localhost:3000')
  }
}

const siteUrl = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Payload media URLs are absolute (serverURL), so allow our own host.
    remotePatterns: [
      {
        protocol: siteUrl.protocol.replace(':', ''),
        hostname: siteUrl.hostname,
        port: siteUrl.port || '',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
