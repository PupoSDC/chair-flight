# Chair Flight

Chair Flight is a community driven aviation question bank built by students for
students.

## Stack

TanStack Start, React, Tailwind, Drizzle and Supabase (Postgres and Storage),
deployed to Vercel.

| Path                            | Contents                                       |
| ------------------------------- | ---------------------------------------------- |
| `content/`                      | Question banks and blog posts                  |
| `src/database/`                 | Drizzle schema and migrations (`chair_flight`) |
| `src/libs/base/`                | Generic helpers                                |
| `src/libs/core/`                | Question bank and test logic                   |
| `src/libs/providers/`           | External services                              |
| `src/libs/ui/`                  | Components, hooks and icons                    |
| `src/routes/`                   | Pages                                          |
| `src/routes/-server-functions/` | Server functions                               |
| `src/tools/`                    | Scripts                                        |

## Develop

```sh
pnpm install
cp .env.example .env
pnpm dev
```

The app runs on http://localhost:3100.

| Command                                    | Reads        | Purpose                                                      |
| ------------------------------------------ | ------------ | ------------------------------------------------------------ |
| `pnpm dev`                                 | `.env`       | Dev server against the hosted database                       |
| `pnpm dev:local`                           | `.env.local` | Dev server against the local Docker database                 |
| `pnpm migrate`                             | `.env`       | Apply database migrations                                    |
| `pnpm migrate:local`                       | `.env.local` | Same, on the local database                                  |
| `pnpm script:seed-database`                | `.env`       | Replace the database with `content/` (needs `-- --upstream`) |
| `pnpm script:seed-database:local`          | `.env.local` | Same on the local database, plus mock users and comments     |
| `pnpm script:pull-database`                | `.env`       | Write the database into `content/`, annexes included         |
| `pnpm script:pull-database:local`          | `.env.local` | Same, from the local database                                |
| `pnpm script:import-learning-objectives`   |              | Convert the `external/*.xlsx` syllabi into YAML              |
| `pnpm check` / `lint` / `format` / `build` | `.env`       | Type check, lint, format, production build                   |

`script:seed-database` accepts `--dry-run`. `.env.local` is committed on purpose
and holds no secrets; `.env` is yours and ignored by git.

## Content

The database is the source of truth. `content/question-bank-*` is a backup of
it, written by `script:pull-database` and readable by `script:seed-database`.
Blog posts in `content/blog` are read at build time. A post's image is
`content/blog/posts/<post>/cover.jpg` (or `.png`, `.webp`); annexes
and blog images are served straight from `content/` in development, and copied
into `public/content/` (git-ignored) by `pnpm build`, so they ship with the app.

Tests are stored in the browser.

## Accounts

Everything below is behind the `FEATURE_FLAG_USER_FLOW` environment variable.
Unless it is `true` at build time (it is `true` in `.env.local`, absent from
`.env.example`'s defaults), the app shows no sign in, no account menu, no
comments and no back office: `/backoffice` is a 404 and the server functions
refuse to run. Set it in Vercel's environment variables to switch it on in
production.

Accounts live in Supabase Auth. People sign in with Google, GitHub, Facebook or
Apple, and can then comment on questions. Comments are published once an
administrator approves them at `/backoffice`.

In the Supabase dashboard enable those four providers, allow new sign-ups, and
add your site URLs to the redirect allow-list.

To make someone an administrator:

```sql
update chair_flight.profiles set role = 'admin' where username = '<username>';
```

## Local database

Develop against a throwaway Postgres instead of Supabase (needs Docker):

```sh
docker compose up -d --wait   # Postgres on localhost:54322
pnpm migrate:local
pnpm script:seed-database:local   # content, 10 mock users and comments
pnpm dev:local
```

Then open `http://localhost:3100/auth/impersonate/<userId>` to sign in as a
mock user, or `/auth/impersonate` for the list. User ids are
`00000000-0000-4000-8000-000000000001` to `...0010`, and the first one is an
administrator. Run `pnpm script:seed-database:local` to reset the mock comments.

The endpoint is a dev server middleware, so it is not part of any build. It also
refuses to work unless `DATABASE_URL` points at `localhost`, so plain `pnpm dev`
(which uses the Supabase database from `.env`) never allows impersonation.
