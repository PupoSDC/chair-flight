# Chair Flight

An open source ATPL knowledge base and question bank made by students for
students.

Built with
[`React`](https://react.dev/),
[`joy-ui`](https://mui.com/joy-ui/getting-started/overview/),
[`Next`](https://nextjs.org/),
[`Vitest`](https://vitest.dev/),
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
pnpm generate
pnpm dev
pnpm build
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

| Name                         | Desc                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| base-env                     | Utility to safely access env variables                      |
| base-errors                  | Errors that can be handled in the front or in the backend   |
| base-types                   | Base Business types used across the app                     |
| content-interview-flashcards | Content bank for the interview prep module                  |
| content-question-bank-737    | Content bank for the 737 TR module                          |
| content-question-bank-a320   | Content bank for the A320 TR module                         |
| content-question-bank-atpl   | Content bank for the ATPL theory module                     |
| core-analytics               | Analytics provider (currently a custom solution)            |
| core-app                     | Business logic blocks sharable between React SPA/SSR and RN |
| core-github                  | Github related functionalities                              |
| core-schemas                 | Zod Schemas shared across our application (from base-types) |
| react-analytics              | React hooks to interact with our analytics provider         |
| react-components             | Shared react (DOM) components                               |
| react-containers             | Next.js specific components                                 |
| react-games                  | Shared react (three.js) components                          |
| trpc-client                  | trpc next js specific client                                |
| trpc-mock                    | trpc mock server, for storybook and RTL tests               |
| trpc-server                  | main trpc server. All our backend logic starts here         |

### .env

To run the application you will need to provide some env variables in an `.env`
file. You can get started by copying over the `.env.example`:

```sh
cp .env.example .env.local
```

If you create the required services remotely, you can create other env files to
point to those services. For example:

```sh
cp .env.example .env.production
```

You can then run specific configurations using the nx `-c` flag:

```sh
pnpm run dev -c production
pnpm run build -c production
pnpm run migrate -c production
pnpm run generate -c production
```

For more information on managing `.env` variables within an `nx` project you can
read more [here](https://nx.dev/recipes/tips-n-tricks/define-environment-variables).

### Local development

A [docker-compose](https://docs.docker.com/get-started/08_using_compose/) file
is provided to run the required services locally. You will need to run
`pnpm infra` to initialize the required services. The provided `.env.example`
is configured to connect to this local setup.

## Contributing

Please help.
