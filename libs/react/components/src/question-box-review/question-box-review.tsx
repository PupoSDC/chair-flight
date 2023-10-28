import { forwardRef, useRef, useState } from "react";
import { mergeRefs } from "react-merge-refs";
import { default as OpenInNewIcon } from "@mui/icons-material/OpenInNew";
import {
  Box,
  Divider,
  Link,
  List,
  ListItem,
  Table,
  Tabs,
  Typography,
  styled,
} from "@mui/joy";
import { default as Tab, tabClasses } from "@mui/joy/Tab";
import { default as TabList, tabListClasses } from "@mui/joy/TabList";
import { default as TabPanel, tabPanelClasses } from "@mui/joy/TabPanel";
import { MarkdownClient } from "../markdown-client";
import type { SheetProps } from "@mui/joy";

const StyledTabs = styled(Tabs)`
  --Tabs-gap: 0px;
  overflow-y: auto;
  position: relative;

  & .${tabListClasses.root} {
    border-radius: ${({ theme }) => theme.radius.sm}
      ${({ theme }) => theme.radius.sm} 0 0;
  }

  & .${tabClasses.root} {
    flex: 1;
    border-radius: 0;
    padding: ${({ theme }) => theme.spacing(2, 2)};
    font-weight: ${({ theme }) => theme.fontWeight.lg};
    background-color: ${({ theme }) => theme.vars.palette.background.body};
    position: relative;
    font-size: ${({ theme }) => theme.typography["body-sm"].fontSize};

    &.${tabClasses.selected} {
      color: ${({ theme }) => theme.vars.palette.primary[500]};

      &:before {
        content: "";
        display: block;
        position: absolute;
        bottom: -1px;
        width: 100%;
        height: 2px;
        background-color: ${({ theme }) => theme.palette.primary[400]};
      }
    }

    &.${tabClasses.focusVisible} {
      outline-offset: -3px;
    }
  }

  & .${tabPanelClasses.root} {
    max-height: 100%;
    min-height: 20px;
    overflow-y: auto;
    border-top: 1px solid ${({ theme }) => theme.vars.palette.divider};
    padding: ${({ theme }) => theme.spacing(1)};

    ${({ theme }) => theme.breakpoints.up("sm")} {
      padding: ${({ theme }) => theme.spacing(2)};
    }
  }

  & .title {
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing(1, 2)};
    font-weight: ${({ theme }) => theme.fontWeight.lg};
  }
`;

type TabName = "question" | "explanation" | "meta" | "preview";

export type QuestionBoxReviewProps = {
  /**
   * Should be an instance of `QuestionMultiple` or other question formats.
   */
  question?: JSX.Element;
  explanation?: string;
  preview?: JSX.Element;
  title?: string;
  loading?: boolean;
  editable?: boolean;
  disableAllButQuestion?: boolean;
  learningObjectives?: Array<{
    id: string;
    href: string;
    text: string;
  }>;
  externalReferences?: Array<{
    name: string;
    href: string;
  }>;
} & Pick<SheetProps, "sx" | "className" | "style" | "variant" | "component">;

export type QuestionBoxReviewRef = HTMLDivElement & {
  change?: (name: TabName) => void;
};

/**
 * Question wrapper designed for stand alone question review or test review
 */
export const QuestionBoxReview = forwardRef<
  QuestionBoxReviewRef,
  QuestionBoxReviewProps
>(
  (
    {
      question,
      explanation = "",
      preview = "",
      title,
      loading,
      disableAllButQuestion,
      learningObjectives = [],
      externalReferences = [],
      ...others
    },
    ref,
  ) => {
    const localRef = useRef<QuestionBoxReviewRef>();
    const [value, setValue] = useState<TabName>("question");

    if (localRef.current) {
      localRef.current.change = (name) => setValue(name);
    }

    return (
      <StyledTabs
        ref={mergeRefs([localRef, ref])}
        size="sm"
        as={Tabs}
        value={value}
        onChange={(e, v) => setValue(v as TabName)}
        variant="outlined"
        defaultValue={"question"}
        {...others}
      >
        <TabList>
          {title && (
            <Box className="title">
              <Typography level="body-md">{title}</Typography>
            </Box>
          )}
          <Tab disabled={loading} value={"question"}>
            Question
          </Tab>
          <Tab
            disabled={loading || disableAllButQuestion}
            value={"explanation"}
          >
            Explanation
          </Tab>
          <Tab disabled={loading || disableAllButQuestion} value={"meta"}>
            Meta
          </Tab>
          <Tab disabled={loading || disableAllButQuestion} value={"preview"}>
            Variants
          </Tab>
        </TabList>
        <TabPanel value={"question"}>{question}</TabPanel>
        <TabPanel value={"explanation"}>
          <MarkdownClient>{explanation}</MarkdownClient>
        </TabPanel>
        <TabPanel value={"meta"}>
          <Typography level="h4" sx={{ mt: 2 }}>
            Learning Objectives
          </Typography>
          <Divider />
          <Table aria-label="Learning Objectives">
            <thead>
              <tr>
                <th style={{ width: "8em" }}>id</th>
                <th>text</th>
              </tr>
            </thead>
            <tbody>
              {learningObjectives.map((lo) => (
                <tr key={lo.id}>
                  <td>
                    <Link href={lo.href} children={lo.id} />
                  </td>
                  <td>
                    <MarkdownClient children={lo.text} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Typography level="h4">External References</Typography>
          <Divider />
          <List aria-label="basic-list">
            {externalReferences.map((ref) => (
              <ListItem key={ref.name}>
                <Link href={ref.href}>
                  <span>{ref.name}</span>
                  <OpenInNewIcon sx={{ ml: 1 }} />
                </Link>
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={"preview"}>{preview}</TabPanel>
      </StyledTabs>
    );
  },
);

QuestionBoxReview.displayName = "QuestionBoxReview";
