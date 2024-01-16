import { useRouter } from "next/router";
import { getRandomId } from "@chair-flight/core/app";
import { AppHead } from "@chair-flight/react/components";
import { LayoutModule, QuestionOverview } from "@chair-flight/react/containers";
import { ssrHandler } from "@chair-flight/trpc/server";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { NextPage } from "next";

type PageParams = {
  seed?: string;
  variantId?: string;
  questionBank: QuestionBankName;
  questionId: string;
};

type PageProps = {
  seed?: string;
  variantId?: string;
  questionBank: QuestionBankName;
  questionId: string;
};

const Page: NextPage<PageProps> = ({
  seed: initialSeed,
  variantId: initialVariantId,
  questionBank,
  questionId,
}) => {
  const router = useRouter();
  const query = router.query as PageParams;
  const seed = query.seed ?? initialSeed;
  const variantId = query.variantId ?? initialVariantId;

  const updateVariantAndSeed = (query: { variantId: string; seed: string }) => {
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  // const linkDescription = getQuestionPreview(
  //   questionTemplate,
  //   initialVariantId,
  // );

  return (
    <LayoutModule questionBank={questionBank} noPadding>
      <AppHead linkTitle={`Chair Flight: ${variantId}`} linkDescription={""} />
      <QuestionOverview
        questionBank={questionBank}
        questionId={questionId}
        variantId={variantId}
        seed={seed}
        onQuestionChanged={updateVariantAndSeed}
      />
    </LayoutModule>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper, context }) => {
    const seed = (context.query?.["seed"] ?? getRandomId()) as string;
    const variantId = context.query?.["variantId"] as string | undefined;
    const allParams = { ...params, seed, variantId };

    await Promise.all([
      LayoutModule.getData({ params: allParams, helper }),
      QuestionOverview.getData({ params: allParams, helper }),
    ]);

    return { props: allParams };
  },
);

export default Page;
