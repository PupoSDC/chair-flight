//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: true,
  },
  pageExtensions: [
    'page.tsx', 
    'api.ts',
    'page.mdx'
  ],
};

module.exports = withNx(nextConfig);
