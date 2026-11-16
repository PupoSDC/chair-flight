const REFERENCE_MATCH = /\b\d{3}(?:[ .]\d{2}){0,4}\b/g;

export const findLearningObjectiveReferences = (text: string) =>
  Array.from(text.matchAll(REFERENCE_MATCH), (match) =>
    match[0].replaceAll(" ", ".").replace(/(\.00)+$/, ""),
  );
