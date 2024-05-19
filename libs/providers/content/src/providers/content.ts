import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { UTApi } from "uploadthing/server";
import { getEnvVariableOrThrow } from "@cf/base/env";
import { chunk, makeMap, sha256, wait } from "@cf/base/utils";
import { contentSchema } from "../../drizzle";
import type { ContentDb, ContentSchema } from "../../drizzle";
import type { BlogPost } from "@cf/core/content";
import type { QuestionBank } from "@cf/core/content";
import type { UploadFileResult } from "uploadthing/types";

export type MediaId = string;
export type MediaUrl = string;
export type MediaFile = { id: MediaId; file: File };
export type MediaMap = Record<MediaId, MediaUrl>;

export class Content {
  private static client: Client;
  private static ut: UTApi;
  private static utSalt: string;
  protected static db: ContentDb;

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

  private async makeDocument(document: { id: string }, source: string) {
    return {
      source,
      document,
      hash: await sha256(JSON.stringify(document)),
      id: document.id,
      status: "current" as const,
      createdAt: new Date(),
    };
  }

  private async getAllMediaFiles() {
    return (await Content.ut.listFiles({ limit: 2000 })).files;
  }

  public async updateMedia(files: MediaFile[]): Promise<MediaMap> {
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

    const newFileUploads: UploadFileResult[] = [];
    const chunks = chunk(filesThatChanged, 20);
    for (const chunk of chunks) {
      const results = await Content.ut.uploadFiles(
        chunk.map((f) => {
          const file: File & { customId?: string } = f.file;
          file.customId = f.hash;
          return file;
        }),
      );
      newFileUploads.push(...results);
      await wait(5000);
    }

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
    };
  }

  public async updateBlogPosts(blogPosts: BlogPost[]) {
    await Content.db
      .update(contentSchema.blogPosts)
      .set({ status: "outdated" })
      .where(eq(contentSchema.blogPosts.status, "current"));

    await Content.db
      .insert(contentSchema.blogPosts)
      .values(
        await Promise.all(
          blogPosts.map((doc) => this.makeDocument(doc, "blog")),
        ),
      )
      .onConflictDoUpdate({
        target: contentSchema.blogPosts.hash,
        set: { status: "current" },
      });
  }

  public async updateQuestionBank(content: QuestionBank, source: string) {
    const db = Content.db;
    for (const [key, data] of Object.entries(content)) {
      const docs = await Promise.all(
        data.map((v) => this.makeDocument(v, source)),
      );

      const schema = contentSchema[key as keyof ContentSchema];
      if (!schema) throw new Error(`${key} is not a valid QB entity`);
      if (!docs.length) continue;

      const castSchema = schema as ContentSchema["annexes"];
      const docsInChunks = chunk(docs, 10000);

      for (const docsChunk of docsInChunks) {
        await Content.db
          .update(castSchema)
          .set({ status: "outdated" })
          .where(eq(castSchema.status, "current"));

        await db
          .insert(castSchema)
          .values(docsChunk)
          .onConflictDoUpdate({
            target: castSchema.hash,
            set: { status: "current" },
          });
      }
    }
  }
}
