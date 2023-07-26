import { PrismaClient } from "@prisma/client";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getEnvVariableOrThrow("PROVIDER_ANALYTICS_POSTGRES_PRISMA_URL"),
    },
  },
});
