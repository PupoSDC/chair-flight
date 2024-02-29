"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as GitHub } from "@mui/icons-material/GitHub";
import {
  Box,
  Button,
  DialogTitle,
  Link,
  ModalClose,
  Stack,
  Typography,
} from "@mui/joy";
import { z } from "zod";
import { trpc } from "@cf/next/trpc";
import { HookFormInput, HookFormTextArea, toast } from "@cf/react/ui";
import { useBugReportStore } from "../../hooks/use-bug-report";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

/** TODO Centralize this */
const GITHUB_URL = "https://github.com/PupoSDC/chair-flight/issues";

const bugReportSchema = z.object({
  authorName: z.string().min(3).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  title: z.string().min(5).max(50),
  description: z.string().min(10).max(1000),
});

const defaultValues = {
  title: "",
  description: "",
  authorName: "",
};

export const UserBugReportForm: FunctionComponent<
  Pick<StackProps, "sx" | "className">
> = (props) => {
  const resolver = zodResolver(bugReportSchema);
  const form = useForm({ resolver, defaultValues });
  const debugDataCallbacks = useBugReportStore((b) => b.debugDataCallbacks);
  const createIssue = trpc.github.createIssue.useMutation();

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
      <Stack {...props} component={"form"} onSubmit={onSubmit}>
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
          sx={{ mt: 1 }}
        />
        <HookFormTextArea
          {...form.register("description")}
          formLabel="Description"
          placeholder="Provide us with the most accurate description of the issue you can :D"
          minRows={5}
          maxRows={10}
          sx={{ mt: 1 }}
        />
        <HookFormInput
          {...form.register("authorName")}
          optional
          formLabel="Author's name / ID (Optional)"
          placeholder="Author's name"
          sx={{ mt: 1 }}
        />
        <Button
          sx={{ mt: 1, ml: "auto" }}
          type="submit"
          color="success"
          disabled={!form.formState.isValid}
          loading={createIssue.isLoading}
          endDecorator={<GitHub />}
        >
          Create Issue on Github
        </Button>
      </Stack>
    </FormProvider>
  );
};
