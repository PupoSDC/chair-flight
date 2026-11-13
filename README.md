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

| Command               | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `pnpm check`          | Type check                                    |
| `pnpm lint`           | Lint                                          |
| `pnpm format`         | Lint and format                               |
| `pnpm build`          | Production build                              |
| `pnpm migrate`        | Apply database migrations                     |
| `pnpm upload-content` | Compile `content/` and replace it in Postgres |
| `pnpm upload-annexes` | Upload annex images to Supabase Storage       |

`upload-content` and `upload-annexes` accept `--dry-run`.

## Content

Questions, learning objectives, docs, annexes and flashcards live in
`content/question-bank-*`. After editing them run `pnpm upload-content`, and
`pnpm upload-annexes` when images change. Blog posts in `content/blog` are read
at build time.

Tests are stored in the browser, there are no user accounts.
