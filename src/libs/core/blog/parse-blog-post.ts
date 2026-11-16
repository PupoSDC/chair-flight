import * as YAML from "yaml";

const FRONT_MATTER_MATCH = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const COMPONENT_MATCH = /^\s*<\/?[A-Z][\s\S]*?>\s*$/gm;
const IMPORT_MATCH = /^(import|export) .*$/gm;

export const parseBlogPost = (id: string, source: string) => {
  const match = FRONT_MATTER_MATCH.exec(source);
  const data = match ? YAML.parse(match[1]) : {};
  return {
    id,
    title: String(data.title ?? id),
    date: String(data.date ?? ""),
    tag: String(data.tag ?? ""),
    description: String(data.description ?? "").trim(),
    content: source
      .slice(match?.[0].length ?? 0)
      .replaceAll(IMPORT_MATCH, "")
      .replaceAll(COMPONENT_MATCH, "")
      .trim(),
  };
};
