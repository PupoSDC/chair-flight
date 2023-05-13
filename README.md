# Chair Flight

An open source ATPL knowledge base and question bank made by students for
students.

Built with
[`React`](https://react.dev/),
[`joy-ui`](https://mui.com/joy-ui/getting-started/overview/),
[`Next`](https://nextjs.org/),
[`Vite`](https://vitejs.dev/),
[`Storybook`](https://storybook.js.org/),
and [`MDX`](https://mdxjs.com/).

Managed with
[`pnpm`](https://pnpm.io/),
[`fnm`](https://github.com/Schniz/fnm),
and [`nx`](https://nx.dev/).

## Installing and running

You will need to install
[`Git`](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners),
[`pnpm`](https://pnpm.io/installation),
and [`fnm`](https://github.com/Schniz/fnm)
manually.

```sh
git clone git@github.com:PupoSDC/chair-flight.git
fnm use
cp .env.example .env
pnpm install
pnpm run dev
```

## Project state

We are currently in Alpha. Semantic Version is not respected and breaking changes
can and will be introduced in patch releases.

## Project Overview

### Apps

\*Note: `dev` indicates the port the service is availabel when running `pnpm run dev`

| Name     | Desc                                                           | dev   |
| -------- | -------------------------------------------------------------- | ----- |
| next-app | Next.js server for static/SSR pages and API                    | :4200 |
| next-cms | CMS for question bank development                              | :4210 |
| upstash  | Not a real app, rather an executor to update the QB in upstash |       |

### Libs

\*Note: `dev` indicates the port the service is availabel when running `pnpm run dev`

| Name                    | Desc                                                        | dev   |
| ----------------------- | ----------------------------------------------------------- | ----- |
| base-env                | Utility to safely access env variables                      | ----- |
| base-errors             | Errors that can be handled in the front or in the backend   | ----- |
| base-types              | Base Business types used across the app                     | ----- |
| core-app                | Business logic blocks sharable between React SPA/SSR and RN | ----- |
| core-openai             | Chat GPT based solutions to some recurrent issues we solve  | ----- |
| core-redux              | Redux store to manage client side data                      | ----- |
| next-client             | Next specific components, hooks, and logic blocks           | ----- |
| next-server             | Next specific server utilities                              | ----- |
| question-bank-content   | Static Question Bank Content                                | ----- |
| question-bank-providers | Question Bank providers (Redis & local fs)                  | ----- |
| question-bank-schemas   | Zod Question bank content validation schemas                | ----- |
| react-components        | Shared components with Storybook                            | :4250 |
| question-bank           | Static question bank files                                  | ----- |
| external-upstash        | Upstash connection provider                                 | ----- |
| external-openai         | OpenAi connection provider                                  | ----- |

### .env

When running locally, the webapp is self contained and no external services are
required. Nonetheless, to run remotely, or to run some CMS features (which are
powered by openAI) you will need to provide some env variables in an `.env` file
located at the repository root.

```sh
NEXT_PUBLIC_BASE_URL="Set to localhost:4200 for local development."
QUESTION_BANK_PROVIDER="Set to `redis` to use redis locally. or `local` for local fs"
UPSTASH_URL="See https://docs.upstash.com/redis/quickstarts/nextjs13#database-setup"
UPSTASH_TOKEN="See https://docs.upstash.com/redis/quickstarts/nextjs13#database-setup"
OPENAI_API_KEY="Create here https://platform.openai.com/account/api-keys"
```

## Contributing

Please help.
