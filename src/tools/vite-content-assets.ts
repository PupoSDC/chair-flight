import { createReadStream } from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { QUESTION_BANK_NAMES } from "../libs/core/question-banks/question-banks.ts";
import type { Plugin } from "vite";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};
const PUBLIC_FOLDER = path.join("public", "content");

const resolveSourceFile = (requestedPath: string) => {
  const [kind, folder, fileName] = requestedPath.replace(/^\/+/, "").split("/");
  if (!kind || !folder || !fileName) return undefined;
  if (!(path.extname(fileName) in CONTENT_TYPES)) return undefined;
  if (kind === "annexes" && QUESTION_BANK_NAMES.some((n) => n === folder)) {
    return path.join(
      "content",
      `question-bank-${folder}`,
      "annexes",
      path.basename(fileName),
    );
  }
  if (kind === "blog") {
    return path.join(
      "content",
      "blog",
      path.basename(folder),
      path.basename(fileName),
    );
  }
  return undefined;
};

const copyAssets = async (source: string, target: string) => {
  const files = await fs.readdir(source).catch(() => []);
  const assets = files.filter((file) => path.extname(file) in CONTENT_TYPES);
  if (assets.length === 0) return;
  await fs.mkdir(target, { recursive: true });
  await Promise.all(
    assets.map((file) =>
      fs.copyFile(path.join(source, file), path.join(target, file)),
    ),
  );
};

const copyContentIntoPublicFolder = async () => {
  await fs.rm(PUBLIC_FOLDER, { recursive: true, force: true });
  await Promise.all(
    QUESTION_BANK_NAMES.map((name) =>
      copyAssets(
        path.join("content", `question-bank-${name}`, "annexes"),
        path.join(PUBLIC_FOLDER, "annexes", name),
      ),
    ),
  );
  const postsFolder = path.join("content", "blog");
  const posts = await fs.readdir(postsFolder).catch(() => []);
  await Promise.all(
    posts.map((post) =>
      copyAssets(
        path.join(postsFolder, post),
        path.join(PUBLIC_FOLDER, "blog", post),
      ),
    ),
  );
};

export const contentAssetsPlugin = (): Plugin => {
  let copied = false;
  let building = false;
  return {
    name: "chair-flight-content-assets",
    configResolved: (config) => {
      building = config.command === "build";
    },
    configureServer: (server) => {
      server.middlewares.use("/content", (request, response, next) => {
        const requested = decodeURIComponent((request.url ?? "").split("?")[0]);
        const file = resolveSourceFile(requested);
        if (!file) return next();
        const stream = createReadStream(file);
        stream.on("error", () => next());
        stream.on("open", () => {
          response.writeHead(200, {
            "content-type": CONTENT_TYPES[path.extname(file)],
            "cache-control": "no-cache",
          });
          stream.pipe(response);
        });
      });
    },
    buildStart: async () => {
      if (copied || !building) return;
      copied = true;
      await copyContentIntoPublicFolder();
    },
  };
};
