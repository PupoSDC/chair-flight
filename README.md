# Chair Flight

An open source ATPL knowledge base and question bank made by students for
students.

Built with
[`React`](https://react.dev/),
[`joy-ui`](https://mui.com/joy-ui/getting-started/overview/),
[`Next`](https://nextjs.org/),
[`Vite`](https://vitejs.dev/),
[`Storybook`](https://storybook.js.org/),
[`Prisma`](https://www.prisma.io/),
[`Trpc`](https://trpc.io/),
[`Zustand`](https://github.com/pmndrs/zustand),
and [`MDX`](https://mdxjs.com/).

Managed with
[`pnpm`](https://pnpm.io/),
[`fnm`](https://github.com/Schniz/fnm),
and [`nx`](https://nx.dev/).

## Installing and running

You will need to install
[`Git`](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners),
[`pnpm`](https://pnpm.io/installation),
[`fnm`](https://github.com/Schniz/fnm)
[`docker`](https://docs.docker.com/get-docker/),
manually.

To get the app running locally:

```sh
git clone git@github.com:PupoSDC/chair-flight.git
fnm use
cp .env.example .env.local
pnpm install
pnpm infra
pnpm dev:local
```

## Project state

We are currently in Alpha. Semantic Version is not respected and breaking changes
can and will be introduced in patch releases.

## Project Overview

### Apps

\*Note: `dev` indicates the port the service is available when running `pnpm run:*`

| Name     | Desc                                        | local |
| -------- | ------------------------------------------- | ----- |
| next-app | Next.js server for static/SSR pages and API | :4200 |
| docs     | Storybook used for docs                     | :4220 |

### Libs

| Name                          | Desc                                                        |
| ----------------------------- | ----------------------------------------------------------- |
| base-env                      | Utility to safely access env variables                      |
| base-errors                   | Errors that can be handled in the front or in the backend   |
| base-types                    | Base Business types used across the app                     |
| core-app                      | Business logic blocks sharable between React SPA/SSR and RN |
| core-redux                    | Redux state management for the more "Appy" logic of the app |
| core-schemas                  | Zod Schemas shared across our application (from base-types) |
| providers-analytics           | Analytics provider (currently a custom solution)            |
| providers-github              | Github related functionalities                              |
| providers-question-bank-local | Local file system based question bank provider              |
| providers-question-bank-redis | Redis question bank provider                                |
| react/analytics               | React hooks to interact with our analytics provider         |
| react/components              | Shared react (DOM) components                               |
| react/containers              | Next.js specific components                                 |
| react/games                   | Shared react (three.js) components                          |
| trpc/client                   | trpc next js specific client                                |
| trpc/mock                     | trpc mock server, for storybook and RTL tests               |
| trpc/server                   | main trpc server. All our backend logic starts here         |

### .env

A docker-compose file is provided to run the required services locally.
Alternatively you can set up your own instances of all the required providers
(`upstash`, `postgres`, ...). For this you will need to provide some env
variables in an `.env` file located at the repository root.

Please check the `.env.local` file for the variables you need to fill out.

Relevant links:

- https://github.com/settings/tokens/new?scopes=repo
- https://docs.upstash.com/redis/quickstarts/nextjs13#database-setup
- https://vercel.com/docs/storage/vercel-postgres

## Contributing

Please help.
