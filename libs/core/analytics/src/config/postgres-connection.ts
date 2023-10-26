import { PrismaClient } from "@prisma/client";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getEnvVariableOrThrow("PROVIDER_POSTGRES_ANALYTICS_PRISMA_URL"),
    },
  },
});
