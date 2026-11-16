import * as fs from "node:fs/promises";
import * as path from "node:path";
import { isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as YAML from "yaml";
import {
  a320Annexes,
  a320Chapters,
  a320Questions,
  a320QuestionsToAnnexes,
  a320QuestionsToQuestions,
} from "../database/schema/module-a320.ts";
import {
  atplAnnexes,
  atplCourses,
  atplDocs,
  atplLearningObjectiveCourses,
  atplLearningObjectives,
  atplQuestionLearningObjectives,
  atplQuestions,
  atplQuestionsToAnnexes,
  atplQuestionsToExternalIds,
  atplQuestionsToQuestions,
  atplSubjects,
} from "../database/schema/module-atpl.ts";
import {
  b737Annexes,
  b737Chapters,
  b737Questions,
  b737QuestionsToAnnexes,
  b737QuestionsToQuestions,
} from "../database/schema/module-b737.ts";
import { prepFlashcards } from "../database/schema/module-prep.ts";
import { readEnv } from "../libs/base/read-env.ts";
import type { QuestionTemplate } from "../libs/core/question-templates/question-template.ts";

const DOWNLOAD_CONCURRENCY = 8;

const db = drizzle(postgres(readEnv("DATABASE_URL"), { prepare: false }));

const sortById = <T extends { id: string }>(rows: T[]) =>
  [...rows].sort((a, b) => a.id.localeCompare(b.id));

const groupBy = <T>(rows: T[], getKey: (row: T) => string) =>
  rows.reduce((groups, row) => {
    const key = getKey(row);
    return groups.set(key, [...(groups.get(key) ?? []), row]);
  }, new Map<string, T[]>());

const writeFile = async (file: string, content: string) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
};

const writeYaml = (file: string, value: unknown) =>
  writeFile(file, YAML.stringify(value));

const resetFolder = async (folder: string) => {
  await fs.rm(folder, { recursive: true, force: true });
  await fs.mkdir(folder, { recursive: true });
};

const writeDoc = (
  file: string,
  frontMatter: Record<string, string | null>,
  content: string,
) => {
  const data = Object.fromEntries(
    Object.entries(frontMatter).filter(([, value]) => value),
  );
  return writeFile(
    file,
    `---\n${YAML.stringify(data)}---\n\n${content.trim()}\n`,
  );
};

const downloadAnnexes = async (
  folder: string,
  annexes: { id: string; href: string; format: string }[],
) => {
  const wanted = new Set(annexes.map(({ id, format }) => `${id}.${format}`));
  const existing = await fs.readdir(folder).catch(() => [] as string[]);
  await Promise.all(
    existing
      .filter((file) => file !== "annexes.yaml" && !wanted.has(file))
      .map((file) => fs.rm(path.join(folder, file))),
  );
  const missing = annexes.filter(
    ({ id, format }) => !existing.includes(`${id}.${format}`),
  );
  const remote = missing.filter(({ href }) => /^https?:/.test(href));
  console.info(
    `${folder}: ${remote.length} annexes to download, ${missing.length - remote.length} missing locally and not downloadable`,
  );
  for (let from = 0; from < remote.length; from += DOWNLOAD_CONCURRENCY) {
    await Promise.all(
      remote.slice(from, from + DOWNLOAD_CONCURRENCY).map(async (annex) => {
        const response = await fetch(annex.href);
        if (!response.ok) {
          throw new Error(`${annex.href}: ${response.status}`);
        }
        await fs.writeFile(
          path.join(folder, `${annex.id}.${annex.format}`),
          Buffer.from(await response.arrayBuffer()),
        );
      }),
    );
  }
};

const pullAnnexes = async (
  root: string,
  annexes: {
    id: string;
    href: string;
    format: string;
    description: string;
    source: string;
  }[],
) => {
  const folder = path.join(root, "annexes");
  await writeYaml(
    path.join(folder, "annexes.yaml"),
    sortById(annexes).map(({ id, format, description, source }) => ({
      id,
      format,
      description,
      source,
    })),
  );
  await downloadAnnexes(folder, annexes);
};

const createAnnexLinkRestorer = (annexes: { id: string; href: string }[]) => {
  const longestHrefFirst = [...annexes].sort(
    (a, b) => b.href.length - a.href.length,
  );
  return (text: string) =>
    longestHrefFirst.reduce(
      (result, { id, href }) => result.replaceAll(`(${href})`, `(annex:${id})`),
      text,
    );
};

