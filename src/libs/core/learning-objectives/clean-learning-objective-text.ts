const LIST_LEAD_IN_MATCH = /following|including|specifically|except/i;
const SOURCE_SUFFIX_MATCH = /\s*\bSource:\s*([\s\S]*)$/;
const TITLE_SOURCE_SUFFIX_MATCH =
  /\s+-\s+ICAO Doc 7300\/9\s+-\s+Convention on the High Seas.*$/;
const HEADING_REMARK_MATCH = /\s*\bRemark:[\s\S]*$/;
const SENTENCE_BREAK_MATCH = /[a-z)]\.\s+[A-Z]/;
const MAX_COMMA_ITEM_LENGTH = 80;

const splitAtTopLevel = (text: string, separator: string) => {
  const depthsAfter = text.split("").reduce<number[]>((depths, character) => {
    const depth = depths.at(-1) ?? 0;
    const change = character === "(" ? 1 : character === ")" ? -1 : 0;
    depths.push(Math.max(0, depth + change));
    return depths;
  }, []);
  const cuts = [
    -1,
    ...text
      .split("")
      .flatMap((character, index) =>
        character === separator && (depthsAfter[index - 1] ?? 0) === 0
          ? [index]
          : [],
      ),
    text.length,
  ];
  return cuts.slice(1).map((cut, index) => text.slice(cuts[index] + 1, cut));
};

const findTopLevelColon = (text: string) => {
  const colonIndex = splitAtTopLevel(text, ":")[0].length;
  return colonIndex < text.length ? colonIndex : -1;
};

const normaliseWhitespace = (text: string) =>
  text
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replace(/[   \t]/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/ +([,;:.)])/g, "$1")
    .replace(/\( +/g, "(")
    .trim();

const cleanListItem = (item: string) =>
  item
    .trim()
    .replace(/^(and|or)\s+/i, "")
    .replace(/[.;,\s]+$/, "");

const toBulletList = (lead: string, items: string[]) =>
  `${lead}\n\n${items.map((item) => `- ${item}`).join("\n")}`;

const bulletiseText = (text: string) => {
  if (text.includes("\n")) return text;
  const colonIndex = findTopLevelColon(text);
  if (colonIndex < 0) return text;
  const lead = text.slice(0, colonIndex + 1);
  const rest = text.slice(colonIndex + 1).trim();
  const semicolonItems = splitAtTopLevel(rest, ";")
    .map(cleanListItem)
    .filter(Boolean);
  const itemsContainSentences = semicolonItems.some((item) =>
    SENTENCE_BREAK_MATCH.test(item),
  );
  if (semicolonItems.length >= 2 && itemsContainSentences) return text;
  if (semicolonItems.length >= 2) {
    const itemsWithColon = semicolonItems.filter((item) =>
      item.includes(":"),
    ).length;
    const nestedList =
      itemsWithColon > 0 && itemsWithColon < semicolonItems.length;
    return nestedList ? text : toBulletList(lead, semicolonItems);
  }
  if (!LIST_LEAD_IN_MATCH.test(lead) || rest.includes(":")) return text;
  const commaItems = splitAtTopLevel(rest, ",")
    .map(cleanListItem)
    .filter(Boolean);
  const itemsAreShort = commaItems.every(
    (item) => item.length <= MAX_COMMA_ITEM_LENGTH,
  );
  return commaItems.length >= 3 && itemsAreShort
    ? toBulletList(lead, commaItems)
    : text;
};

export const cleanLearningObjectiveText = (
  rawText: string,
  options: { heading: boolean },
) => {
  const sourceMatch = SOURCE_SUFFIX_MATCH.exec(rawText);
  const withoutSource = sourceMatch
    ? rawText.slice(0, sourceMatch.index)
    : rawText;
  const text = normaliseWhitespace(withoutSource).replace(
    TITLE_SOURCE_SUFFIX_MATCH,
    "",
  );
  return {
    text: options.heading
      ? text.replace(HEADING_REMARK_MATCH, "").replace(/\.$/, "")
      : bulletiseText(text),
    inlineSource: sourceMatch ? normaliseWhitespace(sourceMatch[1]) : "",
  };
};
