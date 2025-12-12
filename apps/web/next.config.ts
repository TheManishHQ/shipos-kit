import type { NextConfig } from 'next'
import { withContentCollections } from '@content-collections/next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@shipos/config',
    '@shipos/database',
    '@shipos/auth',
    '@shipos/api',
    '@shipos/i18n',
    '@shipos/mail',
    '@shipos/payments',
    '@shipos/storage',
    '@shipos/utils',
    '@shipos/ai',
    '@shipos/logs',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: [
    '@aws-sdk/client-s3',
    'prettier',
  ],
  turbopack: {
    resolveAlias: {
      '@shipos/config': '../../config',
      '@shipos/database': '../../packages/database',
      '@shipos/auth': '../../packages/auth',
      '@shipos/api': '../../packages/api',
      '@shipos/i18n': '../../packages/i18n',
      '@shipos/mail': '../../packages/mail',
      '@shipos/payments': '../../packages/payments',
      '@shipos/storage': '../../packages/storage',
      '@shipos/utils': '../../packages/utils',
      '@shipos/ai': '../../packages/ai',
      '@shipos/logs': '../../packages/logs',
    },
  },
}

export default withContentCollections(nextConfig)
