import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as zlib from "node:zlib";
import * as YAML from "yaml";
import { bubbleLearningObjectiveCourses } from "../libs/core/learning-objectives/bubble-learning-objective-courses.ts";
import { linkLearningObjectiveVersions } from "../libs/core/learning-objectives/link-learning-objective-versions.ts";
import { parseLearningObjectiveSheet } from "../libs/core/learning-objectives/parse-learning-objective-sheet.ts";
import { pushDownLearningObjectiveSources } from "../libs/core/learning-objectives/push-down-learning-objective-sources.ts";
import { splitLearningObjectiveText } from "../libs/core/learning-objectives/split-learning-objective-text.ts";

const CENTRAL_DIRECTORY_ENTRY = 0x02014b50;
const EXTERNAL_FOLDER = "content/question-bank-atpl/external";
const OUTPUT_FOLDER = "content/question-bank-atpl/learning-objectives";

const COURSE_COLUMNS = {
  "ATPL(A)": "ATPL_A",
  "CPL(A)": "CPL_A",
  "ATPL(H)/IR": "ATPL_H_IR",
  "ATPL(H)/VFR": "ATPL_H_VFR",
  "CPL(H)": "CPL_H",
  IR: "IR",
  "CBIR(A)": "CBIR_A",
};

const COURSE_IDS_V2 = [
  "ATPL_A",
  "CPL_A",
  "ATPL_H_IR",
  "ATPL_H_VFR",
  "CPL_H",
  "IR",
  "CBIR_A",
];

const SYLLABUS_2020_COLUMNS = {
  reference: "2020 syllabus reference",
  text: "2020 syllabus text",
  courses: COURSE_COLUMNS,
};

const VERSIONS = [
  {
    id: "v1",
    name: "2016 · v1",
    description:
      "The syllabus and learning objectives published in 2016, read from the old columns of TK Syllabus Comparison Document v2.",
    file: "tk-syllabus-comparison-doc-v2.xlsx",
    columns: {
      reference: "Old syllabus reference",
      text: /^Old syllabus (text|details)$/,
      linkedReferences: "New syllabus reference",
    },
    matching: "direct" as const,
  },
  {
    id: "v2",
    name: "2018-19 · v2",
    description:
      "The syllabus and learning objectives published in 2018 and 2019, as listed in TK Syllabus Comparison Document v2.",
    file: "tk-syllabus-comparison-doc-v2.xlsx",
    columns: {
      reference: "New syllabus reference",
      text: /^New syllabus (text|details)$/,
      linkedReferences: "Old syllabus reference",
      coursesAfter: {
        header: /^Reworded, intent modified$/,
        courseIds: COURSE_IDS_V2,
      },
    },
    matching: "direct" as const,
  },
  {
    id: "v3",
    name: "2020 · v3",
    description:
      "The 2020 syllabus and learning objectives as listed in TK Syllabus Comparison Document v3, which added the Basic Instrument Rating.",
    file: "tk-syllabus-comparison-doc-v3.xlsx",
    columns: {
      ...SYLLABUS_2020_COLUMNS,
      linkedReferences: "2018-2019 syllabus reference",
      source: /^Source \/ Comment/,
    },
    matching: "direct" as const,
  },
  {
    id: "v4",
    name: "2020 · v4",
    description:
      "The 2020 syllabus and learning objectives as listed in TK Syllabus Comparison Document v4, with provisions for ECQB 2022 amendment 4.",
    file: "tk-syllabus-comparison-doc-v4.xlsx",
    columns: {
      ...SYLLABUS_2020_COLUMNS,
      linkedReferences: "2020 syllabus reference",
      source: /am(d\.|endment) 4/,
    },
    matching: "direct" as const,
  },
  {
    id: "v5",
    name: "2020 · v5",
    description:
      "The 2020 syllabus and learning objectives as listed in TK Syllabus Comparison Document v5, with provisions for ECQB 2024.",
    file: "tk-syllabus-comparison-doc-v5.xlsx",
    columns: {
      ...SYLLABUS_2020_COLUMNS,
      linkedReferences: "2020 syllabus reference",
      source: /^Source \/ Comment/,
    },
    matching: "direct" as const,
  },
  {
    id: "v6",
    name: "2020 · v6",
    description:
      "The 2020 syllabus and learning objectives as listed in TK Syllabus Comparison Document v6, with provisions for ECQB 2026.",
    file: "tk-syllabus-comparison-doc-v6.xlsx",
    columns: {
      ...SYLLABUS_2020_COLUMNS,
      linkedReferences: "2020 syllabus reference",
      source: /^Source \/ Comment/,
    },
    matching: "direct" as const,
  },
];

