const BULLET_LINE_MATCH = /^- /;

export const splitLearningObjectiveText = (markdown: string) => {
  const [lead, ...rest] = markdown.split("\n\n");
  const bulletLines = rest.join("\n").split("\n");
  const hasBullets =
    rest.length > 0 &&
    bulletLines.every((line) => BULLET_LINE_MATCH.test(line));
  if (hasBullets) {
    return {
      text: lead.replaceAll("\n", " "),
      items: bulletLines.map((line) => line.replace(BULLET_LINE_MATCH, "")),
    };
  }
  return { text: markdown.replace(/\s*\n+\s*/g, " "), items: [] as string[] };
};
