import { createReadStream } from "node:fs";
import * as path from "node:path";
import { QUESTION_BANK_NAMES } from "../libs/core/question-banks/question-banks.ts";
import type { Plugin } from "vite";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

export const localAnnexesPlugin = (): Plugin => ({
  name: "chair-flight-local-annexes",
  apply: "serve",
  configureServer: (server) => {
    server.middlewares.use("/local-annexes", (request, response) => {
      const requested = decodeURIComponent((request.url ?? "").split("?")[0]);
      const [questionBank, fileName] = requested.replace(/^\/+/, "").split("/");
      const contentType = CONTENT_TYPES[path.extname(fileName ?? "")];
      const known = QUESTION_BANK_NAMES.some((name) => name === questionBank);
      if (!known || !contentType) {
        response.writeHead(404).end("Annex not found");
        return;
      }
      const file = path.join(
        "content",
        `question-bank-${questionBank}`,
        "annexes",
        path.basename(fileName),
      );
      const stream = createReadStream(file);
      stream.on("error", () => response.writeHead(404).end("Annex not found"));
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
