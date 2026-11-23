/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!process.env.NEXT_SERVER_API_URL) return [];
    return [
      {
        source: '/server-api/:path*',
        destination: `${process.env.NEXT_SERVER_API_URL}/:path*`,
      },
    ];
  },
};
export default nextConfig;