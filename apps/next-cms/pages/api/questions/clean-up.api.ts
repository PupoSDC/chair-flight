import { apiHandler } from "@chair-flight/next/server";

export default apiHandler(
  {
    post: async ({ questionBank }) => {
      const questions = await questionBank.getAllQuestionTemplates();
      questions.forEach((question) => {
        Object.values(question.variants).forEach((variant) => {
          variant.externalIds = variant.externalIds.filter((id) => {
            // filter all not matching ATPLQ-* ATPLGS-* AVEX-* BGS-*
            return id.match(/^(ATPLQ|ATPLGS|AVEXAM|BGS)-/);
          });
        });
      });
      questionBank.writeQuestions(questions);
      return {
        status: "ok",
      };
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  },
);
