import { makeMap } from "@chair-flight/base/utils";
import { Annex, Doc, QuestionTemplate } from "../types";
import { s } from "vitest/dist/reporters-rzC174PQ";


export const arrangeQuestions = ({
    questionTemplates,
    docs,
} : {
    questionTemplates: QuestionTemplate[],
    docs: Doc[],
}) => {
    const docsMap = makeMap(docs, doc => doc.id);
    
    const questionFiles = questionTemplates.reduce((sum, qt) => {
        const file = docsMap[qt.doc];
        const fileName = file.fileName.replace("page.md", "questions.json");
        sum[fileName] ??= [];
        sum[fileName].push(qt);
        return sum;
    }, {} as Record<string, QuestionTemplate[]> ); 
    
    return questionFiles;
}

export const arrangeAnnexes = ({
    annexes,
    docs,
    annexRoot,
} : {
    annexes: Annex[],
    docs: Doc[],
    annexRoot: string,
}) => {
    const docsMap = makeMap(docs, doc => doc.id);

    const annexFiles = annexes.reduce((sum, annex) => {
        const cleanAnnex = {
            id: annex.id,
            description: annex.description,
            format: annex.format,
        }

        if (annex.doc  === "root") {
            const fileName = annexRoot;
            sum[fileName] ??= [];
            sum[fileName].push(cleanAnnex);
        } else {
            const file = docsMap[annex.doc];
            const fileName = file.fileName.replace("page.md", "annexes.json");
            sum[fileName] ??= [];
            sum[fileName].push(cleanAnnex);
        }
        return sum;
    }, {} as Record<string, Pick<Annex, "id" | "description" | "format">[]>);

    return annexFiles;
}