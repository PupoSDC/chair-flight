import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@chair-flight/trpc/server";

const trpc = createTRPCReact<AppRouter>();

export { trpc };
