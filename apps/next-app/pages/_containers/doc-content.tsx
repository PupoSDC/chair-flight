import { Divider, Link, Typography } from "@mui/joy";
import { Markdown } from "@cf/react/markdown";
import { Ups } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import type { DocId } from "@cf/core/content";
import type { FunctionComponent } from "react";

export const DocContent: FunctionComponent<{
  docId: DocId;
}> = ({ docId: id }) => {
  const [{ doc }] = trpc.questionBank.docs.getDoc.useSuspenseQuery(
    { id },
    { keepPreviousData: true },
  );

  return (
    <>
      {doc.parent && (
        <Link href={doc.parent.href} children={doc.parent.title} />
      )}
      <Typography
        level="h3"
        component="h1"
        sx={{ fontWeight: "bold" }}
        children={`${doc.title}`}
      />
      <Divider sx={{ width: "100%", my: 1 }} />

      {doc.isEmpty ? (
        <Ups message="This Doc has not been written yet." sx={{ flex: 0 }}>
          <Typography level="body-lg">
            You can help chair flight grow by contributing to it!
          </Typography>
          <Link href={doc.links.github} level="body-sm">
            Edit this page on Github
          </Link>
        </Ups>
      ) : (
        <Markdown>{doc.markdown}</Markdown>
      )}
    </>
  );
};
