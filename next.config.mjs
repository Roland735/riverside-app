/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com'],
    },
    exportTrailingSlash: true, // Ensures that pages are exported with a trailing slash (required for GitHub Pages)
};

export default nextConfig;
