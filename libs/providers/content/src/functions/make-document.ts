import { sha256 } from "@cf/base/utils";

export const makeDocument = async <T extends { id: string }>(item: T) => ({
  hash: await sha256(JSON.stringify(item)),
  id: item.id,
  status: "current" as const,
  createdAt: new Date(),
  document: item,
});
