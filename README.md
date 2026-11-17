# Chair Flight

Chair Flight is a community driven aviation question bank built by students for
students. Chair Flight is built with TanStack Start, React, Tailwind, Drizzle 
and Supabase, and deployed to Vercel.

| Path                            | Contents                                       |
| ------------------------------- | ---------------------------------------------- |
| `content/`                      | Question banks and blog posts                  |
| `src/database/`                 | Drizzle schema and migrations                  |
| `src/libs/base/`                | Generic Framework and JS code                  |
| `src/libs/core/`                | Business Logic modules                         |
| `src/libs/providers/`           | External services                              |
| `src/libs/ui/`                  | React Specific code to build the platform      |
| `src/routes/`                   | Application code                               |
| `src/tools/`                    | Scripts used outside of runtime                |


## Develop

```sh
pnpm install
cp .env.example .env

## Create and run local environment
docker compose up
pnpm migrate:local
pnpm script:push-content:local
pnpm script:seed-local-db
pnpm dev:local

# Check your work
pnpm format
pnpm lint
pnpm check

# Build and target .env
pnpm build
pnpm migrate
pnpm script:push-content
pnpm run preview
```
