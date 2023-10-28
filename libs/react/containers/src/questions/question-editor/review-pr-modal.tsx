import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import { default as GitHubIcon } from "@mui/icons-material/GitHub";
import {
  Box,
  Button,
  Link,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import {
  HookFormInput,
  HookFormTextArea,
  toast,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import type { EditQuestionFormValues } from "./types/edit-question-form-values";
import type { FunctionComponent } from "react";

const useUpdateQuestion = trpc.questionBankAtpl.updateQuestion.useMutation;

export const ReviewPrModal: FunctionComponent = () => {
  const router = useRouter();
  const form = useFormContext<EditQuestionFormValues>();
  const isOpen = router.query["modal"] === "review";
  const updateQuestion = useUpdateQuestion();

  const navigateAwayFromModal = () => {
    router.push(`/questions/${router.query["questionId"]}/edit`, undefined, {
      shallow: true,
    });
  };

  const onSubmit = form.handleSubmit(async (variables) => {
    const questionId = variables.question.id;
    toast.promise(updateQuestion.mutateAsync(variables), {
      loading: "Submitting...",
      error: "Failed to Submit 😔",
      success: (response) => {
        setTimeout(() => router.push(`/questions/${questionId}`), 3000);
        return (
          <Box>
            <Typography
              level="h5"
              component="h4"
              children={"Pull request is Submitted! 🎉🎉"}
            />
            <br />
            <Link
              href={response.url}
              target="_blank"
              children={"You can follow up on github!"}
            />
          </Box>
        );
      },
    });
  });

  return (
    <Modal open={isOpen} onClose={navigateAwayFromModal}>
      <ModalDialog
        component="form"
        onSubmit={onSubmit}
        sx={(theme) => ({
          overflowY: "auto",
          [theme.breakpoints.down("md")]: {
            top: "unset",
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            transform: "none",
            maxWidth: "unset",
          },
        })}
      >
        <ModalClose />
        <div>
          <Typography level="h4" component="h1">
            <b>Open a Pull Request</b>
          </Typography>
          <Typography level="body-sm" sx={{ mt: 2 }}>
            By completing the following steps you will open a Pull Request on
            GitHub.
            <br />
            The Pull Request will be reviewed by a member of the Chair Flight
            team and if approved, the changes will be merged into the
            application and be available for all our users.
            <br />
            To make this process a bit easier please supply a short title and
            description of the changes you made. You can optionally provide your
            e-mail so that the changes are properly credited to yourself!
          </Typography>
        </div>
        <div>
          <HookFormInput
            {...form.register("requestData.title")}
            formLabel="Title"
            placeholder="Title"
            sx={{ mt: 2 }}
          />
          <HookFormTextArea
            {...form.register("requestData.description")}
            formLabel="Description"
            placeholder="Description"
            minRows={5}
            maxRows={5}
            sx={{ mt: 2 }}
          />
          <HookFormInput
            {...form.register("requestData.authorName")}
            optional
            formLabel="Author's name / ID (Optional)"
            placeholder="Author's name"
            sx={{ mt: 2 }}
          />
          <HookFormInput
            {...form.register("requestData.email")}
            optional
            formLabel="Email (Optional)"
            placeholder="Email"
            sx={{ mt: 2 }}
          />
          <Button
            sx={{ mt: 2 }}
            fullWidth
            color="success"
            disabled={!form.formState.isValid}
            type="submit"
            endDecorator={<GitHubIcon />}
            children={"Create a Pull Request!"}
          />
        </div>
      </ModalDialog>
    </Modal>
  );
};
