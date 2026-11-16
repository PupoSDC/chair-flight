import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { Breadcrumb } from "./libs/ui/components/base/breadcrumbs";

export const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: false,
    defaultPreload: "intent",
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    breadcrumbs?: (match: {
      params: Record<string, string>;
      // biome-ignore lint/suspicious/noExplicitAny: each page knows its own loader data
      loaderData: any;
    }) => Breadcrumb[];
  }
}
