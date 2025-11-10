/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // put static build in `out/`
  images: { unoptimized: true }, // needed for next/image in static export
};

export default nextConfig;