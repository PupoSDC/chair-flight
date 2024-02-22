export { edgeApiHandler, apiHandler } from "./next/api-handler";
export { ssrHandler } from "./next/ssr-handler";
export { staticHandler, staticPathsHandler } from "./next/static-handler";
export * as providers from "./common/providers";
export type { TrpcHelper } from "./next/trpc-helper";
export type {
  AppRouter,
  AppRouterInput,
  AppRouterOutput,
} from "./config/app-router";
