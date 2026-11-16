import { createReadStream } from "node:fs";
import * as path from "node:path";
import type { Plugin } from "vite";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export const localBlogImagesPlugin = (): Plugin => ({
  name: "chair-flight-local-blog-images",
  apply: "serve",
  configureServer: (server) => {
    server.middlewares.use("/local-blog", (request, response) => {
      const requested = decodeURIComponent((request.url ?? "").split("?")[0]);
      const [postId, fileName] = requested.replace(/^\/+/, "").split("/");
      const contentType = CONTENT_TYPES[path.extname(fileName ?? "")];
      if (!postId || !fileName || !contentType) {
        response.writeHead(404).end("Image not found");
        return;
      }
      const file = path.join(
        "content",
        "blog",
        "posts",
        path.basename(postId),
        path.basename(fileName),
      );
      const stream = createReadStream(file);
      stream.on("error", () => response.writeHead(404).end("Image not found"));
      stream.on("open", () => {
        response.writeHead(200, {
          "content-type": contentType,
          "cache-control": "no-cache",
        });
        stream.pipe(response);
      });
    });
  },
});
