import { useRouter } from "next/router";
import { MissingPathParameter } from "@chair-flight/base/errors";
import type { QuestionBankName } from "@chair-flight/base/types";
import {
  getQuestionPreview,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import {
  AppHead,
  LayoutModuleBank,
  QuestionOverview,
} from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type QuestionPageParams = {
  seed?: string;
  questionId?: string;
  variantId?: string;
  questionBank?: QuestionBankName;
};

type QuestionPageProps = {
  initialVariantId: string;
  initialQuestionId: string;
  initialQuestionBank: QuestionBankName;
  initialSeed: string;
  linkDescription: string;
};

const QuestionPage: NextPage<QuestionPageProps> = ({
  initialVariantId,
  initialQuestionId,
  initialQuestionBank,
  initialSeed,
  linkDescription,
}) => {
  const router = useRouter();
  const query = router.query as QuestionPageParams;
  const seed = query.seed ?? initialSeed;
  const variantId = query.variantId ?? initialVariantId;
  const questionBank = query.questionBank ?? initialQuestionBank;

  const updateVariantAndSeed = (query: { variantId: string; seed: string }) => {
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <LayoutModuleBank questionBank={questionBank} noPadding>
      <AppHead
        linkTitle={`Chair Flight: ${variantId}`}
        linkDescription={linkDescription}
      />
      <QuestionOverview
        component={"section"}
        questionBank={questionBank}
        questionId={initialQuestionId}
        variantId={variantId}
        seed={seed}
        onQuestionChanged={updateVariantAndSeed}
      />
    </LayoutModuleBank>
  );
};

export const getServerSideProps = ssrHandler<
  QuestionPageProps,
  QuestionPageParams
>(async ({ params, helper, context }) => {
  const { questionId, questionBank } = params;
  if (!questionId) throw new MissingPathParameter("questionId");
  if (!questionBank) throw new MissingPathParameter("questionBank");
  const variantIdFromQuery = context.query?.["variantId"] as string;
  const initialSeed = (context.query?.["seed"] ?? getRandomId()) as string;
  const initialQuestionId = questionId;
  const shuffle = getRandomShuffler("123");

  const { questionTemplate } = await helper.questionBank.getQuestion.fetch({
    questionId,
    questionBank,
  });

  const initialVariantId = questionTemplate.variants[variantIdFromQuery]
    ? variantIdFromQuery
    : shuffle(Object.values(questionTemplate.variants))[0].id;

  const linkDescription = getQuestionPreview(
    questionTemplate,
    initialVariantId,
  );

  return {
    props: {
      initialVariantId,
      initialQuestionId,
      initialQuestionBank: questionBank,
      initialSeed,
      linkDescription,
      trpcState: helper.dehydrate(),
    },
  };
});

export default QuestionPage;
