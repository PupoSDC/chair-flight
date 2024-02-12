/**
 * A convenience type that represents MD documents.
 */
export type MdDocument = {
  mdContent: string;
};

/**
 * Note: This doesn't do anything since for now we only compile markdown on the
 * client.
 */
export const compileMarkdown = (content: string): MdDocument => ({
  mdContent: content,
});
