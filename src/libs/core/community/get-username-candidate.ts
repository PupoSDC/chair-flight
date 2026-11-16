export const getUsernameCandidate = (name: string) => {
  const candidate = name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 16);
  return candidate.length >= 3 ? candidate : "pilot";
};