const listRelations = <T extends Record<string, string>>(
  rows: T[],
  from: keyof T,
  to: keyof T,
) =>
  new Map(
    [...groupBy(rows, (row) => row[from])].map(([key, group]) => [
      key,
      group.map((row) => row[to]).sort(),
    ]),
  );

const pullAtpl = async () => {
  const root = path.join("content", "question-bank-atpl");
  const [
    subjects,
    courses,
    docs,
    learningObjectives,
    learningObjectiveCourses,
    questions,
    questionExternalIds,
    questionLearningObjectives,
    relatedQuestions,
    annexes,
    questionAnnexes,
  ] = await Promise.all([
    db.select().from(atplSubjects),
    db.select().from(atplCourses),
    db.select().from(atplDocs),
    db.select().from(atplLearningObjectives),
    db.select().from(atplLearningObjectiveCourses),
    db.select().from(atplQuestions).where(isNull(atplQuestions.removedAt)),
    db.select().from(atplQuestionsToExternalIds),
    db.select().from(atplQuestionLearningObjectives),
    db.select().from(atplQuestionsToQuestions),
    db.select().from(atplAnnexes),
    db.select().from(atplQuestionsToAnnexes),
  ]);
  const restoreAnnexLinks = createAnnexLinkRestorer(annexes);

  await writeYaml(
    path.join(root, "content", "subjects.yaml"),
    sortById(subjects),
  );
  await writeYaml(
    path.join(root, "content", "courses.yaml"),
    sortById(courses),
  );

  const coursesByLearningObjective = listRelations(
    learningObjectiveCourses,
    "learningObjectiveId",
    "courseId",
  );
  await writeYaml(
    path.join(root, "content", "learning-objectives.yaml"),
    sortById(learningObjectives).map((learningObjective) => ({
      ...learningObjective,
      courses: coursesByLearningObjective.get(learningObjective.id) ?? [],
    })),
  );

  await resetFolder(path.join(root, "docs"));
  await Promise.all(
    docs.map((doc) =>
      writeDoc(
        path.join(root, "docs", `${doc.id}.md`),
        {
          id: doc.id,
          parent: doc.parentId,
          subject: doc.subject,
          title: doc.title,
          description: doc.description,
        },
        restoreAnnexLinks(doc.content),
      ),
    ),
  );

  const externalIdsByQuestion = listRelations(
    questionExternalIds,
    "questionId",
    "externalId",
  );
  const learningObjectivesByQuestion = listRelations(
    questionLearningObjectives,
    "questionId",
    "learningObjectiveId",
  );
  const activeQuestionIds = new Set(questions.map((question) => question.id));
  const relatedByQuestion = listRelations(
    relatedQuestions.filter((row) =>
      activeQuestionIds.has(row.relatedQuestionId),
    ),
    "questionId",
    "relatedQuestionId",
  );
  const annexesByQuestion = listRelations(
    questionAnnexes,
    "questionId",
    "annexId",
  );
  await resetFolder(path.join(root, "questions"));
  await Promise.all(
    [
      ...groupBy(questions, (question) =>
        question.docId.split(".").slice(0, 2).join("."),
      ),
    ].map(([group, rows]) =>
      writeYaml(
        path.join(root, "questions", `${group}.yaml`),
        sortById(rows).map((question) => ({
          id: question.id,
          docId: question.docId,
          relatedQuestions: relatedByQuestion.get(question.id) ?? [],
          externalIds: externalIdsByQuestion.get(question.id) ?? [],
          annexes: annexesByQuestion.get(question.id) ?? [],
          learningObjectives:
            learningObjectivesByQuestion.get(question.id) ?? [],
          template: {
            ...question.template,
            explanation: restoreAnnexLinks(question.template.explanation),
          },
        })),
      ),
    ),
  );
  await pullAnnexes(root, annexes);
  console.info(`atpl: ${questions.length} questions, ${docs.length} docs`);
};

