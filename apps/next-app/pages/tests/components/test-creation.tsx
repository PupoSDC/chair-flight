import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  FormControl,
  FormLabel,
  Select,
  Option,
  Box,
  Checkbox,
  Button,
  styled,
} from "@mui/joy";
import { default as axios } from "axios";
import { useAppSelector, actions } from "@chair-flight/core/redux";
import { useAppDispatch } from "@chair-flight/core/redux";
import {
  NestedCheckboxSelect,
  SliderWithInput,
} from "@chair-flight/react/components";
import type {
  CreateTestBody,
  CreateTestResponse,
} from "../../api/tests/index.api";
import type { FormEventHandler, FunctionComponent } from "react";
import type {
  LearningObjectiveId,
  LearningObjectiveSummary,
  TestMode,
} from "@chair-flight/base/types";
import type {
  NestedCheckboxSelectProps,
  NestedCheckboxItem,
} from "@chair-flight/react/components";

type TestPageProps = {
  subjects: LearningObjectiveSummary[];
};

const Form = styled("form")`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const TestCreation: FunctionComponent<TestPageProps> = ({
  subjects,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hasDoneInitialRender = useRef(false);
  const [loading, setLoading] = useState(false);
  const { numberOfQuestions, mode, subject, chapters } = useAppSelector(
    (state) => state.testMaker
  );

  useEffect(() => {
    if (hasDoneInitialRender.current) return;
    dispatch(
      actions.setTestMakerChapters(
        Object.values(subjects)
          .flatMap((c) => c.children ?? [])
          .flatMap((c) => c.children ?? [])
          .filter((c) => typeof chapters[c.id] === "undefined")
          .map((c) => ({ chapter: c.id, value: true }))
      )
    );
    hasDoneInitialRender.current = true;
  });

  useEffect(() => {
    if (!subject)
      dispatch(
        actions.setTestMakerSubject({
          subject: subjects[0].id,
        })
      );
  });

  const subjectsAsItems = useMemo(
    (): Required<NestedCheckboxSelectProps>["items"] =>
      subjects
        .find((s) => s.id === subject)
        ?.children?.map((c) => {
          const children =
            c.children?.map((c) => ({
              id: c.id,
              checked: chapters[c.id] ?? false,
              label: c.text,
              subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
              children: [],
            })) ?? [];

          const checked = children.every((c) => c.checked);

          return {
            id: c.id,
            checked,
            label: c.text,
            subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
            children,
          };
        }) ?? [],
    [chapters, subject, subjects]
  );

  const allSelected = subjectsAsItems.every((s) => s.checked);
  const someSelected = !allSelected && subjectsAsItems.some((s) => s.checked);

  const setMode = (mode: TestMode) =>
    dispatch(
      actions.setTestMakerTestMode({
        mode,
      })
    );

  const setSubject = (subject: LearningObjectiveId) =>
    dispatch(
      actions.setTestMakerSubject({
        subject,
      })
    );

  const setAllSubjects = (value: boolean) =>
    dispatch(
      actions.setTestMakerChapters(
        subjectsAsItems
          .flatMap((s) => s.children)
          .map((c) => ({
            chapter: c.id,
            value,
          }))
      )
    );

  const setNumberOfQuestions = (numberOfQuestions: number) =>
    dispatch(
      actions.setTestMakerNumberOfQuestions({
        numberOfQuestions,
      })
    );

  const setChapter: NestedCheckboxSelectProps["onChange"] = (
    chapter,
    value
  ) => {
    const castChapter = chapter as NestedCheckboxItem;
    if (castChapter.children.length) {
      dispatch(
        actions.setTestMakerChapters(
          castChapter.children.map((c) => ({
            chapter: c.id,
            value,
          }))
        )
      );
      return;
    }

    dispatch(
      actions.setTestMakerChapters([
        {
          chapter: chapter.id,
          value,
        },
      ])
    );
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body: CreateTestBody = {
      title: subjects.find((s) => s.id === subject)?.text || "",
      learningObjectives: subjectsAsItems.map((s) => s.id),
      numberOfQuestions,
      mode,
    };
    const { data } = await axios.post<CreateTestResponse>("/api/tests", body);
    dispatch(actions.addTest({ test: data }));
    await router.push(`/tests/${data.id}/${data.mode}`);
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
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
      <Box sx={{ my: 1, flex: 1, overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormLabel>Chapters</FormLabel>
          <Checkbox
            label={"select all"}
            size="sm"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={(evt) => setAllSubjects(evt.target.checked)}
            sx={{
              my: 0.5,
              mr: 1,
              display: "flex",
              flexDirection: "row-reverse",
              "& label": {
                px: 1,
              },
            }}
          />
        </Box>
        <NestedCheckboxSelect
          sx={{ overflow: "auto", height: "90%", my: 1, pr: 5 }}
          items={subjectsAsItems}
          onChange={setChapter}
        />
      </Box>
      <FormControl sx={{ py: 1 }}>
        <FormLabel>Number of Questions</FormLabel>
        <SliderWithInput
          min={0}
          max={200}
          value={numberOfQuestions}
          onChange={(v) => setNumberOfQuestions(v)}
        />
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
    </Form>
  );
};
