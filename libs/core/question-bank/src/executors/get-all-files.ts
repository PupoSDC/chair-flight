import * as fs from "node:fs/promises";
import * as path from "node:path";

export const getAllFiles = async (
  relativePath: string,
  targetFileName: string,
) => {
  const result: string[] = [];
  const stack: string[] = [relativePath];

  while (stack.length > 0) {
    const currentPath = stack.pop();
    if (!currentPath) continue;

    const files = await fs.readdir(currentPath);

    for (const file of files) {
      const newPath = path.join(currentPath, file);

      if ((await fs.stat(newPath)).isDirectory()) {
        stack.push(newPath);
      }

      if (file.endsWith(targetFileName)) {
        result.push(newPath);
      }
    }
  }

  return result;
};
