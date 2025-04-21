/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['treeoneone.org'],
  },
  env: {
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
    REQUESTS_ID: process.env.REQUESTS_ID,
    REQUESTS_PREVIEW_ID: process.env.REQUESTS_PREVIEW_ID,
  },
}

module.exports = nextConfig 