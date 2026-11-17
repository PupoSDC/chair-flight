/// <reference types="vite/client" />

import figtree400 from "@fontsource/figtree/files/figtree-latin-400-normal.woff2?url";
import figtree500 from "@fontsource/figtree/files/figtree-latin-500-normal.woff2?url";
import figtree600 from "@fontsource/figtree/files/figtree-latin-600-normal.woff2?url";
import figtree700 from "@fontsource/figtree/files/figtree-latin-700-normal.woff2?url";
import {
  createRootRoute,
  HeadContent,
  ScriptOnce,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { THEME_SCRIPT } from "../libs/ui/hooks/use-theme";
import type { ErrorComponentProps } from "@tanstack/react-router";
import type { FC, PropsWithChildren } from "react";
import katexCss from "katex/dist/katex.min.css?url";
import appCss from "../styles.css?url";

const RootDocument: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ScriptOnce>{THEME_SCRIPT}</ScriptOnce>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
};

const ErrorPage: FC<ErrorComponentProps> = ({ error }) => {
  return (
    <div className="mx-auto max-w-md p-10 text-center text-muted">
      {error instanceof Error ? error.message : "Something went wrong"}.{" "}
      <a className="text-accent underline" href="/">
        Go to the home page
      </a>
    </div>
  );
};

const NotFoundPage: FC = () => {
  return (
    <div className="mx-auto max-w-md p-10 text-center text-muted">
      Page not found.{" "}
      <a className="text-accent underline" href="/">
        Go to the home page
      </a>
    </div>
  );
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "Chair Flight" },
      {
        name: "description",
        content:
          "Chair Flight is a community driven aviation question bank built by students for students.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Chair Flight" },
      { property: "og:title", content: "Chair Flight" },
      {
        property: "og:description",
        content:
          "Chair Flight is a community driven aviation question bank built by students for students.",
      },
      {
        property: "og:image",
        content: "https://chair-flight.com/images/social/default.png",
      },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", content: "#0b6bcb" },
    ],
    links: [
      ...[figtree400, figtree500, figtree600, figtree700].map((href) => {
        return {
          rel: "preload",
          href,
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous" as const,
        };
      }),
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: katexCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  shellComponent: ({ children }) => <RootDocument>{children}</RootDocument>,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});
