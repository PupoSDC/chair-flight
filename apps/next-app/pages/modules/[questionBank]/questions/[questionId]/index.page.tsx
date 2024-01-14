import { useRouter } from "next/router";
import { MissingPathParameter } from "@chair-flight/base/errors";
import {
  getQuestionPreview,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, QuestionOverview } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { NextPage } from "next";

type PageParams = {
  seed?: string;
  questionId?: string;
  variantId?: string;
  questionBank?: QuestionBankName;
};

type PageProps = {
  initialVariantId: string;
  initialQuestionId: string;
  initialQuestionBank: QuestionBankName;
  initialSeed: string;
  linkDescription: string;
};

const Page: NextPage<PageProps> = ({
  initialVariantId,
  initialQuestionId,
  initialQuestionBank,
  initialSeed,
  linkDescription,
}) => {
  const router = useRouter();
  const query = router.query as PageParams;
  const seed = query.seed ?? initialSeed;
  const variantId = query.variantId ?? initialVariantId;
  const questionBank = query.questionBank ?? initialQuestionBank;

  const updateVariantAndSeed = (query: { variantId: string; seed: string }) => {
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <LayoutModule questionBank={questionBank} noPadding>
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
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper, context }) => {
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
  },
);

export default Page;
