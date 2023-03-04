export default {
  "*.{js,jsx,ts,tsx}": () => "nx affected --target=lint",
  "*.{js,jsx,ts,tsx,md,mdx,css,json}": "prettier --write"
}