export type MiniFs = { 
    readFile:  (path: string, string: "utf-8") => Promise<string>;
};
