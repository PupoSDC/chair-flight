import { Fragment, forwardRef, useMemo, useState } from "react";
import { default as OpenInNewIcon } from "@mui/icons-material/OpenInNew";
import { default as RefreshIcon } from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Divider,
  Link,
  List,
  ListItem,
  SheetProps,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Typography,
  styled,
  tabClasses,
  tabListClasses,
  tabPanelClasses,
} from "@mui/joy";
import type { 
  QuestionTemplateId 
} from "@chair-flight/base/types";
import {
  getQuestion,
  getQuestionPreview,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import {
  DrawingPoints,
  ImageViewer,
  MarkdownClient,
  QuestionMultipleChoice,
  QuestionMultipleChoiceStatus,
} from "@chair-flight/react/components";
import {
  trpc,
} from "@chair-flight/trpc/client";

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

    font-size: ${({ theme }) => theme.typography.body3.fontSize};

    ${({ theme }) => theme.breakpoints.up("sm")} {
      font-size: ${({ theme }) => theme.typography.body2.fontSize};
    }

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

const Fab = styled(Button)`
  width: ${({ theme }) => theme.spacing(5)};
  height: ${({ theme }) => theme.spacing(5)};
  border-radius: 50%;
  position: fixed;
  bottom: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    position: absolute;
  }
`;

const shuffle = getRandomShuffler("123");

export type TabName = "question" | "explanation" | "meta" | "preview";

export type QuestionReviewRef = HTMLDivElement & {
  change?: (name: TabName) => void;
};

export type QuestionReviewProps = {
  title?: string;
  questionId: QuestionTemplateId;
  variantId: string;
  seed: string;
  onNavigateToVariant: (variantId: string, seed: string) => void;
} & Pick<SheetProps, "sx" | "className" | "style" | "variant" | "component">;

export const QuestionReview = forwardRef<
  QuestionReviewRef,
  QuestionReviewProps
>(
  (
    { title, questionId, variantId, seed, onNavigateToVariant, ...props },
    ref,
  ) => {
    const { data, isLoading } = trpc.questionReview.getQuestion.useQuery({
      questionId,
    });
    const [value, setValue] = useState<TabName>("question");
    const [selectedOption, setSelectedOption] = useState<string>();
    const [selectedStatus, setSelectedStatus] =
      useState<QuestionMultipleChoiceStatus>("in-progress");
    const [currentAnnex, setCurrentAnnex] = useState<string>();
    const [annexDrawings, setAnnexDrawings] = useState<
      Record<string, DrawingPoints[]>
    >({});

    if (!data) return undefined;

    const { questionTemplate, learningObjectives } = data;
    const allVariants = Object.values(questionTemplate.variants);
    const variant = questionTemplate.variants[variantId];

    const question = useMemo(
      () => getQuestion(data?.questionTemplate, { variantId, seed }),
      [variantId, questionTemplate, seed],
    );

    const randomizedOptions = useMemo(
      () => getRandomShuffler(seed ?? "")(question.options),
      [question.options, seed],
    );

    if (ref && typeof ref === "object" && ref.current) {
      ref.current.change = (name) => setValue(name);
    }

    return (
      <>
        <StyledTabs
          ref={ref}
          size="sm"
          as={Tabs}
          value={value}
          onChange={(e, v) => setValue(v as TabName)}
          variant="outlined"
          defaultValue={"question"}
          {...props}
        >
          <TabList>
            {title && (
              <Box className="title">
                <Typography level="body1">{title}</Typography>
              </Box>
            )}
            <Tab disabled={isLoading} value={"question"}>
              Question
            </Tab>
            <Tab disabled={isLoading} value={"explanation"}>
              Explanation
            </Tab>
            <Tab disabled={isLoading} value={"meta"}>
              Meta
            </Tab>
            <Tab disabled={isLoading} value={"preview"}>
              Variants
            </Tab>
          </TabList>
          <TabPanel value={"question"}>
            <QuestionMultipleChoice
              sx={{ p: 0 }}
              question={question.question}
              correctOptionId={question.correctOptionId}
              selectedOptionId={selectedOption}
              status={selectedStatus}
              disabled={selectedStatus === "show-result"}
              options={randomizedOptions.map((option) => ({
                optionId: option.id,
                text: option.text,
              }))}
              onOptionClicked={(optionId) => {
                setSelectedOption(optionId);
                setSelectedStatus("show-result");
              }}
              annexes={question.annexes}
              onAnnexClicked={(annex) => setCurrentAnnex(annex)}
            />
            <Fab
              children={<RefreshIcon />}
              onClick={() => {
                onNavigateToVariant(shuffle(allVariants)[0].id, getRandomId());
                setSelectedOption(undefined);
                setSelectedStatus("in-progress");
              }}
            />
          </TabPanel>
          <TabPanel value={"explanation"}>
            <MarkdownClient>{question.explanation}</MarkdownClient>
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
                {learningObjectives
                  .map((lo) => ({
                    id: lo.id,
                    text: lo.text,
                    href: "/learning-objectives/[learningObjectiveId]",
                  }))
                  .map((lo) => (
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
              {variant.externalIds
                .map((id) => ({ name: id, href: "" }))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((ref) => (
                  <ListItem key={ref.name}>
                    <Link href={ref.href}>
                      <span>{ref.name}</span>
                      <OpenInNewIcon sx={{ ml: 1 }} />
                    </Link>
                  </ListItem>
                ))}
            </List>
          </TabPanel>
          <TabPanel value={"preview"}>
            {allVariants.map(({ id }) => {
              const preview = getQuestionPreview(questionTemplate, id);
              return (
                <Fragment key={id}>
                  <MarkdownClient children={preview} />
                  <Button
                    sx={{ mb: 2, mx: "auto" }}
                    children="Generate This Variant"
                    variant="outlined"
                    onClick={() => onNavigateToVariant(id, getRandomId())}
                  />
                  <Divider />
                </Fragment>
              );
            })}
          </TabPanel>
        </StyledTabs>
        <ImageViewer
          open={currentAnnex !== undefined}
          onClose={() => setCurrentAnnex(undefined)}
          drawings={annexDrawings[currentAnnex ?? ""] ?? []}
          onDrawingsChanged={(newDrawings) =>
            setAnnexDrawings((oldDrawings) => ({
              ...oldDrawings,
              [currentAnnex ?? ""]: newDrawings,
            }))
          }
          onUndo={() =>
            setAnnexDrawings((old) => ({
              ...old,
              [currentAnnex ?? ""]: (old[currentAnnex ?? ""] ?? []).slice(
                0,
                -1,
              ),
            }))
          }
          onReset={() =>
            setAnnexDrawings((old) => ({
              ...old,
              [currentAnnex ?? ""]: [],
            }))
          }
          imgSrc={currentAnnex ?? ""}
        />
      </>
    );
  },
);
