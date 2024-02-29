"use client";

import { forwardRef, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as GitHub } from "@mui/icons-material/GitHub";
import {
  Box,
  Button,
  DialogTitle,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { z } from "zod";
import { HookFormInput, HookFormTextArea, toast } from "@cf/react/ui";
import { trpc } from "@cf/trpc/client";
import { container } from "@cf/trpc/client";
import { useBugReportStore } from "../../hooks/use-bug-report";

/** TODO Centralize this */
const GITHUB_URL = "https://github.com/PupoSDC/chair-flight/issues";

const BugReportForm = forwardRef<HTMLFormElement>((_, ref) => {
  const createIssue = trpc.common.github.createIssue.useMutation();
  const debugDataCallbacks = useBugReportStore((b) => b.debugDataCallbacks);
  const bugReportSchema = z.object({
    title: z.string().min(5).max(50),
    description: z.string().min(10).max(1000),
  });

  const defaultValues = {
    title: "",
    description: "",
  };

  const resolver = zodResolver(bugReportSchema);

  const form = useForm({ resolver, defaultValues });

  const onSubmit = form.handleSubmit(async (formData) => {
    const debugData = Object.entries(debugDataCallbacks).reduce(
      (sum, [key, cb]) => {
        if (!cb) return sum;
        sum[key] = cb();
        return sum;
      },
      {} as Record<string, unknown>,
    );

    const href = window.location.href;
    const vars = { ...formData, href, debugData };

    toast({ content: "Submitting..." });

    await createIssue
      .mutateAsync(vars)
      .then((response) =>
        toast({
          content: (
            <Box>
              <Typography
                level="body-lg"
                component="h4"
                children={"Issue has been Reported! 🎉🎉"}
              />
              <br />
              <Link
                href={response.url}
                target="_blank"
                children={"You can follow up on github!"}
              />
            </Box>
          ),
          color: "success",
        }),
      )
      .catch(() =>
        toast({
          content: "Failed to Submit 😔",
          color: "danger",
        }),
      );
  });

  return (
    <FormProvider {...form}>
      <ModalDialog
        ref={ref}
        component={"form"}
        onSubmit={onSubmit}
        sx={{ width: "calc(100% - 16px)", maxWidth: "md", overflow: "auto" }}
      >
        <ModalClose />
        <DialogTitle sx={{ display: "flex", flexDirection: "column" }}>
          <Typography level="h3">Report an Issue</Typography>
          <Typography level="body-sm">
            Completing this form will generate an issue on the{" "}
            <Link href={GITHUB_URL}>Github repository</Link>.<br />
            Afterwards, you can than track the issue in Github directly.
          </Typography>
        </DialogTitle>
        <HookFormInput
          {...form.register("title")}
          formLabel="Title"
          placeholder="Title"
        />
        <HookFormTextArea
          {...form.register("description")}
          formLabel="Description"
          placeholder="Provide us with the most accurate description of the issue you can :D"
          minRows={5}
          maxRows={10}
        />
        <Button
          sx={{ mt: 1, ml: "auto" }}
          type="submit"
          color="success"
          loading={createIssue.isLoading}
          endDecorator={<GitHub />}
        >
          Create Issue on Github
        </Button>
      </ModalDialog>
    </FormProvider>
  );
});

export const UserBugReport = container(() => {
  const isOpen = useBugReportStore((b) => b.isOpen);
  const setIsAvailable = useBugReportStore((b) => b.setIsAvailable);
  const setIsOpen = useBugReportStore((b) => b.setIsOpen);

  useEffect(() => {
    setIsAvailable(true);
    return () => setIsAvailable(false);
  });

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <BugReportForm />
    </Modal>
  );
});

UserBugReport.displayName = "UserBugReport";
UserBugReport.useData = () => ({});
UserBugReport.getData = async () => ({});
