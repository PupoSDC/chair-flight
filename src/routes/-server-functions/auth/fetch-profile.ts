import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "./auth-middleware";

export const fetchProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => context.user);
