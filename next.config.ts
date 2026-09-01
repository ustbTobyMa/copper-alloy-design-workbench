import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  ...(isGithubPages
    ? {
        basePath: '/copper-alloy-design-workbench',
        assetPrefix: '/copper-alloy-design-workbench/',
      }
    : {}),
};

export default nextConfig;
