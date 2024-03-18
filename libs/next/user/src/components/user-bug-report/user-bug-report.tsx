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
import { HookFormInput, HookFormTextArea, toast } from "@cf/react/components";
import { trpc } from "@cf/trpc/client";
import { useBugReportStore } from "../../hooks/use-bug-report";
import type { FunctionComponent } from "react";

/** TODO Centralize this */
const GITHUB_URL = "https://github.com/PupoSDC/chair-flight/issues";

const bugReportSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(10).max(1000),
});

const defaultValues = {
  title: "",
  description: "",
};

const resolver = zodResolver(bugReportSchema);

export const UserBugReport: FunctionComponent = () => {
  const isOpen = useBugReportStore((b) => b.isOpen);
  const setIsOpen = useBugReportStore((b) => b.setIsOpen);
  const createIssue = trpc.common.github.createIssue.useMutation();
  const debugDataCallbacks = useBugReportStore((b) => b.debugDataCallbacks);
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
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <ModalDialog
        component={"form"}
        onSubmit={onSubmit}
        sx={{ width: "calc(100% - 16px)", maxWidth: "md", overflow: "auto" }}
      >
        <FormProvider {...form}>
          <ModalClose />
          <DialogTitle
            sx={{ display: "flex", flexDirection: "column" }}
            component="span"
          >
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
        </FormProvider>
      </ModalDialog>
    </Modal>
  );
};
