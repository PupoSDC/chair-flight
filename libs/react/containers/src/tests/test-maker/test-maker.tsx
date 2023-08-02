import { useEffect, type FunctionComponent, useMemo, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { createUsePersistenceHook } from "../../use-persistence";
import type { Test } from "@chair-flight/base/types";
import type { NewTestConfiguration } from "@chair-flight/core/app";
import type { NestedCheckboxSelectProps } from "@chair-flight/react/components";

const resolver = zodResolver(newTestConfigurationSchema);
const useSubjects = trpc.tests.getAllSubjects.useSuspenseQuery;
const useCreateTest = trpc.tests.createTest.useMutation;
const useTestMakerPersistence =
  createUsePersistenceHook<NewTestConfiguration>("cf-test-maker");

export type TestMakerProps = {
  onSuccessfulTestCreation: (test: Test) => void;
};

/**
 * Container to create tests.
 *
 * - Uses trpc to get subjects.
 * - Uses Zustand persistence to restore progress from previous session.
 */
export const TestMaker: FunctionComponent<TestMakerProps> = ({
  onSuccessfulTestCreation,
}) => {
  const { getPersistedData, setPersistedData } = useTestMakerPersistence();
  const [{ subjects }] = useSubjects();
  const createTest = useCreateTest();

  const defaultValues = useMemo<NewTestConfiguration>(
    () => ({
      mode: "exam",
      subject: subjects[0].id,
      learningObjectives: subjects
        .flatMap((s) => s.children ?? [])
        .flatMap((c) => c.children?.map((c) => c.id) ?? [])
        .reduce((acc, curr) => ({ ...acc, [curr]: true }), {}),
      numberOfQuestions: subjects[0].numberOfExamQuestions,
    }),
    [subjects],
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
          const children =
            c.children?.map((c) => ({
              id: c.id,
              checked: currentLearningObjectives[c.id] ?? false,
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
    [subjects, currentSubject, currentLearningObjectives],
  );

  const onSubmit = form.handleSubmit(async (config) => {
    try {
      const { test } = await createTest.mutateAsync({ config });
      onSuccessfulTestCreation(test);
    } catch (error) {
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
    if (!hasMountedInitialValues.current) return;
    hasMountedInitialValues.current = true;
    const persistedData = getPersistedData();
    form.reset(persistedData);
  });

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      onBlur={() => setPersistedData(form.getValues())}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
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
        {!!currentCheckboxItems.length && (
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
        )}
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
          loading={createTest.isLoading}
        >
          Start!
        </Button>
        <DevTool control={form.control} />
      </FormProvider>
    </Box>
  );
};
