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
    return [
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
  },
  async redirects() {
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
        permanent: true,
      },
      {
        source: "/questions",
        destination: "/modules/atpl/questions",
        permanent: true,
      },
      {
        source: "/tests/:path*'",
        destination: "/modules/atpl/tests/:path*",
        permanent: true,
      },
      {
        source: "/learning-objectives",
        destination: "/modules/atpl/learning-objectives",
        permanent: true,
      },
    ];
  },
};

module.exports = [withMdx, withBundleAnalyzer, withNx].reduce(
  (config, wrapper) => wrapper(config),
  nextConfig,
);
