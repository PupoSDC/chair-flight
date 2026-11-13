import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { chunkItems } from "../libs/base/chunk-items.ts";
import { readEnv } from "../libs/base/read-env.ts";
import { QUESTION_BANK_NAMES } from "../libs/core/question-bank/question-banks.ts";

const BUCKET = "chair-flight";
const CONCURRENCY = 2;
const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

const findAnnexFiles = async (questionBank: string) => {
  const folder = path.join("content", `question-bank-${questionBank}`);
  const files = await fs.readdir(folder, { recursive: true }).catch(() => []);
  return files
    .filter((file) => path.basename(path.dirname(file)) === "annexes")
    .filter((file) => path.extname(file) in CONTENT_TYPES)
    .map((file) => ({
      file: path.join(folder, file),
      target: `${questionBank}/${path.basename(file)}`,
    }));
};

const uploadAnnexes = async () => {
  const dryRun = process.argv.includes("--dry-run");
  const annexFiles = (
    await Promise.all(QUESTION_BANK_NAMES.map(findAnnexFiles))
  ).flat();
  if (dryRun) {
    console.log(`${annexFiles.length} annexes to upload`);
    return;
  }
  const supabase = createClient(
    readEnv("SUPABASE_URL"),
    readEnv("SUPABASE_SECRET_KEY"),
  );
  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (bucketError && !/already exists/i.test(bucketError.message)) {
    throw bucketError;
  }
  for (const batch of chunkItems(annexFiles, CONCURRENCY)) {
    await Promise.all(
      batch.map(async ({ file, target }) => {
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(target, await fs.readFile(file), {
            contentType: CONTENT_TYPES[path.extname(file)],
            cacheControl: "31536000",
            upsert: true,
          });
        if (error) throw new Error(`${target}: ${error.message}`);
      }),
    );
  }
  console.log(`${annexFiles.length} annexes uploaded`);
};

await uploadAnnexes();
