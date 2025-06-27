/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['avatars.githubusercontent.com', 'crafatar.com'],
        unoptimized: true,
    },
    output: 'export',
};

export default nextConfig; 