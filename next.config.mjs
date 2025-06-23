const isGithubPages = process.env.GITHUB_ACTIONS || false;
const repo = 'Website-main'; // <-- remplace par le nom de ton repo si besoin

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: isGithubPages ? `/${repo}` : '',
    assetPrefix: isGithubPages ? `/${repo}/` : '',
    images: {
        unoptimized: true,
        domains: ['avatars.githubusercontent.com', 'crafatar.com'],
    },
}

export default nextConfig 