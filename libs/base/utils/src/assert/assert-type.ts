// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export function assertType<T extends never>() {}
export type IsEqual<A, B> = Exclude<A, B> | Exclude<B, A>;
