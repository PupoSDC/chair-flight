export const isLocalDatabase = (connectionString: string | undefined) => {
  if (!connectionString) return false;
  try {
    const { hostname } = new URL(connectionString);
    return ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  } catch {
    return false;
  }
};
