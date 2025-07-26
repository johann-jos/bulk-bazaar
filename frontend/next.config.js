/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental section as it's not needed

  images: {
    domains: ['localhost', 'sahisauda.vercel.app'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
}

module.exports = nextConfig