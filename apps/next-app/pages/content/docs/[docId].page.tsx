import { default as NextLink } from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { Markdown } from "@cf/react/markdown";
import { ContentHeader, Ups } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import { ssrHandler } from "@cf/trpc/server";
import { CopyToClipboardButton } from "../../_components/app-buttons";
import { AppHead } from "../../_components/app-head";
import { LayoutPublic } from "../../_components/layout-public";
import type { DocId } from "@cf/core/content";
import type { NextPage } from "next";

type QueryParams = {
  tab?: string;
};

type PageParams = QueryParams & {
  docId: DocId;
};

type PageProps = Required<PageParams>;

const Page: NextPage<PageProps> = ({ docId, tab: initialTab }) => {
  const router = useRouter();

  const query = router.query as QueryParams;
  const tab = query.tab ?? initialTab;

  const [{ doc }] = trpc.questionBank.docs.getDoc.useSuspenseQuery({
    id: docId,
  });

  const isDocTab = tab === "doc";

  return (
    <LayoutPublic>
      <AppHead
        title={`${doc.title}`}
        linkTitle={`Chair FLight: ${doc.title}`}
      />
      <Stack direction={"row"} maxWidth={isDocTab ? "md" : "xl"} mx="auto">
        <Stack sx={{ flex: 1, mx: "auto" }}>
          <ContentHeader
            title={doc.title}
            sx={{ width: "100%" }}
            actions={
              <CopyToClipboardButton url={router.asPath} title={`Share Doc`} />
            }
            links={
              <>
                <Link
                  replace
                  disabled={tab === "doc" || !tab}
                  component={NextLink}
                  href={{ query: { ...router.query, tab: "doc" } }}
                  color="neutral"
                  level="body-sm"
                >
                  Doc
                </Link>
                <Divider orientation="vertical" />
                <Link
                  replace
                  disabled={tab === "questions"}
                  component={NextLink}
                  href={{ query: { ...router.query, tab: "questions" } }}
                  color="neutral"
                  level="body-sm"
                >
                  Questions
                </Link>
                <Divider orientation="vertical" />
                <Link
                  replace
                  disabled={tab === "related"}
                  component={NextLink}
                  href={{ query: { ...router.query, tab: "related" } }}
                  color="neutral"
                  level="body-sm"
                >
                  Related
                </Link>
                <Divider orientation="vertical" />
                <Link
                  replace
                  disabled={tab === "comments"}
                  component={NextLink}
                  href={{ query: { ...router.query, tab: "comments" } }}
                  color="neutral"
                  level="body-sm"
                >
                  Comments
                </Link>
              </>
            }
          />
          {doc.isEmpty ? (
            <Ups
              message="This Doc has not been written yet."
              children={
                <>
                  <Typography level="body-lg">
                    You can help chair flight grow by contributing to it!
                  </Typography>
                  <Link href={doc.links.github} level="body-sm">
                    Edit this page on Github
                  </Link>
                </>
              }
            />
          ) : (
            <Markdown>{doc.markdown}</Markdown>
          )}
        </Stack>
      </Stack>

      {doc.parent && (
        <Link href={doc.parent.href} children={doc.parent.title} />
      )}
    </LayoutPublic>
  );
};

export const getServerSideProps = ssrHandler<PageProps, PageParams>(
  async ({ params, helper, context }) => {
    const id = params.docId;
    const tab = (context.query?.["tab"] ?? "question") as string;
    const allParams = { ...params, tab };

    await helper.questionBank.docs.getDoc.fetch({ id });
    return { props: allParams };
  },
);

export default Page;
