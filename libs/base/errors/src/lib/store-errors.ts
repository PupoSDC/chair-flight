export type InvalidStoreStateActionType = {
  type: string;
  payload: Record<string, unknown>;
};

export class InvalidStoreState extends Error {
  constructor(message: string, action: InvalidStoreStateActionType) {
    super(
      `Invalid store action: ${action.type} (${JSON.stringify(
        action.payload,
      )}). ${message}`,
    );
    this.name = InvalidStoreState.name;
  }
}
