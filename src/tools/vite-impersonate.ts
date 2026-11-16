import postgres from "postgres";
import { isLocalDatabase } from "../libs/base/is-local-database.ts";
import { DEV_USER_COOKIE } from "../libs/core/community/dev-user.ts";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOOPBACK = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const send = (
  response: ServerResponse,
  status: number,
  body: string,
  headers: Record<string, string> = {},
) => {
  response.writeHead(status, { "content-type": "text/html", ...headers });
  response.end(body);
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);

export const impersonatePlugin = (): Plugin => {
  let databaseUrl: string | undefined;

  return {
    name: "chair-flight-impersonate",
    apply: "serve",
    configResolved: () => {
      databaseUrl = process.env.DATABASE_URL;
    },
    configureServer: (server) => {
      server.middlewares.use(
        "/auth/impersonate",
        async (request: IncomingMessage, response: ServerResponse) => {
          if (!LOOPBACK.has(request.socket.remoteAddress ?? "")) {
            return send(response, 403, "Local requests only.");
          }
          if (request.method !== "GET") {
            return send(response, 405, "Use GET.");
          }
          if (!isLocalDatabase(databaseUrl)) {
            return send(
              response,
              404,
              "Impersonation only works against the local database. Start the app with <code>pnpm dev:local</code>.",
            );
          }
          const userId = decodeURIComponent(
            (request.url ?? "/").split("?")[0]?.replace(/^\/|\/$/g, "") ?? "",
          );
          const sql = postgres(databaseUrl as string, {
            prepare: false,
            max: 1,
          });
          try {
            if (!userId) {
              const users = await sql<
                { id: string; username: string; role: string }[]
              >`select id, username, role from chair_flight.profiles order by id`;
              const items = users
                .map(
                  (user) =>
                    `<li><a href="/auth/impersonate/${user.id}">${escapeHtml(user.username)}</a> · ${user.role} · <code>${user.id}</code></li>`,
                )
                .join("");
              return send(
                response,
                200,
                `<!doctype html><title>Impersonate</title><body style="font-family:system-ui;padding:2rem"><h1>Impersonate a mock user</h1><ul>${items || "<li>No users yet, run <code>pnpm migrate:local &amp;&amp; pnpm seed:local</code>.</li>"}</ul>`,
              );
            }
            if (!UUID.test(userId)) {
              return send(response, 400, "That is not a user id.");
            }
            const [user] = await sql<
              { id: string }[]
            >`select id from chair_flight.profiles where id = ${userId}`;
            if (!user) return send(response, 404, "No such user.");
            send(response, 302, "", {
              location: "/",
              "set-cookie": `${DEV_USER_COOKIE}=${user.id}; Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
            });
          } catch (cause) {
            send(
              response,
              500,
              `Could not reach the local database. Is it running (<code>docker compose up -d --wait</code>)?<pre>${escapeHtml(String(cause))}</pre>`,
            );
          } finally {
            await sql.end();
          }
        },
      );
    },
  };
};
