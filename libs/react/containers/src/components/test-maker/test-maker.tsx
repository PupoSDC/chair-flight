"use client";

import { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Option,
  Checkbox,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Stack,
  Typography,
  formControlClasses,
  useTheme,
} from "@mui/joy";
import { getNumberOfAvailableQuestions } from "@cf/core/question-bank";
import { newTestConfigurationSchema } from "@cf/core/tests";
import {
  HookFormSelect,
  NestedCheckboxSelect,
  SliderWithInput,
  createUsePersistenceHook,
  toast,
  useDisclose,
  useMediaQuery,
} from "@cf/react/components";
import { trpc } from "@cf/react/trpc";
import { useTestProgress } from "../../hooks/use-test-progress";
import { useTrackEvent } from "../../hooks/use-track-event";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { NewTestConfiguration } from "@cf/core/tests";
import type { NestedCheckboxSelectProps } from "@cf/react/components";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type TestMakerProps = {
  sx: StackProps["sx"];
  questionBank: QuestionBankName;
};

const useCreateTest = trpc.tests.createTest.useMutation;
const useGetSubjects = trpc.tests.getSubjects.useSuspenseQuery;
const resolver = zodResolver(newTestConfigurationSchema);
const defaultConfig = {} as Partial<NewTestConfiguration>;

const useTestMakerPersistence = {
  atpl: createUsePersistenceHook(`cf-test-maker-atpl`, defaultConfig, 1),
  type: createUsePersistenceHook(`cf-test-maker-type`, defaultConfig, 1),
  prep: createUsePersistenceHook(`cf-test-maker-prep`, defaultConfig, 1),
};

