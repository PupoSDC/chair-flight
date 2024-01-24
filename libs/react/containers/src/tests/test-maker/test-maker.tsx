import { useEffect, useMemo, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  FormLabel,
  Option,
  Checkbox,
  Button,
  Stack,
  Skeleton,
  styled,
  formControlClasses,
  Input,
  ModalClose,
  ModalDialog,
  Modal,
  Typography,
  useTheme,
  Sheet,
} from "@mui/joy";
import {
  getNumberOfAvailableQuestions,
  newTestConfigurationSchema,
} from "@chair-flight/core/app";
import {
  HookFormSelect,
  NestedCheckboxSelect,
  SliderWithInput,
  toast,
  useDisclose,
  useMediaQuery,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { createUsePersistenceHook } from "../../hooks/use-persistence";
import { container } from "../../wraper/container";
import { useTestProgress } from "../hooks/use-test-progress";
import type { QuestionBankName } from "@chair-flight/base/types";
import type { NewTestConfiguration } from "@chair-flight/core/app";
import type { NestedCheckboxSelectProps } from "@chair-flight/react/components";

const resolver = zodResolver(newTestConfigurationSchema);

const defaultConfig = {} as Partial<NewTestConfiguration>;
const useTestMakerPersistence = {
  atpl: createUsePersistenceHook(`cf-test-maker-atpl`, defaultConfig, 1),
  type: createUsePersistenceHook(`cf-test-maker-type`, defaultConfig, 1),
  prep: createUsePersistenceHook(`cf-test-maker-prep`, defaultConfig, 1),
};

type Props = {
  questionBank: QuestionBankName;
  component?: "form";
  noSsr: true;
};

const TestMakerContainer = styled(Stack)`
  width: 100%;
  height: 100%;
  margin: auto;
  max-width: ${({ theme }) => theme.breakpoints.values.md};

  & .${formControlClasses.root}:not(:first-of-type) {
    margin-top: ${({ theme }) => theme.spacing(1)};
  }
` as typeof Stack;

export const TestMaker = container<Props>(({ questionBank, sx }) => {
  const router = useRouter();
  const useCreateTest = trpc.tests.createTest.useMutation;
  const useSubjects = trpc.tests.getSubjects.useSuspenseQuery;
  const addTest = useTestProgress((s) => s.addTest);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const learningObjectivesModal = useDisclose();
  const createTest = useCreateTest();
  const [{ subjects }] = useSubjects({ questionBank, course: "all" });
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

  const lastCurrentSubject = useRef(currentSubjectId);

  const currentSubject = useMemo(
    () => subjects.find((s) => s.id === currentSubjectId),
    [currentSubjectId, subjects],
  );

  const checkboxItems = useMemo<Required<NestedCheckboxSelectProps>["items"]>(
    () =>
      currentSubject?.learningObjectives?.map((c) => {
        const children =
          c.learningObjectives?.map((c) => ({
            id: c.id,
            label: c.text,
            subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
            children: [],
          })) ?? [];

        return {
          id: c.id,
          label: c.text,
          subLabel: `${c.id} - ${c.numberOfQuestions} questions`,
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
      const { test } = await createTest.mutateAsync({
        questionBank,
        config,
      });
      addTest({ test });
      await router.push(test.href);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the test. 😥");
    }
  });

  useEffect(() => {
    if (lastCurrentSubject.current === currentSubjectId) return;
    lastCurrentSubject.current = currentSubjectId;
    form.setValue(
      "learningObjectiveIds",
      currentSubject?.learningObjectives.map((f) => f.id) ?? [],
    );
    form.setValue(
      "numberOfQuestions",
      currentSubject?.numberOfExamQuestions ?? 40,
    );
  });

  return (
    <TestMakerContainer
      component={"form"}
      onSubmit={onSubmit}
      onBlur={() => setData(form.getValues())}
      sx={sx}
    >
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

        <DevTool control={form.control} />
      </FormProvider>
    </TestMakerContainer>
  );
});

TestMaker.displayName = "TestMaker";
TestMaker.getData = async () => ({});
TestMaker.useData = () => ({});

TestMaker.LoadingFallback = ({ sx }) => (
  <TestMakerContainer component={"form"} sx={sx}>
    <FormControl>
      <Skeleton variant="text" width={160} sx={{ mb: 0.75 }} />
      <Skeleton variant="rectangular" height={8 * 4.5} />
    </FormControl>

    <FormControl>
      <Skeleton variant="text" width={160} sx={{ mb: 0.75 }} />
      <Skeleton variant="rectangular" height={8 * 4.5} />
    </FormControl>

    <FormControl>
      <Skeleton variant="text" width={160} sx={{ mb: 0.75 }} />
      <Skeleton variant="rectangular" height={8 * 4.5} />
    </FormControl>

    <FormControl>
      <Skeleton variant="text" width={160} sx={{ mb: 0.75 }} />
      <Skeleton variant="rectangular" height={8 * 5.5} />
    </FormControl>

    <Skeleton variant="rectangular" height={8 * 5.5} sx={{ mt: "auto" }} />
  </TestMakerContainer>
);
