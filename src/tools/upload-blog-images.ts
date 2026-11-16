import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { readEnv } from "../libs/base/read-env.ts";

const BLOG_POSTS_FOLDER = path.join("content", "blog", "posts");
const BUCKET = "chair-flight";
const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const postFolders = await fs.readdir(BLOG_POSTS_FOLDER);
const images = (
  await Promise.all(
    postFolders.map(async (postId) => {
      const files = await fs
        .readdir(path.join(BLOG_POSTS_FOLDER, postId))
        .catch(() => []);
      return files
        .filter((file) => path.extname(file) in CONTENT_TYPES)
        .map((file) => ({
          file: path.join(BLOG_POSTS_FOLDER, postId, file),
          target: `blog/${postId}/${file}`,
          contentType: CONTENT_TYPES[path.extname(file)],
        }));
    }),
  )
).flat();

if (process.argv.includes("--dry-run")) {
  console.info(images.map(({ target }) => target).join("\n"));
  console.info(`${images.length} blog images found`);
} else {
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
  for (const { file, target, contentType } of images) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(target, await fs.readFile(file), {
        contentType,
        cacheControl: "3600",
        upsert: true,
      });
    if (error) throw new Error(`${target}: ${error.message}`);
  }
  console.info(`${images.length} blog images uploaded`);
}
