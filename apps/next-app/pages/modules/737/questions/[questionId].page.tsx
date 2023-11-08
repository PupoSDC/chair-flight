import { useRouter } from "next/router";
import {
  getQuestionPreview,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import {
  AppHead,
  LayoutModule737,
  QuestionReview,
} from "@chair-flight/react/containers";
import { trpc } from "@chair-flight/trpc/client";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { NextPage } from "next";

type QuestionPageParams = {
  questionId: string;
};

type QuestionPageProps = {
  initialVariantId: string;
  initialQuestionId: string;
  initialSeed: string;
  linkDescription: string;
};

const QuestionPage: NextPage<QuestionPageProps> = ({
  initialVariantId,
  initialQuestionId,
  initialSeed,
  linkDescription,
}) => {
  const router = useRouter();
  const seed = (router.query["seed"] ?? initialSeed) as string;
  const variantId = (router.query["variantId"] ?? initialVariantId) as string;

  const updateVariantAndSeed = (query: { variantId: string; seed: string }) => {
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <LayoutModule737 slots={{ main: { sx: { p: 0 } } }}>
      <AppHead
        linkTitle={`Chair Flight: ${variantId}`}
        linkDescription={linkDescription}
      />
      <QuestionReview
        component={"section"}
        getQuestion={trpc.questionBank737.getQuestion}
        questionId={initialQuestionId}
        variantId={variantId}
        seed={seed}
        onQuestionChanged={updateVariantAndSeed}
      />
    </LayoutModule737>
  );
};

export const getServerSideProps = ssrHandler<
  QuestionPageProps,
  QuestionPageParams
>(async ({ params, helper, context }) => {
  const { questionId } = params;
  const variantIdFromQuery = context.query?.["variantId"] as string;
  const initialSeed = (context.query?.["seed"] ?? getRandomId()) as string;
  const initialQuestionId = questionId;
  const shuffle = getRandomShuffler("123");

  const { questionTemplate } = await helper.questionBank737.getQuestion.fetch({
    questionId,
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
      initialSeed,
      linkDescription,
      trpcState: helper.dehydrate(),
    },
  };
});

export default QuestionPage;
