import { withPayload } from '@payloadcms/next/withPayload'

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

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
