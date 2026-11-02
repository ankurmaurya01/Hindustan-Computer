/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'm.media-amazon.com',
      'assets.corsair.com',
      'dlcdnwebimgs.asus.com',
      'www.msi.com'
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
  },
};

export default nextConfig;
