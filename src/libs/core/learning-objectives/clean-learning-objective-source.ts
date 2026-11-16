const EDITORIAL_NOTE_MATCH =
  /^\d+ entr(y|ies) (is |are )?(added|amended|deleted)\b/i;

export const cleanLearningObjectiveSource = (rawSource: string) => {
  const lines = rawSource
    .replace(/[ \t]/g, " ")
    .split(/\r?\n|\r/)
    .map((line) =>
      line
        .replace(/ {2,}/g, " ")
        .replace(/[;\s]+$/, "")
        .trim(),
    )
    .filter((line) => line && !EDITORIAL_NOTE_MATCH.test(line));
  return lines.join("\n");
};
