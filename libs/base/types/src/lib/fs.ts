type ReadFile = (path: string, string: "utf-8") => Promise<string>;

export type MiniFs = { readFile: ReadFile };
