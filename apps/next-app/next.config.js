const { withNx } = require("@nx/next/plugins/with-nx");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
});

module.exports = withNx(
  withBundleAnalyzer(
    withMDX({
      nx: {
        svgr: true,
      },
      experimental: {},
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
            destination: "/modules/atpl-theory/questions",
            permanent: true,
          },
          {
            source: "/tests/:path*'",
            destination: "/modules/atpl-theory/tests/:path*",
            permanent: true,
          },
          {
            source: "/learning-objectives",
            destination: "/modules/atpl-theory/learning-objectives",
            permanent: true,
          },
        ];
      },
    }),
  ),
);
