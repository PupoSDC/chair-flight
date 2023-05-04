import { useMemo, useState } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  Option,
  Box,
  Slider,
  Input,
  Button,
} from "@mui/joy";
import { useAppSelector, actions } from "@chair-flight/core/redux";
import { useAppDispatch } from "@chair-flight/core/redux";
import { NestedCheckboxSelect } from "@chair-flight/react/components";
import type { FormEventHandler, FunctionComponent } from "react";
import type {
  LearningObjectiveId,
  LearningObjectiveSummary,
  TestMode,
} from "@chair-flight/base/types";
import type { NestedCheckboxSelectProps } from "@chair-flight/react/components";

type TestPageProps = {
  subjects: LearningObjectiveSummary[];
};

export const TestCreation: FunctionComponent<TestPageProps> = ({
  subjects,
}) => {
  const [loading] = useState(false);
  const dispatch = useAppDispatch();
  // const router = useRouter();
  const mode = useAppSelector((state) => state.testMaker.mode);
  const subject = useAppSelector((state) => state.testMaker.subject);
  const chapters = useAppSelector((state) => state.testMaker.chapters);

  const setMode = (mode: TestMode) =>
    dispatch(
      actions.setTestMode({
        mode,
      })
    );
  const setSubject = (subject: LearningObjectiveId) =>
    dispatch(
      actions.setSubject({
        subject,
      })
    );
  //const toggleChapter = (chapter: LearningObjectiveId) =>
  //  dispatch(
  //    actions.toggleChapter({
  //      chapter,
  //    })
  //  );

  const subjectsAsItems =
    useMemo((): Required<NestedCheckboxSelectProps>["items"] => {
      return (
        subjects
          .find((s) => s.id === subject)
          ?.children?.map((c) => ({
            id: c.id,
            checked: chapters.includes(c.id),
            label: c.text,
            subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
            children:
              c.children?.map((c) => ({
                id: c.id,
                checked: chapters.includes(c.id),
                label: c.text,
                subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
                children: [],
              })) ?? [],
          })) ?? []
      );
    }, [chapters, subject, subjects]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async () => {
    // e.preventDefault();
    // setLoading(true);
    // const body: CreateTestBody = {
    //     title: subjects.find((s) => s.id === selected)?.title || "",
    //     learningObjectives: [selected],
    // };
    // const { data } = await axios.post<CreateTestResponse>("/api/tests", body);
    // store.dispatch(actions.addTest({ test: data }));
    // setLoading(false);
    // router.push(`/tests/${data.id}/exam`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ py: 1 }}>
        <FormLabel>Mode</FormLabel>
        <Select
          placeholder="Choose one…"
          value={mode}
          onChange={(_, v) => v && setMode(v)}
        >
          <Option value="exam">Exam</Option>
          <Option value="study">Study</Option>
        </Select>
      </FormControl>
      <FormControl sx={{ py: 1 }}>
        <FormLabel>Subject</FormLabel>
        <Select
          placeholder="Choose one…"
          value={subject}
          onChange={(_, v) => v && setSubject(v)}
        >
          {subjects
            .filter((item) => item.id.split(".").length === 1)
            .map((item) => (
              <Option value={item.id} key={item.id}>
                {item.text}
              </Option>
            ))}
        </Select>
      </FormControl>
      <FormControl sx={{ py: 1 }}>
        <FormLabel>Chapters</FormLabel>
        <NestedCheckboxSelect items={subjectsAsItems} />
      </FormControl>
      <FormControl sx={{ py: 1 }}>
        <FormLabel>Number of Questions</FormLabel>
        <Box sx={{ display: "flex" }}>
          <Input type="number" sx={{ maxWidth: "6em" }} />
          <Slider defaultValue={3} max={200} />
        </Box>
      </FormControl>
      <FormControl sx={{ py: 1 }}>
        <FormLabel>Number of Questions</FormLabel>
      </FormControl>
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
