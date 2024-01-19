import { Fragment, forwardRef, useRef } from "react";
import { NoSsr } from "@mui/base";
import {
  Box,
  CircularProgress,
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Sheet,
  Table,
  Typography,
  useTheme,
} from "@mui/joy";
import { useMediaQuery } from "../hooks/use-media-query";
import { MarkdownClientCompressed } from "../markdown-client";
import { Ups } from "../ups";
import type { SheetProps } from "@mui/joy";

export type QuestionListProps = {
  loading?: boolean;
  error?: boolean;
  forceMode?: "mobile" | "desktop";
  questions?: Array<{
    id: string;
    questionId: string;
    variantId: string;
    href: string;
    text: string;
    learningObjectives: Array<{
      name: string;
      href: string;
    }>;
    externalIds: string[];
  }>;
  onFetchNextPage?: () => Promise<unknown>;
} & SheetProps;

export const QuestionList = forwardRef<HTMLDivElement, QuestionListProps>(
  (
    {
      loading,
      error,
      questions = [],
      forceMode,
      onFetchNextPage,
      ...sheetProps
    },
    ref,
  ) => {
    const isFetchingMore = useRef(false);
    const theme = useTheme();
    const isMobileMq = useMediaQuery(theme.breakpoints.down("md"));
    const hasNoResults = !error && !loading && !questions.length;
    const hasResults = !error && !loading && questions.length;

    const isMobile = (() => {
      if (forceMode && forceMode === "desktop") return false;
      if (forceMode === "mobile") return true;
      return isMobileMq;
    })();

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const target = e.target as HTMLUListElement;
      const { scrollHeight, scrollTop, clientHeight } = target;
      const distance = scrollHeight - scrollTop - clientHeight;
      if (distance < 500 && !loading && !isFetchingMore.current) {
        isFetchingMore.current = true;
        onFetchNextPage?.().finally(() => {
          isFetchingMore.current = false;
        });
      }
    };

    return (
      <Sheet ref={ref} {...sheetProps}>
        <Box
          sx={{ height: "100%", overflow: "auto", position: "relative" }}
          onScroll={onScroll}
        >
          <NoSsr>
            {loading && (
              <CircularProgress
                variant="solid"
                size="lg"
                sx={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                  left: "50%",
                }}
              />
            )}
            {error && <Ups message="Error fetching questions" color="danger" />}
            {hasNoResults && (
              <Ups message="No questions found" color={undefined} />
            )}
            {hasResults && !isMobile && (
              <Table stickyHeader>
                <thead>
                  <tr>
                    <th style={{ width: "8em" }}>ID</th>
                    <th>Question</th>
                    <th style={{ width: "12em" }}>Learning Objectives</th>
                    <th style={{ width: "12em" }}>External IDs</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((result) => (
                    <tr key={result.id}>
                      <td>
                        <Link href={result.href} sx={{ display: "block" }}>
                          <Typography>{result.questionId}</Typography>
                          <br />
                          <Typography level="body-xs">
                            {result.variantId}
                          </Typography>
                        </Link>
                      </td>
                      <td>
                        <MarkdownClientCompressed>
                          {result.text}
                        </MarkdownClientCompressed>
                      </td>
                      <td>
                        {result.learningObjectives.map(({ name, href }) => (
                          <Link
                            key={name}
                            href={href}
                            children={name}
                            sx={{ display: "block" }}
                          />
                        ))}
                      </td>
                      <td>
                        {result.externalIds.map((id) => (
                          <Typography level="body-xs" key={id}>
                            {id}
                          </Typography>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            {hasResults && isMobile && (
              <List>
                {questions.map((result) => (
                  <Fragment key={result.id}>
                    <ListItem>
                      <ListItemContent>
                        <Link href={result.href} sx={{ pr: 1 }}>
                          {result.questionId}
                        </Link>
                        <Typography level="body-xs" sx={{ display: "inline" }}>
                          {result.variantId}
                        </Typography>
                        <Typography level="body-xs">
                          {result.learningObjectives
                            .map((lo) => lo.name)
                            .join(", ")}
                        </Typography>
                        <Box
                          sx={{
                            mt: 2,
                            fontSize: "12px",
                            height: "10em",
                            overflow: "hidden",
                            maskImage:
                              "linear-gradient(to bottom, black 50%, transparent 100%)",
                          }}
                        >
                          <MarkdownClientCompressed>
                            {result.text}
                          </MarkdownClientCompressed>
                        </Box>
                      </ListItemContent>
                    </ListItem>
                    <ListDivider inset={"gutter"} />
                  </Fragment>
                ))}
              </List>
            )}
          </NoSsr>
        </Box>
      </Sheet>
    );
  },
);

QuestionList.displayName = "QuestionList";
