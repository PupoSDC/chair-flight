import { z } from "zod";
import { questionBanks } from "@chair-flight/core/question-bank";
import {
    questionBankNameSchema as questionBank,
} from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import { serialize } from "next-mdx-remote/serialize";
import type {  QuestionBankName } from "@chair-flight/base/types";

const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;

type Path = {
    params: {
        questionBank: QuestionBankName,
        docId: string
    }
};

export const questionBankDocsRouter = router({
    getAllDocPaths: publicProcedure
        .query(async () => {
            const bankNames : QuestionBankName[] = ["atpl"]; 
            const paths : Path[] = [];
            for (const questionBank of bankNames) {
                const qb = questionBanks[questionBank];
                const docs = await qb.getAll("docs");
                paths.push(...docs.map(doc => ({ 
                    params: {
                        docId: doc.id, 
                        questionBank 
                    }
                })));
            }
            return { paths }
        }),
    getDoc: publicProcedure
        .input(z.object({ questionBank, docId: z.string() }))
        .query(async ({ input }) => {
            const qb = questionBanks[input.questionBank];
            const rawDoc = await qb.getOne("docs", input.docId);
            const content =rawDoc.content;
            const sourceString = content.replaceAll(MATCH_CODE_BLOCKS, "$1");
            const mdxSource = await serialize(sourceString);
            const doc = {
                title: rawDoc.title,
                description: "....",
                mdxSource,
                learningObjective: rawDoc.learningObjectiveId,
                href: `/modules/${questionBank}/docs/${rawDoc.id}`,
            }    
            return { doc };
        })
});
