import { Box, Chip, Divider, Link, Stack, Typography } from "@mui/joy";
import { Mdx } from "@cf/react/markdown";
import { Ups } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import { container, getRequiredParam } from "@cf/trpc/client";
import type { DocId, QuestionBankName } from "@cf/core/question-bank";
import type { Container } from "@cf/trpc/client";
import type { AppRouterOutput } from "@cf/trpc/client";

type Props = {
  onLearningObjectivesOpen: () => void;
  onQuestionsOpen: () => void;
  questionBank: QuestionBankName;
  docId: DocId;
};

type Params = {
  questionBank: QuestionBankName;
  docId: DocId;
};

type Data = AppRouterOutput["containers"]["docs"]["getDocContent"];

export const DocContent: Container<Props, Params, Data> = container<
  Props,
  Params,
  Data
>(
  ({
    onLearningObjectivesOpen,
    onQuestionsOpen,
    questionBank,
    docId,
    sx,
    component = "div",
  }) => {
    const { doc } = DocContent.useData({ docId, questionBank });

    return (
      <Stack sx={sx} component={component}>
        {doc.parent && (
          <Link href={doc.parent.href} children={doc.parent.title} />
        )}
        <Typography
          level="h3"
          component="h1"
          sx={{ fontWeight: "bold" }}
          children={doc.title}
        />

        <Divider sx={{ width: "100%", my: 1 }} />

        <Stack
          spacing={1}
          width={"100%"}
          marginBottom={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start" }}
        >
          <Chip color="primary" onClick={onLearningObjectivesOpen}>
            Learning Objectives
          </Chip>
          <Chip color="primary" onClick={onQuestionsOpen}>
            Questions
          </Chip>
        </Stack>
        {!!doc.children.length && (
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {doc.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  color={child.isEmpty ? "neutral" : "primary"}
                >
                  {child.title}
                  {child.isEmpty && ` (empty)`}
                </Link>
              </li>
            ))}
          </Box>
        )}
        {!!doc.children.length && <Divider sx={{ my: 2 }} />}
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
          <Mdx children={doc.docMdx} />
        )}
        <Box sx={{ flex: 1 }} />
        <Divider sx={{ mt: 4, mb: 2 }} />
        <Typography level="body-sm">
          Text is available under the MIT License.
        </Typography>
        <Stack direction={"row"} gap={2} mt={2} mb={4}>
          <Link href={doc.links.github} level="body-sm" target="_blank">
            Edit this page on Github
          </Link>
          <Link href={doc.links.search} level="body-sm">
            Search
          </Link>
          <Link href={doc.links.blog} level="body-sm">
            Blog
          </Link>
          <Link href={doc.links.aboutUs} level="body-sm">
            About Chair Flight
          </Link>
        </Stack>
      </Stack>
    );
  },
);

DocContent.displayName = "DocContent";

DocContent.getData = async ({ helper, params }) => {
  const router = helper.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return await router.getDocContent.fetch({ questionBank, docId });
};

DocContent.useData = (params) => {
  const router = trpc.containers.docs;
  const questionBank = getRequiredParam(params, "questionBank");
  const docId = getRequiredParam(params, "docId");
  return router.getDocContent.useSuspenseQuery({ questionBank, docId })[0];
};
