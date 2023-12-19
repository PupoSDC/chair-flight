export default {
  "*.{js,jsx,ts,tsx}": () => "nx affected --target=lint --fix --max-warnings 0",
  "*.{ts,tsx}": () => "nx affected --target=typecheck",
  "*.{js,jsx,ts,tsx,md,mdx,css,json}": "prettier --write",
};
