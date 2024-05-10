import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { UTApi } from "uploadthing/server";
import { getEnvVariableOrThrow } from "@cf/base/env";
import { makeMap, sha256, takeOneOrThrow } from "@cf/base/utils";
import { blogPostSchema, type BlogPost } from "@cf/core/blog";
import { contentSchema, type ContentDb } from "../drizzle";
import { getBankMetadata } from "./functions/get-bank-metadata";
import { updateQuestionBank } from "./functions/update-question-bank";
import type { QuestionBank } from "@cf/core/question-bank";

export type MediaId = string;
export type MediaUrl = string;
export type MediaFile = { id: MediaId; file: File };

export class Content {
  private static client: Client;
  private static db: ContentDb;
  private static ut: UTApi;
  private static utSalt: string;

  constructor() {
    const schema = contentSchema;
    const pgProvider = getEnvVariableOrThrow("PROVIDER_POSTGRES_CONTENT");
    const utSalt = getEnvVariableOrThrow("PROVIDER_UPLOADTHING_HASH_SALT");
    const utSecret = getEnvVariableOrThrow("PROVIDER_UPLOADTHING_SECRET");
    Content.ut = new UTApi({ apiKey: utSecret });
    Content.utSalt = utSalt;
    Content.client = new Client({ connectionString: pgProvider });
    Content.db = drizzle(Content.client, { schema });
    Content.client.connect();
  }

  private async makeDocument(item: { id: string }) {
    return {
      hash: await sha256(JSON.stringify(item)),
      id: item.id,
      status: "current" as const,
      createdAt: new Date(),
      document: item,
    };
  }

  private async getAllMediaFiles() {
    return (await Content.ut.listFiles({ limit: 2000 })).files;
  }

  public async updateMedia(files: MediaFile[]) {
    const existingFiles = await this.getAllMediaFiles();

    const existingFilesToHash = makeMap(
      existingFiles,
      (f) => f.name,
      (f) => f.customId,
    );

    const existingFilesToUrl = makeMap(
      existingFiles,
      (f) => f.name,
      (f) => `https://utfs.io/f/${f.key}`,
    );

    const filesWithHashes = await Promise.all(
      files.map(async (file) => ({
        ...file,
        hash: await sha256((await file.file.text()) + Content.utSalt),
      })),
    );

    const filesThatChanged = filesWithHashes.filter(
      (f) => f.hash !== existingFilesToHash[f.id],
    );

    const newFileUploads = await Content.ut.uploadFiles(
      filesThatChanged.map((f) => {
        const file: File & { customId?: string } = f.file;
        file.customId = f.hash;
        return file;
      }),
    );

    const errors = newFileUploads.filter((f) => f.error);
    if (errors.length) {
      console.error(errors);
      throw new Error("Failed to upload files");
    }

    const newFilesToUrl = makeMap(
      newFileUploads,
      (f) => f.data?.name ?? "",
      (f) => f.data?.url ?? "",
    );

    return {
      ...existingFilesToUrl,
      ...newFilesToUrl,
    } as Record<MediaId, MediaUrl>;
  }

  public async updateBlogPosts(blogPosts: BlogPost[]) {
    await Content.db
      .update(contentSchema.blogPosts)
      .set({ status: "outdated" })
      .where(eq(contentSchema.blogPosts.status, "current"));

    await Content.db
      .insert(contentSchema.blogPosts)
      .values(await Promise.all(blogPosts.map(this.makeDocument)))
      .onConflictDoUpdate({
        target: contentSchema.blogPosts.hash,
        set: { status: "current" },
      });
  }

  public updateQuestionBank = (content: QuestionBank) =>
    updateQuestionBank(Content.db, content);

  public getBankMetadata = () => getBankMetadata(Content.db);

  public async getBlogPosts() {
    const rows = await Content.db
      .select()
      .from(contentSchema.blogPosts)
      .where(eq(contentSchema.blogPosts.status, "current"))
      .execute();
    const posts = rows
      .map((row) => blogPostSchema.parse(row.document))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return { posts };
  }

  public async getBlogPost(id: string) {
    const row = await Content.db
      .select()
      .from(contentSchema.blogPosts)
      .where(
        and(
          eq(contentSchema.blogPosts.id, id),
          eq(contentSchema.blogPosts.status, "current"),
        ),
      )
      .execute()
      .then(takeOneOrThrow);
    const post = blogPostSchema.parse(row.document);
    return { post };
  }
}
