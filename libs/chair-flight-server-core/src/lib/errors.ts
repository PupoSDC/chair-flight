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

export class FailedFirestoreOperationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = FailedFirestoreOperationError.name;
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
    super(`Something is misconfiguration  causing an error: ${what}`);
    this.originalError = error;
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