export const TestMaker: FunctionComponent<TestMakerProps> = ({
  sx,
  questionBank,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const learningObjectivesModal = useDisclose();
  const createTest = useCreateTest();
  const trackEvent = useTrackEvent();
  const addTest = useTestProgress((s) => s.addTest);
  const [{ subjects }] = useGetSubjects({ questionBank, course: "all" });
  const { getData, setData } = useTestMakerPersistence[questionBank]();

  const defaultValues: NewTestConfiguration = {
    mode: "exam",
    questionBank,
    subject: subjects[0].id,
    learningObjectiveIds: subjects[0].learningObjectives.map((lo) => lo.id),
    numberOfQuestions: subjects[0].numberOfExamQuestions,
    ...getData(),
  };

  const form = useForm({ defaultValues, resolver });
  const currentSubjectId = form.watch("subject");
  const currentMode = form.watch("mode");
  const currentLearningObjectives = form.watch("learningObjectiveIds");
  const currentSubject = subjects.find((s) => s.id === currentSubjectId);

  const checkboxItems = useMemo<Required<NestedCheckboxSelectProps>["items"]>(
    () =>
      currentSubject?.learningObjectives?.map((lo) => {
        const children =
          lo.learningObjectives?.map((c) => ({
            id: c.id,
            label: c.text,
            subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
            children: [],
          })) ?? [];

        return {
          id: lo.id,
          label: lo.text,
          subLabel: `${lo.id} - ${lo.numberOfQuestions} questions`,
          children,
        };
      }) ?? [],
    [currentSubject],
  );

  const allSelected = currentSubject?.learningObjectives.every((s) =>
    currentLearningObjectives.includes(s.id),
  );

  const someSelected = currentSubject?.learningObjectives.some((s) =>
    currentLearningObjectives.includes(s.id),
  );

  const availableQuestions = currentSubject
    ? getNumberOfAvailableQuestions(currentSubject, currentLearningObjectives)
    : 0;

  const maxQuestions = Math.min(200, availableQuestions);

  const onSubmit = form.handleSubmit(async (config) => {
    try {
      trackEvent("test.create", {
        questionBank,
        subject: config.subject,
        mode: config.mode,
      });
      const { test } = await createTest.mutateAsync({
        questionBank,
        config,
      });
      addTest({ test });
      // await router.push(test.href);
    } catch (error) {
      console.error(error);
      toast({
        content: "Something went wrong while creating the test. 😥",
        color: "danger",
      });
    }
  });

  return (
    <Stack sx={sx} onSubmit={onSubmit} onBlur={() => setData(form.getValues())}>
      <FormProvider {...form}>
        <HookFormSelect
          {...form.register("mode")}
          formLabel={"Mode"}
          disabled={form.formState.isSubmitting}
        >
          <Option value="exam">Exam</Option>
          <Option value="study">Study</Option>
        </HookFormSelect>

        <HookFormSelect
          {...form.register("subject")}
          formLabel={"Subject"}
          disabled={form.formState.isSubmitting}
        >
          {subjects.map((item) => (
            <Option value={item.id} key={item.id}>
              {`${item.id} - ${item.shortName}`}
            </Option>
          ))}
        </HookFormSelect>

        <Box className={formControlClasses.root}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={0.75}
          >
            <FormLabel>Learning Objectives</FormLabel>
            <Controller
              control={form.control}
              name="learningObjectiveIds"
              render={({ field: { onChange } }) => (
                <Checkbox
                  size="sm"
                  label={"select all"}
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  sx={{ flexDirection: "row-reverse" }}
                  onChange={() => {
                    if (allSelected) {
                      onChange([]);
                    } else {
                      onChange(
                        currentSubject?.learningObjectives.map((lo) => lo.id),
                      );
                    }
                  }}
                />
              )}
            />
          </Stack>
          {isMobile && (
            <Input
              readOnly
              value={(() => {
                if (allSelected) return "All!";
                if (!currentLearningObjectives.length) return "None";
                return "Some";
              })()}
              onClick={learningObjectivesModal.open}
            />
          )}
        </Box>

        {!isMobile && (
          <Sheet sx={{ p: 1, flex: 1, overflow: "auto" }}>
            <Controller
              control={form.control}
              name="learningObjectiveIds"
              render={({ field: { onChange, value } }) => (
                <NestedCheckboxSelect
                  items={checkboxItems}
                  values={value}
                  onChange={onChange}
                />
              )}
            />
          </Sheet>
        )}

        <Box className={formControlClasses.root}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={0.75}
          >
            <FormLabel>Number of Questions</FormLabel>
            <Typography level="body-xs">
              {currentMode === "study" && `max: ${maxQuestions}, `}
              {`total: ${availableQuestions}`}
            </Typography>
          </Stack>

          <Controller
            control={form.control}
            name="numberOfQuestions"
            render={({ field: { onChange, value } }) => (
              <SliderWithInput
                disabled={currentMode === "exam" || form.formState.isSubmitting}
                min={1}
                max={maxQuestions}
                value={value}
                onChange={(v) => onChange(v)}
              />
            )}
          />
        </Box>

        <Button
          size="lg"
          sx={{ mt: { xs: "auto", sm: 2 } }}
          type="submit"
          fullWidth
          disabled={!form.formState.isValid}
          loading={form.formState.isSubmitting}
        >
          Start!
        </Button>

        <Modal
          open={learningObjectivesModal.isOpen}
          onClose={learningObjectivesModal.close}
        >
          <ModalDialog layout="fullscreen" sx={{ p: 1 }}>
            <ModalClose />
            <FormLabel>Learning Objectives</FormLabel>
            <Controller
              control={form.control}
              name="learningObjectiveIds"
              render={({ field: { onChange, value } }) => (
                <NestedCheckboxSelect
                  sx={{ overflow: "auto", height: "90%", my: 1 }}
                  items={checkboxItems}
                  values={value}
                  onChange={onChange}
                />
              )}
            />
            <Button color="primary" onClick={learningObjectivesModal.close}>
              Submit
            </Button>
          </ModalDialog>
        </Modal>
      </FormProvider>
    </Stack>
  );
};
