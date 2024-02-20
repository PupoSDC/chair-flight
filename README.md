# Chair Flight

An open source ATPL knowledge base and question bank made by students for
students.

Built with
[`React`](https://react.dev/),
[`Joy-ui`](https://mui.com/joy-ui/getting-started/overview/),
[`Next`](https://nextjs.org/),
[`Vitest`](https://vitest.dev/),
[`Storybook`](https://storybook.js.org/),
[`Drizzle`](https://orm.drizzle.team/),
[`Trpc`](https://trpc.io/),
[`Zustand`](https://github.com/pmndrs/zustand),
and [`MDX`](https://mdxjs.com/).

Managed with
[`pnpm`](https://pnpm.io/),
[`fnm`](https://github.com/Schniz/fnm),
and [`nx`](https://nx.dev/).

## Installing and running

You will need to install
[`git`](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners),
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
pnpm migrate
pnpm dev
pnpm build
```

## Project state

We are currently in Alpha. Semantic Version is not respected and breaking changes
can and will be introduced in patch releases.

## Project Overview

### Apps

\*Note: `local` indicates the port the service is available when running `pnpm run:*`

| Name     | Desc                                        | local |
| -------- | ------------------------------------------- | ----- |
| next-app | Next.js server for static/SSR pages and API | :4200 |
| docs     | Storybook used for docs                     | :4220 |

### Libs

| Name                       | Desc                                                        |
| -------------------------- | ----------------------------------------------------------- |
| base-env                   | Utility to safely access env variables                      |
| base-errors                | Errors that can be handled in the front or in the backend   |
| base-utils                 | Common JS utilities                                         |
| content-blog               | Blog posts                                                  |
| content-question-bank-prep | Content bank for the interview prep module                  |
| content-question-bank-type | Content bank for the Type Rating module                     |
| content-question-bank-atpl | Content bank for the ATPL theory module                     |
| next-analytics             | Next Components related to analytics                        |
| next-public                | Next Components displayed in public pages (blog, home, etc) |
| next-question-bank         | Next Components to interact with the question banks         |
| next-tests                 | Next Components used for test taking                        |
| next-user                  | Next Components for user related activities                 |
| core-github                | Github related functionalities                              |
| core-question-bank         | Question Bank entities and functions                        |
| core-search                | Search API entities                                         |
| core-tests                 | Test related entities and functions                         |
| providers-analytics        | Provides analytics postgres DB interactions                 |
| providers-blog             | Blog Pages compiler and server side provider                |
| providers-github           | Github API provider using octokit                           |
| providers-question-bank    | Question Bank compiler and server side provider             |
| providers-search           | Minisearch powered search provider                          |
| react-components           | Shared react (DOM) components                               |
| react-games                | Shared react (three.js) components                          |
| react-markdown             | React Library to render markdown on the client and server   |
| react-theme                | Joy ui custom theme                                         |
| trpc-client                | trpc next js specific client                                |
| trpc-mock                  | trpc mock server, for storybook and RTL tests               |
| trpc-server                | main trpc server. All our backend logic starts here         |

### Commands

We are using nx, so you should get comfortable with the
[NX CLI commands](https://nx.dev/nx-api/nx/documents/run).

To make onboarding easier the most common commands have traditional npm aliases:

| Command        | Effect                                                             |
| -------------- | ------------------------------------------------------------------ |
| `pnpm dev`     | Start the development server for all aps                           |
| `pnpm build`   | Build all apps                                                     |
| `pnpm test`    | Run all tests                                                      |
| `pnpm arrange` | Read all content banks and rewrite them into the system rearranged |
| `pnpm migrate` | Run all migrations for all databases                               |
| `pnpm infra`   | Start all required services for local development                  |
| `pnpm lint`    | Lints (and changes) all code. Use `lint:check` for validation      |
| `pnpm format`  | Format all code using Prettier. Use `format:check` for validation  |
| `pnpm types`   | Check all types using tsc. Use `types:check` for validation        |

### .env

To run the application you will need to provide some env variables in an `.env`
file. You can get started by copying over the `.env.example`:

```sh
cp .env.example .env.local
```

If you create the required services remotely, you can create other env files to
point to those services. For example:

```sh
cp .env.example .env.prod
```

You can then run specific configurations using the nx `-c` flag:

```sh
pnpm run dev -c prod
pnpm run build -c prod
pnpm run migrate -c prod
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
