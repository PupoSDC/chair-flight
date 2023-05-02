export const chunck = <T>(arr: T[], numberOfChunks: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < numberOfChunks; i++) {
    chunks.push([]);
  }
  for (let i = 0; i < arr.length; i++) {
    chunks[i % numberOfChunks].push(arr[i]);
  }
  return chunks;
};
