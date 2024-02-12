import "@total-typescript/ts-reset";

declare global {
  /**
   * A convenience type that replaces the FS types.
   *
   * This is used to parse the question bank at build time, but not have
   * FS included at runtime, which is not compatible with EDGE.
   */
  interface MiniFs {
    readFile: (path: string, string: "utf-8") => Promise<string>;
  }
}
