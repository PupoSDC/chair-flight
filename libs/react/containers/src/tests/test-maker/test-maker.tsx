import { useEffect, type FunctionComponent, useMemo, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoSsr } from "@mui/base";
import {
  Box,
  FormControl,
  FormLabel,
  Option,
  Checkbox,
  Button,
} from "@mui/joy";
import { newTestConfigurationSchema } from "@chair-flight/core/app";
import {
  HookFormErrorMessage,
  HookFormSelect,
  NestedCheckboxSelect,
  SliderWithInput,
  toast,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { useTestProgress } from "../hooks/use-test-progress";
import type { QuestionBankName, Test } from "@chair-flight/base/types";
import type { NewTestConfiguration } from "@chair-flight/core/app";
import type { NestedCheckboxSelectProps } from "@chair-flight/react/components";
import type { BoxProps } from "@mui/joy";

const resolver = zodResolver(newTestConfigurationSchema);
const useSubjects = trpc.questionBank.getAllSubjects.useSuspenseQuery;
const useCreateTest = trpc.questionBank.createTest.useMutation;

const testMakerPersistence = {
  "cf-test-maker-atpl":
    createUsePersistenceHook<NewTestConfiguration>("cf-test-maker-atpl"),
  "cf-test-maker-b737":
    createUsePersistenceHook<NewTestConfiguration>("cf-test-maker-b737"),
  "cf-test-maker-a320":
    createUsePersistenceHook<NewTestConfiguration>("cf-test-maker-a320"),
  "cf-test-maker-prep":
    createUsePersistenceHook<NewTestConfiguration>("cf-test-maker-prep"),
};

export type TestMakerProps = Omit<BoxProps, "onBlur" | "onSubmit"> & {
  onSuccessfulTestCreation: (test: Test) => void;
  questionBank: QuestionBankName;
};

/**
 * Container to create tests.
 *
 * - Uses trpc to get subjects.
 * - Uses Zustand persistence to restore progress from previous session.
 */
export const TestMaker: FunctionComponent<TestMakerProps> = ({
  questionBank,
  onSuccessfulTestCreation,
  ...otherProps
}) => {
  const persistenceKey = `cf-test-maker-${questionBank}` as const;
  const useTestMakerPersistence = testMakerPersistence[persistenceKey];

  const { getPersistedData, setPersistedData } = useTestMakerPersistence();
  const [{ subjects }] = useSubjects({ questionBank });
  const createTest = useCreateTest();
  const addTest = useTestProgress((s) => s.addTest);

  const defaultValues = useMemo<NewTestConfiguration>(
    () => ({
      mode: "exam",
      questionBank,
      subject: subjects[0].id,
      learningObjectives: subjects
        .flatMap((s) => s.children ?? [])
        .flatMap((c) => [c.id, ...(c.children?.map((c) => c.id) ?? [])])
        .reduce((acc, curr) => ({ ...acc, [curr]: true }), {}),
      numberOfQuestions: subjects[0].numberOfExamQuestions,
    }),
    [subjects, questionBank],
  );

  const form = useForm({ defaultValues, resolver });
  const currentSubject = form.watch("subject");
  const currentMode = form.watch("mode");
  const currentLearningObjectives = form.watch("learningObjectives");
  const lastCurrentSubject = useRef(currentSubject);
  const hasMountedInitialValues = useRef(false);

  const currentCheckboxItems = useMemo<
    Required<NestedCheckboxSelectProps>["items"]
  >(
    () =>
      subjects
        .find((s) => s.id === currentSubject)
        ?.children?.map((c) => {
          const hasChildren = Boolean(c.children?.length);

          const children =
            c.children?.map((c) => ({
              id: c.id,
              checked: currentLearningObjectives[c.id] ?? false,
              label: c.text,
              subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
              children: [],
            })) ?? [];

          const checked = hasChildren
            ? children.every((c) => c.checked)
            : currentLearningObjectives[c.id] ?? false;

          return {
            id: c.id,
            checked,
            label: c.text,
            subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
            children,
          };
        }) ?? [],
    [subjects, currentSubject, currentLearningObjectives],
  );

  const onSubmit = form.handleSubmit(async (config) => {
    try {
      const { test } = await createTest.mutateAsync({
        questionBank,
        config: {
          ...config,
          learningObjectives: {
            ...config.learningObjectives,
            [config.subject]: true,
          },
        },
      });
      addTest({ test });
      onSuccessfulTestCreation(test);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the test. 😥");
    }
  });

  useEffect(() => {
    if (lastCurrentSubject.current === currentSubject) return;
    lastCurrentSubject.current = currentSubject;
    form.setValue(
      "numberOfQuestions",
      subjects.find((s) => s.id === currentSubject)?.numberOfExamQuestions ??
        40,
    );
  });

  useEffect(() => {
    if (hasMountedInitialValues.current) return;
    hasMountedInitialValues.current = true;
    const persistedData = getPersistedData();
    if (!persistedData) return;
    form.reset({ ...defaultValues, ...persistedData });
  });

  return (
    <Box {...otherProps}>
      <Box
        component="form"
        onSubmit={onSubmit}
        onBlur={() => setPersistedData(form.getValues())}
        sx={(t) => ({
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          margin: "auto",
          maxWidth: t.breakpoints.values.md,
        })}
      >
        <FormProvider {...form}>
          <HookFormSelect
            {...form.register("mode")}
            sx={{ py: 1 }}
            formLabel={"Mode"}
          >
            <Option value="exam">Exam</Option>
            <Option value="study">Study</Option>
          </HookFormSelect>
          {subjects.length > 1 && (
            <HookFormSelect
              {...form.register("subject")}
              sx={{ py: 1 }}
              formLabel={"Subject"}
            >
              {subjects.map((item) => (
                <Option value={item.id} key={item.id}>
                  {`${item.id} - ${item.longName}`}
                </Option>
              ))}
            </HookFormSelect>
          )}
          <Controller
            control={form.control}
            name="learningObjectives"
            render={({ field: { onChange, value } }) => {
              const allSelected = currentCheckboxItems.every((s) => s.checked);
              const someSelected = currentCheckboxItems.some((s) => s.checked);

              return (
                <Box sx={{ py: 1, flex: 1, overflow: "hidden" }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FormLabel>Chapters</FormLabel>
                    <Checkbox
                      label={"select all"}
                      size="sm"
                      checked={allSelected}
                      indeterminate={!allSelected && someSelected}
                      onChange={() =>
                        onChange(
                          Object.keys(value)
                            .filter((k) => k.startsWith(currentSubject))
                            .reduce(
                              (acc, curr) => {
                                acc[curr] = !allSelected;
                                return acc;
                              },
                              { ...value },
                            ),
                        )
                      }
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
                    items={currentCheckboxItems}
                    onChange={(chapter, newValue) =>
                      onChange(
                        Object.keys(value)
                          .filter((k) => k.startsWith(chapter.id))
                          .reduce(
                            (acc, curr) => {
                              acc[curr] = newValue;
                              return acc;
                            },
                            { ...value },
                          ),
                      )
                    }
                  />
                </Box>
              );
            }}
          />
          <HookFormErrorMessage {...form.register("learningObjectives")} />
          <Controller
            control={form.control}
            name="numberOfQuestions"
            render={({ field: { onChange, value } }) => (
              <FormControl sx={{ py: 1 }}>
                <FormLabel>Number of Questions</FormLabel>
                <SliderWithInput
                  disabled={currentMode === "exam"}
                  min={1}
                  max={200}
                  value={value}
                  onChange={(v) => onChange(v)}
                />
              </FormControl>
            )}
          />
          <Button
            size="lg"
            sx={{ mt: 2 }}
            type="submit"
            fullWidth
            disabled={!form.formState.isValid}
            loading={createTest.isLoading}
          >
            Start!
          </Button>
          <NoSsr>
            <DevTool control={form.control} />
          </NoSsr>
        </FormProvider>
      </Box>
    </Box>
  );
};
