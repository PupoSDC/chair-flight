import { Suspense } from "react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { vi } from "vitest";
import { trpc } from "@chair-flight/trpc/client";
import { theme } from "../theme";
import type { FunctionComponent } from "react";

export const action = vi.fn();

export const decorators = [
  (Story: FunctionComponent) => (
    <Suspense fallback="Loading...">
      <Story />
    </Suspense>
  ),
  (Story: FunctionComponent) => (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Story />
    </CssVarsProvider>
  ),
  // Typing "other" would be too much of a hassle
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Story: FunctionComponent, other: any) => (
    <RouterContext.Provider
      value={{
        push(...args: unknown[]) {
          action("nextRouter.push")(...args);
          return Promise.resolve(true);
        },
        replace(...args: unknown[]) {
          action("nextRouter.replace")(...args);
          return Promise.resolve(true);
        },
        reload(...args: unknown[]) {
          action("nextRouter.reload")(...args);
        },
        back(...args: unknown[]) {
          action("nextRouter.back")(...args);
        },
        forward() {
          action("nextRouter.forward")();
        },
        prefetch(...args: unknown[]) {
          action("nextRouter.prefetch")(...args);
          return Promise.resolve();
        },
        beforePopState(...args: unknown[]) {
          action("nextRouter.beforePopState")(...args);
        },
        events: {
          on(...args: unknown[]) {
            action("nextRouter.events.on")(...args);
          },
          off(...args: unknown[]) {
            action("nextRouter.events.off")(...args);
          },
          emit(...args: unknown[]) {
            action("nextRouter.events.emit")(...args);
          },
        },
        locale: other?.globals?.locale,
        route: "/",
        asPath: "/",
        basePath: "/",
        isFallback: false,
        isLocaleDomain: false,
        isReady: true,
        isPreview: false,
        pathname: "/",
        query: {},
        ...other?.parameters.nextjs?.router,
      }}
    >
      <Story />
    </RouterContext.Provider>
  ),
  (Story: FunctionComponent) => {
    const Component = trpc.withTRPC(Story);
    return <Component />;
  },
];
