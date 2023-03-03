const { withNx } = require('@nrwl/next/plugins/with-nx');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
})

module.exports = withNx(withMDX({
  nx: {
    svgr: true,
  },
  pageExtensions: [
    'page.tsx', 
    'api.ts',
    'page.mdx'
  ],
}));
