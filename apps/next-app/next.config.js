const enableAnalyze = process.env.ANALYZE === "true";

const { withNx } = require("@nx/next/plugins/with-nx");
const makeBundleAnalyzer = require("@next/bundle-analyzer");
const withBundleAnalyzer = makeBundleAnalyzer({ enabled: enableAnalyze });

/** @type {import('next').NextConfig} */
const nextConfig = {
  nx: {
    svgr: true,
  },
  compiler: {
    emotion: true,
  },
  pageExtensions: ["page.tsx", "api.ts"],
  async rewrites() {
    const aboutUsRewrite = [
      {
        source: "/articles/about-us",
        destination: "/blog/000-about-us",
      },
    ];

    const storybookRewrites = [
      "assets",
      "sb-addons",
      "sb-common-assets",
      "sb-manager",
      "sb-preview",
      "index.json",
      "iframe.html",
      "project.json",
      "stories.json",
      "mockServiceWorker.js",
    ].map((source) => ({
      source: `/${source}/:path*`,
      destination: `/storybook/${source}/:path*`,
    }));

    return [...storybookRewrites, ...aboutUsRewrite];
  },
  async redirects() {
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
        permanent: true,
      },
      {
        source: "/articles/blog/:path*",
        destination: "/blog/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = [withBundleAnalyzer, withNx].reduce(
  (config, wrapper) => wrapper(config),
  nextConfig,
);
