import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { publicProcedure, router } from "../../config/trpc";
import { questionBanks } from "../../common/providers";

export const questionsRouter = router({
    getQuestionTemplate: publicProcedure
        .input(
            z.object({
                questionId: z.string(),
                questionBank: questionBankNameSchema,
            }),
        )
        .query(async ({ input }) => {
            const qb = questionBanks[input.questionBank];
            const question = await qb.getOne("questions", input.questionId);
            return { questionTemplate: question };
        }),
});
