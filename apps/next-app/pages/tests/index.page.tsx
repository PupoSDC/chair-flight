import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Grid,
  Link,
  Modal,
  ModalDialog,
  ModalClose,
  Radio,
  RadioGroup,
  ModalOverflow,
  Typography,
  Divider,
} from "@mui/joy";
import { default as axios } from "axios";
import dedent from "ts-dedent";
import {
  ReduxProvider,
  actions,
  store,
  useAppSelector,
  useUserVoyageFlag,
} from "@chair-flight/core/redux";
import {
  AppHead,
  AppHeaderMenu,
  SUBJECTS,
} from "@chair-flight/next/components";
import {
  AppLayout,
  Header,
  TestPreview,
  toast,
} from "@chair-flight/react/components";
import type {
  CreateTestBody,
  CreateTestResponse,
} from "../api/tests/index.api";
import type { GetStaticProps, NextPage } from "next";
import type { FormEventHandler, FunctionComponent } from "react";
import type { LearningObjectiveId } from "@chair-flight/base/types";

type TestPageProps = {
  subjects: Array<{ id: string; title: string }>;
};

const PreviewTests: FunctionComponent = () => {
  const tests = useAppSelector((store) => store.tests);
  const testsAsList = Object.values(tests).sort(
    (a, b) => b.createdAtEpochMs - a.createdAtEpochMs
  );

  return (
    <AppLayout.ScrollableContainer component="ul" sx={{ py: 0 }}>
      {testsAsList.map((test) => (
        <Box component="li" sx={{ pb: 1 }} key={test.id}>
          <TestPreview
            component={Link}
            href={`/tests/${test.id}/${
              test.status === "finished" ? "review" : "exam"
            }`}
            title={test.title}
            status={test.status}
            numberOfQuestions={test.questions.length}
            epochTimeInMs={test.createdAtEpochMs}
            timeToCompleteInMs={test.timeSpentInMs / 1000}
            timeLeftInMs={(test.durationInMs - test.timeSpentInMs) / 1000}
            score={
              test.questions.reduce(
                (s, q) =>
                  s + (q.selectedOptionId === q.correctOptionId ? 1 : 0),
                0
              ) / test.questions.length
            }
          />
        </Box>
      ))}
    </AppLayout.ScrollableContainer>
  );
};

const TestCreation: FunctionComponent<TestPageProps> = ({ subjects }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<LearningObjectiveId>(subjects[0].id);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body: CreateTestBody = {
      title: subjects.find((s) => s.id === selected)?.title || "",
      learningObjectives: [selected],
    };
    const { data } = await axios.post<CreateTestResponse>("/api/tests", body);
    store.dispatch(actions.addTest({ test: data }));
    setLoading(false);
    router.push(`/tests/${data.id}/exam`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup aria-label="Subject" name="Subject" value={selected}>
        <Grid container spacing={2}>
          {subjects.map((item) => (
            <Grid xs={12} sm={6} lg={3} key={item.id}>
              <Radio
                value={item.id}
                label={`${item.id} - ${item.title}`}
                onChange={(event) => setSelected(event.target.value)}
                sx={{
                  height: "100%",
                  padding: (theme) => `calc(${theme.spacing(2)} + 2px)`,
                  borderRadius: "sm",
                  display: "flex",
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  boxSizing: "border-box",
                  "&": {
                    border: (theme) =>
                      `1px solid ${theme.vars.palette.neutral.outlinedBorder}`,
                  },
                  "&:hover": {
                    border: (theme) =>
                      `1px solid ${theme.vars.palette.primary.outlinedBorder}`,
                  },
                  "&.Joy-checked": {
                    border: (theme) =>
                      `3px solid ${theme.vars.palette.primary[500]}`,
                    padding: (theme) => `calc(${theme.spacing(2)})`,
                  },
                  "& .MuiRadio-label ": {
                    pr: 1,
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
      <Button
        size="lg"
        sx={{ mt: 2 }}
        type="submit"
        fullWidth
        loading={loading}
      >
        Start!
      </Button>
    </form>
  );
};

const AlphaWarning: FunctionComponent = () => {
  const [hasSeenAlphaFlag, setHasSeenAlphaFlag] = useUserVoyageFlag(
    "has-seen-alpha-warning"
  );

  useEffect(() => {
    setTimeout(() => {
      if (hasSeenAlphaFlag) return;
      setHasSeenAlphaFlag(true);
      toast.warn(
        dedent`
        Chair Flight is still in alpha.
        All data created by you is stored in your browser only and will be periodically deleted.
      `,
        {
          duration: 10000,
        }
      );
    }, 3000);
  }, [hasSeenAlphaFlag, setHasSeenAlphaFlag]);

  return null;
};

const TestPage: NextPage<TestPageProps> = ({ subjects }) => {
  const [testCreationOpen, setTestCreationOpen] = useState(false);

  return (
    <>
      <AppHead />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main>
        <AppLayout.Grid>
          <AppLayout.Column xs={12} md={3}>
            <Button
              sx={{ my: 1, display: { md: "none" } }}
              children="Create New Test"
              onClick={() => setTestCreationOpen(true)}
            />
            <Divider sx={{ mb: 0.5, display: { md: "none" } }} />
            <ReduxProvider loading={"loading..."}>
              <PreviewTests />
              <AlphaWarning />
            </ReduxProvider>
          </AppLayout.Column>
          <AppLayout.Column md={9} sx={{ display: { xs: "none", md: "flex" } }}>
            <TestCreation subjects={subjects} />
          </AppLayout.Column>
        </AppLayout.Grid>
      </AppLayout.Main>
      <Modal open={testCreationOpen} onClose={() => setTestCreationOpen(false)}>
        <ModalOverflow>
          <ModalDialog>
            <ModalClose />
            <Typography level="h4">Create Test</Typography>
            <Divider sx={{ mb: 2 }} />
            <TestCreation subjects={subjects} />
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </>
  );
};

export const getStaticProps: GetStaticProps<TestPageProps> = async () => {
  const subjects = SUBJECTS.filter(
    (lo) => !["033", "034", "031", "082"].includes(lo.id)
  );

  return {
    props: {
      subjects,
    },
  };
};

export default TestPage;
