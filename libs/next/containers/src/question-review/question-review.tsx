import { Fragment, forwardRef, useEffect, useMemo, useState } from "react";
import { default as OpenInNewIcon } from "@mui/icons-material/OpenInNew";
import { default as RefreshIcon } from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Divider,
  Link,
  List,
  ListItem,
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
import {
  getQuestion,
  getQuestionPreview,
  getRandomId,
  getRandomShuffler,
} from "@chair-flight/core/app";
import {
  ImageViewer,
  MarkdownClient,
  QuestionMultipleChoice,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import type { QuestionTemplateId } from "@chair-flight/base/types";
import type {
  DrawingPoints,
  QuestionMultipleChoiceStatus,
} from "@chair-flight/react/components";
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
  position: absolute;
  bottom: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};
`;

const shuffle = getRandomShuffler("123");

type TabName = "question" | "explanation" | "meta" | "preview";

export type QuestionReviewProps = {
  questionId: QuestionTemplateId;
  title?: string;
  variantId?: string;
  seed?: string;
  onQuestionChanged?: (args: { variantId: string; seed: string }) => void;
} & Pick<SheetProps, "sx" | "className" | "style" | "component">;

/**
 * Self contained component to review a question.
 * Component can be left uncontrolled, but the seed and variantId if supplied
 * make the component controlled.
 *
 * Uses TRPC to fetch the question data. Data is immutable
 */
export const QuestionReview = forwardRef<HTMLDivElement, QuestionReviewProps>(
  (
    {
      title,
      questionId,
      variantId: initialVariantId,
      seed: initialSeed,
      onQuestionChanged,
      ...props
    },
    ref,
  ) => {
    const [currentTab, setCurrentTab] = useState<TabName>("question");
    const [seed, setSeed] = useState<string>(initialSeed ?? getRandomId());
    const [variantId, setVariantId] = useState(initialVariantId);
    const [selectedOption, setSelectedOption] = useState<string>();
    const [currentAnnex, setCurrentAnnex] = useState<string>();
    const [selectedStatus, setSelectedStatus] =
      useState<QuestionMultipleChoiceStatus>("in-progress");
    const [annexDrawings, setAnnexDrawings] = useState<
      Record<string, DrawingPoints[]>
    >({});

    const { data, isLoading } = trpc.questionReview.getQuestion.useQuery({
      questionId,
    });

    const question = useMemo(
      () =>
        data ? getQuestion(data?.questionTemplate, { variantId, seed }) : null,
      [variantId, data, seed],
    );

    const randomizedOptions = useMemo(
      () => (question ? getRandomShuffler(seed ?? "")(question.options) : []),
      [question, seed],
    );

    const allVariantsMap = data?.questionTemplate?.variants ?? {};
    const allVariantsArray = Object.values(allVariantsMap);
    const variant = allVariantsMap[variantId ?? ""] ?? allVariantsArray[0];
    const learningObjectives = data?.learningObjectives ?? [];

    const navigateToVariant = (variantId: string, seed: string) => {
      setSelectedOption(undefined);
      setVariantId(variantId);
      setCurrentTab("question");
      setSelectedStatus("in-progress");
      setSeed(seed);
      onQuestionChanged?.({ seed, variantId });
    };

    useEffect(() => {
      if (initialSeed) setSeed(initialSeed);
      if (initialVariantId) setVariantId(initialVariantId);
    }, [initialSeed, initialVariantId]);

    return (
      <>
        <StyledTabs
          ref={ref}
          size="sm"
          as={Tabs}
          value={currentTab}
          onChange={(e, v) => setCurrentTab(v as TabName)}
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
          <TabPanel value={"question"} sx={{ mb: 8 }}>
            {question && (
              <>
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
                  onClick={() =>
                    navigateToVariant(
                      shuffle(allVariantsArray)[0].id,
                      getRandomId(),
                    )
                  }
                />
              </>
            )}
          </TabPanel>
          <TabPanel value={"explanation"}>
            {question && (
              <MarkdownClient>{question.explanation}</MarkdownClient>
            )}
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
              {variant?.externalIds
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
            {data &&
              allVariantsArray.map(({ id }) => {
                const preview = getQuestionPreview(data.questionTemplate, id);
                return (
                  <Fragment key={id}>
                    <MarkdownClient children={preview} />
                    <Button
                      sx={{ mb: 2, mx: "auto" }}
                      children="Generate This Variant"
                      variant="outlined"
                      onClick={() => navigateToVariant(id, getRandomId())}
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