const readZipEntries = (buffer: Buffer) => {
  const endOffset = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (endOffset < 0) throw new Error("Not a valid zip file.");
  const entryCount = buffer.readUInt16LE(endOffset + 10);
  const directoryOffset = buffer.readUInt32LE(endOffset + 16);
  const entries = new Map<string, Buffer>();
  let cursor = directoryOffset;
  for (let index = 0; index < entryCount; index++) {
    if (buffer.readUInt32LE(cursor) !== CENTRAL_DIRECTORY_ENTRY) {
      throw new Error("Corrupt zip central directory.");
    }
    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString("utf8", cursor + 46, cursor + 46 + nameLength);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const data = buffer.subarray(dataStart, dataStart + compressedSize);
    entries.set(name, method === 0 ? data : zlib.inflateRawSync(data));
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
};

const decodeXml = (value: string) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/_x([0-9a-f]{4})_/gi, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");

const readTextRuns = (xml: string) =>
  Array.from(
    xml
      .replace(/<rPh[\s\S]*?<\/rPh>/g, "")
      .matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>|<t\s*\/>/g),
    (match) => decodeXml(match[1] ?? ""),
  ).join("");

const readSharedStrings = (xml: string) =>
  Array.from(xml.matchAll(/<si>([\s\S]*?)<\/si>|<si\s*\/>/g), (match) =>
    readTextRuns(match[1] ?? ""),
  );

const columnIndexOf = (reference: string) =>
  Array.from(reference.replace(/\d+/g, "")).reduce(
    (total, letter) => total * 26 + letter.charCodeAt(0) - 64,
    0,
  ) - 1;

const readSheetRows = (xml: string, sharedStrings: string[]) =>
  Array.from(xml.matchAll(/<row\s[^>]*?>([\s\S]*?)<\/row>/g), (rowMatch) => {
    const cells: string[] = [];
    for (const cellMatch of rowMatch[1].matchAll(
      /<c\s([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g,
    )) {
      const attributes = cellMatch[1];
      const body = cellMatch[2] ?? "";
      const reference = /\br="([A-Z]+\d+)"/.exec(attributes)?.[1];
      if (!reference) continue;
      const type = /\bt="(\w+)"/.exec(attributes)?.[1];
      const rawValue = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1] ?? "";
      const value =
        type === "s"
          ? (sharedStrings[Number(rawValue)] ?? "")
          : type === "inlineStr"
            ? readTextRuns(body)
            : decodeXml(rawValue);
      cells[columnIndexOf(reference)] = value;
    }
    return Array.from(cells, (cell) => cell ?? "");
  });

const readXlsxWorkbook = async (filePath: string) => {
  const entries = readZipEntries(await fs.readFile(filePath));
  const readEntry = (name: string) => {
    const entry = entries.get(name);
    if (!entry) throw new Error(`Missing ${name} in ${filePath}.`);
    return entry.toString("utf8");
  };
  const sharedStrings = readSharedStrings(readEntry("xl/sharedStrings.xml"));
  const relationshipTargets = new Map(
    Array.from(
      readEntry("xl/_rels/workbook.xml.rels").matchAll(
        /<Relationship\s[^>]*>/g,
      ),
      (match) => [
        /\bId="([^"]*)"/.exec(match[0])?.[1] ?? "",
        /\bTarget="([^"]*)"/.exec(match[0])?.[1] ?? "",
      ],
    ),
  );
  return Array.from(
    readEntry("xl/workbook.xml").matchAll(/<sheet\s[^>]*\/>/g),
    (match) => {
      const name = decodeXml(/\bname="([^"]*)"/.exec(match[0])?.[1] ?? "");
      const relationshipId = /\br:id="([^"]*)"/.exec(match[0])?.[1] ?? "";
      const target = (relationshipTargets.get(relationshipId) ?? "").replace(
        /^\/?(xl\/)?/,
        "",
      );
      const rows = readSheetRows(readEntry(`xl/${target}`), sharedStrings);
      const width = Math.max(0, ...rows.map((row) => row.length));
      return {
        name,
        rows: rows.map((row) =>
          Array.from({ length: width }, (_, index) => row[index] ?? ""),
        ),
      };
    },
  );
};

