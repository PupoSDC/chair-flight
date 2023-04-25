export class InvalidStoreState extends Error {
  constructor(
    message: string,
    action: {
      type: string;
      payload: Record<string, unknown>;
    }
  ) {
    super(
      `Invalid store action: ${action.type} (${JSON.stringify(
        action.payload
      )}). ${message}`
    );
    this.name = InvalidStoreState.name;
  }
}
