const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = 'Website-OpenMC'; // Mets ici le nom de ton repo

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: isGithubActions ? `/${repo}` : '',
    assetPrefix: isGithubActions ? `/${repo}/` : '',
    images: {
        unoptimized: true, // Important pour GitHub Pages
        domains: ['avatars.githubusercontent.com', 'crafatar.com'],
    },
}

export default nextConfig 