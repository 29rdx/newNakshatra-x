/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '127.0.0.1:3000',
    'localhost:3000',
    '127.0.0.1:8443',
    'localhost:8443',
    '*.trycloudflare.com',
    'bloggers-nevertheless-love-orders.trycloudflare.com',
  ],
}

module.exports = nextConfig
