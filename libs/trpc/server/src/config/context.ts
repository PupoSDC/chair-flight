export type Context = Record<string, never>;

export const createContext = async (): Promise<Context> => ({});
