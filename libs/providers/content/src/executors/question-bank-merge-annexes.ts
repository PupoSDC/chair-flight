import type { Annex, AnnexId, QuestionTemplate } from "@cf/core/question-bank";

export const mergeAnnexes = (args: {
  questionTemplates: QuestionTemplate[];
  annexes: Annex[];
  merges: AnnexId[][];
}) => {
  let survivingAnnexes = args.annexes;
  let questions = JSON.stringify(args.questionTemplates);
  args.merges.forEach((merge) => {
    const [survivor, ...victims] = merge;
    survivingAnnexes = survivingAnnexes.filter(
      (annex) => annex.id !== survivor,
    );
    victims.forEach((victim) => {
      questions = questions.replaceAll(victim, survivor);
    });
  });
  return {
    questionTemplates: JSON.parse(questions) as QuestionTemplate[],
    annexes: survivingAnnexes,
  };
};
