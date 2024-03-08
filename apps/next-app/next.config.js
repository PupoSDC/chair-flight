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
  experimental: {
    optimizePackageImports: [
      "@cf/react/ui",
      "@cf/react/markdown",
      "@cf/react/theme",
      "@cf/next-old/analytics",
      "@cf/next-old/public",
      "@cf/next-old/question-bank",
      "@cf/next/search",
      "@cf/next-old/tests",
      "@cf/next/trpc",
      "@cf/next/ui",
      "@cf/next-old/user",
      "@mui/joy",
      "@mui/base",
    ],
  },
  transpilePackages: ["@mui/x-charts"],
  rewrites: async () => {
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
  redirects: async () => {
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
      {
        source: "/modules/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
};

module.exports = [withBundleAnalyzer, withNx].reduce(
  (config, wrapper) => wrapper(config),
  nextConfig,
);
