import { Box, Stack } from "@mui/joy";
import { ssrHandler } from "@cf/trpc/server";
import { AppHead } from "../../_components/app-head";
import { AppPublicFooter } from "../../_components/app-public-footer";
import { AppPublicHeader } from "../../_components/app-public-header";
import { DocContent } from "../../_containers/doc-content";
import { DocRootNavigation } from "../../_containers/doc-root-navigation";
import type { DocId } from "@cf/core/content";
import type { NextPage } from "next";

type QueryParams = {
  tab?: string;
};

type PageParams = QueryParams & {
  docId: DocId;
  title: string;
  linkTitle: string;
  description: string;
};

type PageProps = Required<PageParams>;

const Page: NextPage<PageProps> = ({
  docId,
  title,
  linkTitle,
  description,
}) => {
  return (
    <>
      <AppHead
        title={title}
        linkTitle={linkTitle}
        linkDescription={description}
      />
      <AppPublicHeader />
      <Box
        display={{ xs: "flex", md: "grid" }}
        gridTemplateColumns="minmax(200px, 1fr) minmax(0, 3.5fr) minmax(250px, 1fr) "
      >
        <Stack
          borderRight="1px solid"
          borderColor="neutral.outlinedBorder"
          width="100%"
          display={{ xs: "none", md: "flex" }}
          minHeight={"calc(100vh - 48px)"}
        >
          <DocRootNavigation docId={docId} />
        </Stack>
        <Stack>
          <Stack
            component={"main"}
            justifyContent="flex-start"
            width="100%"
            maxWidth="md"
            mx="auto"
            flex={1}
            p={2}
            minHeight={"calc(100vh - 256px)"}
          >
            <DocContent docId={docId} />
          </Stack>
          <AppPublicFooter />
        </Stack>
        <Box></Box>
      </Box>
    </>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper, context }) => {
    const id = params.docId;
    const tab = (context.query?.["tab"] ?? "question") as string;

    const [{ doc }] = await Promise.all([
      helper.questionBank.docs.getDoc.fetch({ id }),
      helper.questionBank.docs.getDocToc.fetch({ id }),
    ]);

    const title = doc.title;
    const linkTitle = `Chair FLight: ${doc.title}`;
    const description = "";

    const allParams = { ...params, tab, title, linkTitle, description };
    return { props: allParams };
  },
);

export default Page;
