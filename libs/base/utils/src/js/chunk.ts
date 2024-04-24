export const chunk = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  const nChunks = Math.ceil(array.length / chunkSize);
  for (let i = 0; i < nChunks; i++) {
    chunks.push(array.slice(i * nChunks, (i + 1) * nChunks));
  }
  return chunks;
};
