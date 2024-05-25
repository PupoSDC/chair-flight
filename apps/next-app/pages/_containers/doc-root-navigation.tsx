import { useState } from "react";
import { KeyboardArrowRight } from "@mui/icons-material";
import { Link, List, ListItem, Stack } from "@mui/joy";
import { removeDuplicates } from "@cf/base/utils";
import { trpc } from "@cf/trpc/client";
import type { DocId } from "@cf/core/content";
import type { FunctionComponent } from "react";

export const DocRootNavigation: FunctionComponent<{
  docId: DocId;
}> = ({ docId }) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [data] = trpc.questionBank.docs.getDocToc.useSuspenseQuery(
    { id: docId },
    { keepPreviousData: true },
  );

  return (
    <List sx={{ p: 0.5 }} component={"nav"}>
      <ListItem sx={{ px: 1, py: 0 }}>
        <Link
          href={data.library.href}
          level="body-sm"
          fontWeight={600}
          color="neutral"
        >
          {data.library.title}
        </Link>
      </ListItem>

      <ListItem sx={{ px: 1, py: 0 }}>
        <Link
          href={data.root.href}
          level="body-sm"
          fontWeight={600}
          color={data.root.id === docId ? "primary" : "neutral"}
        >
          [{data.root.id}] {data.root.title}
        </Link>
      </ListItem>

      {data.toc.map((item) => {
        const isExpanded = expanded.includes(item.id);

        return (
          <Stack key={item.id}>
            <ListItem sx={{ p: 0 }}>
              <KeyboardArrowRight
                color={item.id === docId ? "primary" : "neutral"}
                onClick={() => {
                  if (!item.nestedDocs.length) return;
                  setExpanded(removeDuplicates([...expanded, item.id]));
                }}
                sx={{
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
              <Link
                href={item.href}
                level="body-xs"
                fontWeight={600}
                color={item.id === docId ? "primary" : "neutral"}
              >
                [{item.id}] {item.title}
              </Link>
            </ListItem>
            {item.nestedDocs
              .filter((nestedItem) => {
                return isExpanded || nestedItem.id === docId;
              })
              .map((nestedItem) => (
                <Link
                  key={nestedItem.id}
                  href={nestedItem.href}
                  level="body-xs"
                  color={nestedItem.id === docId ? "primary" : "neutral"}
                  sx={{
                    ml: 1.25,
                    py: 0.5,
                    pl: 3,
                    borderRadius: 0,
                    borderLeft: "1px solid",
                    backgroundColor:
                      nestedItem.id === docId
                        ? "primary.plainHoverBg"
                        : "transparent",
                  }}
                >
                  {nestedItem.title}
                </Link>
              ))}
          </Stack>
        );
      })}
    </List>
  );
};
