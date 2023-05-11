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
| base-env         | Utility to safely access env variables                      | ----- |
| base-errors      | Errors that can be handled in the front or in the backend   | ----- |
| base-types       | Base Business types used across the app                     | ----- |
| core-app         | Business logic blocks sharable between React SPA/SSR and RN | ----- |
| core-openai      | Chat GPT based solutions to some recurrent issues we solve  | ----- |
| core-redux       | Redux store to manage client side data                      | ----- |
| next-client      | Next specific components, hooks, and logic blocks           | ----- |
| next-server      | Next specific server utilities                              | ----- |
| react-components | Shared components with Storybook                            | :4250 |
| question-bank    | Static question bank files                                  | ----- |

### .env

```md
UPSTASH_URL=<See https://docs.upstash.com/redis/quickstarts/nextjs13#database-setup>
UPSTASH_TOKEN=<See https://docs.upstash.com/redis/quickstarts/nextjs13#database-setup>
QUESTION_BANK_PROVIDER=<Set to `redis` to use redis locally. Otherwise local fs is used>
OPENAI_API_KEY=<Create here https://platform.openai.com/account/api-keys>
```

## Contributing

Please help.
