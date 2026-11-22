/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*', // এখানে 127.0.0.1 হতে হবে
      },
    ];
  },
};
export default nextConfig;