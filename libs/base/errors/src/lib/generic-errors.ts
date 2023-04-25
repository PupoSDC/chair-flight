export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
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

export class ConfigurationError extends Error {
  originalError: Error | undefined;
  constructor(what: string, error?: Error) {
    super(`Something is misconfigured causing an error: ${what}`);
    this.name = ConfigurationError.name;
    this.originalError = error;
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

export class UnimplementedEndpointError extends UnimplementedError {
  constructor(method?: string, endpoint?: string) {
    super(`Unimplemented ${method}:${endpoint}`);
    this.name = UnimplementedError.name;
  }
}

export class MissingDataError extends Error {
  constructor(message: string) {
    super(`Missing data: ${message}`);
    this.name = MissingDataError.name;
  }
}
