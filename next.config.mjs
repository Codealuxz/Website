<<<<<<< HEAD
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = 'Website-OpenMC'; // Mets ici le nom de ton repo

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: isGithubActions ? `/${repo}` : '',
    assetPrefix: isGithubActions ? `/${repo}/` : '',
    images: {
        unoptimized: true, // Important pour GitHub Pages
=======
const isGithubPages = process.env.GITHUB_ACTIONS || false;
const repo = 'Website-main'; // <-- remplace par le nom de ton repo si besoin

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: isGithubPages ? `/${repo}` : '',
    assetPrefix: isGithubPages ? `/${repo}/` : '',
    images: {
        unoptimized: true,
>>>>>>> 29b58c8b33f28a07246c9f18f2f2f47f99975072
        domains: ['avatars.githubusercontent.com', 'crafatar.com'],
    },
}

export default nextConfig 