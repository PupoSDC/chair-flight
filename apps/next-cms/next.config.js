const { withNx } = require("@nrwl/next/plugins/with-nx");

module.exports = withNx({
  nx: {
    svgr: true,
  },
  pageExtensions: ["page.tsx", "api.ts", "page.mdx"],
});
