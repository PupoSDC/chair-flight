const { withNx } = require("@nx/next/plugins/with-nx");
const makeBundleAnalyzer = require("@next/bundle-analyzer");
const makeMdxParser = require("@next/mdx");

const withBundleAnalyzer = makeBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMdx = makeMdxParser({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  nx: {
    svgr: true,
  },
  compiler: {
    emotion: true,
  },
  pageExtensions: ["page.tsx", "api.ts", "page.mdx"],
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

module.exports = [withMdx, withBundleAnalyzer, withNx].reduce(
  (config, wrapper) => wrapper(config),
  nextConfig,
);
