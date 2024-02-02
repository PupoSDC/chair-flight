import { useRouter } from "next/router";
import { getRandomId } from "@chair-flight/base/utils";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, QuestionOverview } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Breadcrumbs } from "@chair-flight/react/containers";
import type { NextPage } from "next";

type PageParams = {
  seed?: string;
  variantId?: string;
  questionBank: QuestionBankName;
  questionId: string;
};

type PageProps = {
  questionBank: QuestionBankName;
  questionId: string;
  seed: string;
};

const Page: NextPage<PageProps> = ({
  questionBank,
  questionId,
  seed: initialSeed,
}) => {
  const router = useRouter();
  const query = router.query as PageParams;
  const seed = query.seed ?? initialSeed;

  const updateSeed = (query: { seed: string }) => {
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  const crumbs = [
    [questionBank.toUpperCase(), `/modules/${questionBank}`],
    ["Questions", `/modules/${questionBank}/questions`],
    questionId,
  ] as Breadcrumbs;

  // const linkDescription = getQuestionPreview(
  //   questionTemplate,
  //   initialVariantId,
  // );

  return (
    <LayoutModule questionBank={questionBank} breadcrumbs={crumbs} noPadding>
      <AppHead
        linkTitle={`Chair Flight [${questionId}]`}
        linkDescription={""}
      />
      <QuestionOverview
        questionBank={questionBank}
        questionId={questionId}
        seed={seed}
        onQuestionChanged={updateSeed}
      />
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper, context }) => {
    const seed = (context.query?.["seed"] ?? getRandomId()) as string;
    const allParams = { ...params, seed };

    await Promise.all([
      LayoutModule.getData({ params: allParams, helper }),
      QuestionOverview.getData({ params: allParams, helper }),
    ]);

    return { props: allParams };
  },
);

export default Page;
