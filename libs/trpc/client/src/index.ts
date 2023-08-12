import type { AppRouter } from "@chair-flight/trpc/server";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export { trpc } from "./trpc-next";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