const readVersion = async (version: (typeof VERSIONS)[number]) => {
  const workbook = await readXlsxWorkbook(
    path.join(EXTERNAL_FOLDER, version.file),
  );
  const releaseRow = workbook
    .find((sheet) => sheet.name === "Reader Instructions")
    ?.rows.find((row) => row[1] === "For ECQB release:");
  const results = workbook
    .filter((sheet) => /^\d{3}/.test(sheet.name))
    .map((sheet) =>
      parseLearningObjectiveSheet(sheet.rows, {
        ...version.columns,
        subject: sheet.name.slice(0, 3),
      }),
    );
  return {
    ...version,
    ecqbRelease: releaseRow?.[2] || null,
    entries: results.flatMap((result) => result.entries),
    skipped: results.reduce(
      (total, result) =>
        total + result.skipped.withoutReference + result.skipped.withoutText,
      0,
    ),
  };
};

const writeYaml = (file: string, value: unknown) =>
  fs.writeFile(path.join(OUTPUT_FOLDER, file), YAML.stringify(value));

const versions = await Promise.all(VERSIONS.map(readVersion));
const links = versions.slice(1).map((version, index) =>
  linkLearningObjectiveVersions({
    matching: version.matching,
    previous: { version: versions[index].id, entries: versions[index].entries },
    current: { version: version.id, entries: version.entries },
  }),
);
const rowsByVersion = versions.map((_version, index) => {
  const base = index === 0 ? links[0].previous : links[index - 1].current;
  const nextIdsById = new Map(
    (links[index]?.previous ?? []).map((row) => [row.id, row.nextIds]),
  );
  return pushDownLearningObjectiveSources(
    bubbleLearningObjectiveCourses(base),
  ).map((row) => ({
    ...row,
    ...splitLearningObjectiveText(row.text),
    nextIds: index === 0 ? row.nextIds : (nextIdsById.get(row.id) ?? []),
  }));
});

await fs.mkdir(OUTPUT_FOLDER, { recursive: true });
await writeYaml(
  "versions.yaml",
  versions.map((version, index) => ({
    id: version.id,
    position: index + 1,
    name: version.name,
    description: version.description,
    ecqbRelease: version.ecqbRelease,
    sourceFile: version.file,
    numberOfLearningObjectives: rowsByVersion[index].length,
  })),
);
for (const [index, version] of versions.entries()) {
  await writeYaml(`${version.id}.yaml`, rowsByVersion[index]);
  const changes = ["new", "unchanged", "renumbered", "reworded"].map(
    (change) =>
      `${rowsByVersion[index].filter((row) => row.change === change).length} ${change}`,
  );
  console.info(
    `${version.id}: ${rowsByVersion[index].length} entries (${changes.join(", ")}; ${rowsByVersion[index].filter((row) => row.nextIds.length === 0).length} without next; ${version.skipped} rows skipped)`,
  );
}
