/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['avatars.githubusercontent.com', 'crafatar.com'],
    },
    output: 'export',
    // basePath: '/Website', // décommente si tu déploies sur https://username.github.io/Website
    // assetPrefix: '/Website',
}

export default nextConfig 