const pullChapterBank = async (
  questionBank: "a320" | "b737",
  tables: {
    chapters: typeof a320Chapters | typeof b737Chapters;
    questions: typeof a320Questions | typeof b737Questions;
    related: typeof a320QuestionsToQuestions | typeof b737QuestionsToQuestions;
    annexes: typeof a320Annexes | typeof b737Annexes;
    questionAnnexes:
      | typeof a320QuestionsToAnnexes
      | typeof b737QuestionsToAnnexes;
  },
) => {
  const root = path.join("content", `question-bank-${questionBank}`);
  const [chapters, questions, relatedQuestions, annexes, questionAnnexes] =
    (await Promise.all([
      db.select().from(tables.chapters),
      db.select().from(tables.questions),
      db.select().from(tables.related),
      db.select().from(tables.annexes),
      db.select().from(tables.questionAnnexes),
    ])) as [
      { id: string; title: string; content?: string }[],
      {
        id: string;
        chapter: string;
        template: QuestionTemplate;
      }[],
      { questionId: string; relatedQuestionId: string }[],
      {
        id: string;
        href: string;
        format: string;
        description: string;
        source: string;
      }[],
      { questionId: string; annexId: string }[],
    ];
  const restoreAnnexLinks = createAnnexLinkRestorer(annexes);
  const previousMap = YAML.parse(
    await fs
      .readFile(path.join(root, "content-map.yaml"), "utf-8")
      .catch(() => "{}"),
  ) as { exam?: { questions: number; minutes: number } };

  await resetFolder(path.join(root, "docs"));
  await Promise.all(
    chapters
      .filter((chapter) => chapter.content)
      .map((chapter) =>
        writeDoc(
          path.join(root, "docs", `${questionBank}.${chapter.id}.md`),
          { id: `${questionBank}.${chapter.id}`, title: chapter.title },
          restoreAnnexLinks(chapter.content ?? ""),
        ),
      ),
  );
  await writeYaml(path.join(root, "content-map.yaml"), {
    ...(previousMap.exam ? { exam: previousMap.exam } : {}),
    chapters: sortById(chapters).map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      ...(chapter.content ? { page: `${questionBank}.${chapter.id}` } : {}),
    })),
  });

  const relatedByQuestion = listRelations(
    relatedQuestions,
    "questionId",
    "relatedQuestionId",
  );
  const annexesByQuestion = listRelations(
    questionAnnexes,
    "questionId",
    "annexId",
  );
  await resetFolder(path.join(root, "questions"));
  await Promise.all(
    [...groupBy(questions, (question) => question.chapter)].map(
      ([chapter, rows]) =>
        writeYaml(
          path.join(root, "questions", `${chapter}.yaml`),
          sortById(rows).map((question) => ({
            id: question.id,
            relatedQuestions: relatedByQuestion.get(question.id) ?? [],
            annexes: annexesByQuestion.get(question.id) ?? [],
            chapter: question.chapter,
            template: {
              ...question.template,
              explanation: restoreAnnexLinks(question.template.explanation),
            },
          })),
        ),
    ),
  );
  await pullAnnexes(root, annexes);
  console.info(`${questionBank}: ${questions.length} questions`);
};

const pullPrep = async () => {
  const folder = path.join("content", "question-bank-prep", "flashcards");
  const flashcards = await db.select().from(prepFlashcards);
  await resetFolder(folder);
  await Promise.all(
    [...groupBy(flashcards, (card) => card.collectionId)].map(
      ([collectionId, cards]) =>
        writeFile(
          path.join(folder, `${collectionId}.json`),
          `${JSON.stringify(
            sortById(cards).map(({ id, question, answer }) => ({
              id,
              question,
              answer,
            })),
            null,
            2,
          )}\n`,
        ),
    ),
  );
  console.info(`prep: ${flashcards.length} flashcards`);
};

try {
  await pullAtpl();
  await pullChapterBank("a320", {
    chapters: a320Chapters,
    questions: a320Questions,
    related: a320QuestionsToQuestions,
    annexes: a320Annexes,
    questionAnnexes: a320QuestionsToAnnexes,
  });
  await pullChapterBank("b737", {
    chapters: b737Chapters,
    questions: b737Questions,
    related: b737QuestionsToQuestions,
    annexes: b737Annexes,
    questionAnnexes: b737QuestionsToAnnexes,
  });
  await pullPrep();
  console.info("Content pulled.");
} finally {
  await db.$client.end();
}
