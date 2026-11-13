/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  ScriptOnce,
  Scripts,
} from "@tanstack/react-router";
import { THEME_SCRIPT } from "../libs/ui/hooks/use-theme";
import type { ErrorComponentProps } from "@tanstack/react-router";
import type { FC, PropsWithChildren } from "react";
import appCss from "../styles.css?url";
import "@fontsource/figtree/latin-400.css";
import "@fontsource/figtree/latin-500.css";
import "@fontsource/figtree/latin-600.css";
import "@fontsource/figtree/latin-700.css";

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
      { property: "og:image", content: "/images/social/default.png" },
      { name: "theme-color", content: "#0b6bcb" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  shellComponent: ({ children }) => <RootDocument>{children}</RootDocument>,
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});
