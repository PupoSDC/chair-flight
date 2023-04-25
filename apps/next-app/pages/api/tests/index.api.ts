import "@chair-flight/core/app";
import { createTest, newTestConfigurationSchema } from "@chair-flight/core/app";
import { apiHandler } from "@chair-flight/next/server";
import type { Test } from "@chair-flight/base/types";
import type { NewTestConfiguration } from "@chair-flight/core/app";

export type CreateTestBody = NewTestConfiguration;
export type CreateTestResponse = Test;

export default apiHandler(
  {
    post: async ({ req, questionBank }): Promise<CreateTestResponse> => {
      const config = newTestConfigurationSchema.parse(req.body);
      return createTest({ config, questionBank });
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  }
);
