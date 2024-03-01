import { TRPCError } from "@trpc/server";

export class NotFoundError extends TRPCError {
  digest = "NEXT_NOT_FOUND";
  constructor(message?: string) {
    super({
      code: "NOT_FOUND",
      message: message ?? "Not found",
    });
    this.name = NotFoundError.name;
  }
}

export class UnimplementedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = UnimplementedError.name;
  }
}

export class UnauthorizedError extends Error {
  constructor(resource: string) {
    super(`Access denied to resource: ${resource}`);
    this.name = UnauthorizedError.name;
  }
}

export class MissingEnvVariableError extends Error {
  constructor(envVariableName: string) {
    super(`Missing required env variable: ${envVariableName}`);
    this.name = MissingEnvVariableError.name;
  }
}

export class DataError extends Error {
  constructor(message: string) {
    super(`Data Error: ${message}`);
    this.name = DataError.name;
  }
}

export class MissingPathParameter extends Error {
  constructor(parameter: string) {
    super(`Missing Parameter "${parameter}". Please check your file path.`);
    this.name = MissingPathParameter.name;
  }
}
