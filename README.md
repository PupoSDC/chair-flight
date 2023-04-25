# Chair Flight

An open source ATPL knowledge base and question bank made by students for
students.

Built with `React`, `joy-ui`, `Next`, `Vite`, and `mdx`.
Managed with `pnpm`, `fnm` and `nx`.

## Installing and running

```
fnm use
pnpm install
pnpm run dev
```

## Apps

|          |                                             | dev   |
| -------- | ------------------------------------------- | ----- |
| next-app | Next.js server for static/SSR pages and API | :4200 |
| next-app | CMS for question bank development           | :4210 |

## Libs

|                  |                                                             | dev   |
| ---------------- | ----------------------------------------------------------- | ----- |
| core-app         | Business logic blocks sharable between React SPA/SSR and RN | ----- |
| core-errors      | Errors that can be handled in the front or in the backend   | ----- |
| core-redux       | Redux store to manage client side data                      | ----- |
| core-types       | Base Business types used across the app                     | ----- |
| next-components  | Next specific components, hooks, and logic blocks           | ----- |
| question-bank    | Static question bank files                                  | ----- |
| react-components | Shared components with Storybook                            | :4250 |

### .env

```md
UPSTASH_URL=<See https://docs.upstash.com/redis/quickstarts/nextjs13#database-setup >
UPSTASH_TOKEN=<See https://docs.upstash.com/redis/quickstarts/nextjs13#database-setup>
QUESTION_BANK_PROVIDER=<Set to `redis` to use redis locally. Otherwise local fs is used>
```

## Contributing

Please help.
