import { and, eq, inArray } from "drizzle-orm";
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
  private static ut: UTApi | null;
  private static utSalt: string;
  protected static db: ContentDb;
  protected static schema = contentSchema;

  constructor() {
    const schema = contentSchema;
    const pgProvider = getEnvVariableOrThrow("PROVIDER_POSTGRES_CONTENT");
    const utSalt = getEnvVariableOrThrow("PROVIDER_UPLOADTHING_HASH_SALT");
    const utSecret = getEnvVariableOrThrow("PROVIDER_UPLOADTHING_SECRET");

    Content.ut ??= (() => {
      if (utSecret === "DISABLE") return null;
      return new UTApi({ apiKey: utSecret });
    })();

    Content.db ??= (() => {
      const client = new Client({ connectionString: pgProvider });
      const db = drizzle(client, { schema });
      client.connect();
      return db;
    })();

    Content.utSalt ??= utSalt;
  }

  private async makeDocument<T extends { id: string }>(
    document: T,
    source: string,
  ) {
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
    if (!Content.ut) return [];
    return (await Content.ut.listFiles({ limit: 2000 })).files;
  }

  private async fakeUpdateMedia(files: MediaFile[]): Promise<MediaMap> {
    return makeMap(
      files,
      (f) => f.id,
      () => "/placeholder.png",
    );
  }

  public async updateMedia(files: MediaFile[]): Promise<MediaMap> {
    if (!Content.ut) return this.fakeUpdateMedia(files);
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
      .update(Content.schema.blogPosts)
      .set({ status: "outdated" })
      .where(eq(Content.schema.blogPosts.status, "current"));

    await Content.db
      .insert(Content.schema.blogPosts)
      .values(
        await Promise.all(
          blogPosts.map((doc) => this.makeDocument(doc, "blog")),
        ),
      )
      .onConflictDoUpdate({
        target: Content.schema.blogPosts.hash,
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
      const docsInChunks = chunk(docs, 5000);

      for (const docsChunk of docsInChunks) {
        await Content.db
          .update(castSchema)
          .set({ status: "outdated" })
          .where(
            and(
              eq(castSchema.status, "current"),
              inArray(
                castSchema.id,
                docsChunk.map((d) => d.id),
              ),
            ),
          );

        await db
          .insert(castSchema)
          // TODO fix me !
          .values(docsChunk as any)
          .onConflictDoUpdate({
            target: castSchema.hash,
            set: { status: "current" },
          });
      }
    }
  }
}
