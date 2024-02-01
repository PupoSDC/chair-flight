import { useState, type FunctionComponent, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { default as CodeIcon } from "@mui/icons-material/Code";
import { default as CodeOffIcon } from "@mui/icons-material/CodeOff";
import { default as RestartAltIcon } from "@mui/icons-material/RestartAlt";
import { default as UndoIcon } from "@mui/icons-material/Undo";
import { Badge, IconButton, Modal, Stack, Tooltip, Typography } from "@mui/joy";
import { FormControl, FormLabel, ModalDialog, Grid } from "@mui/joy";
import { getVariantPreview } from "@chair-flight/base/utils";
import { toast } from "@chair-flight/react/components";
import { MarkdownClient } from "@chair-flight/react/components";
import { useFormHistory } from "../../../hooks/use-form-history/use-form-history";
import { EditVariantModalAsCode } from "./edit-variant-modal-as-code";
import { EditVariantModalOneTwo } from "./edit-variant-modal-one-two";
import { EditVariantModalSimple } from "./edit-variant-modal-simple";
import { InputCommaSeparatedValues } from "./input-comma-seperated-values";
import type { EditQuestionFormValues } from "../types/edit-question-form-values";

export const EditVariantModal: FunctionComponent = () => {
  const [codeEditor, setCodeEditor] = useState(false);
  const router = useRouter();
  const form = useFormContext<EditQuestionFormValues>();
  const variantId = router.query["variantId"] as string;
  const name = `question.variants.${router.query["variantId"]}` as const;
  const variant = form.watch(name);
  const history = useFormHistory(name);
  const { clear, save } = history;

  const variantSpecificFormSnippet = {
    "one-two": <EditVariantModalOneTwo />,
    simple: <EditVariantModalSimple />,
    calculation: <div>Not Implemented!</div>,
    "true-or-false": <div>Not Implemented!</div>,
  }[variant?.type ?? "one-two"];

  const closeModal = () => {
    const { variantId, ...query } = router.query;
    router.replace({ query }, undefined, { shallow: true });
  };

  const validate = async () => {
    const isValid = await form.trigger(`question.variants.${variantId}`);
    if (isValid) {
      toast({ content: "Validation successful! 🎉", color: "success" });
    } else {
      toast({ content: "Validation failed! 😢", color: "danger" });
    }
  };

  useEffect(() => {
    clear();
    save();
    return () => clear();
  }, [clear, save]);

  return (
    <Modal open={!!variant}>
      <ModalDialog layout="fullscreen">
        {variant && (
          <>
            <Stack direction="row" alignItems="center">
              <Typography level="h4">Edit Variant</Typography>
              <Tooltip title="undo" variant="soft">
                <IconButton
                  disabled={!history.isUndoAvailable}
                  color={"primary"}
                  variant="plain"
                  onClick={() => history.undo()}
                  sx={{ ml: 1 }}
                >
                  <Badge
                    badgeContent={history.historyLength - 1}
                    size="sm"
                    variant="soft"
                    max={99}
                  >
                    <UndoIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Code Editor" variant="soft">
                <IconButton
                  color={"primary"}
                  variant="plain"
                  sx={{ ml: 1 }}
                  onClick={() => setCodeEditor((v) => !v)}
                >
                  {codeEditor ? <CodeOffIcon /> : <CodeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="re-validate" variant="soft">
                <IconButton
                  color={"primary"}
                  variant="plain"
                  onClick={() => validate()}
                  sx={{ ml: 1 }}
                >
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save and Close" variant="soft">
                <IconButton
                  color="primary"
                  variant="plain"
                  children={<CloseIcon />}
                  onClick={closeModal}
                  sx={{ ml: 1 }}
                />
              </Tooltip>
            </Stack>
            <Grid
              container
              spacing={2}
              sx={{ height: "100%", overflow: "hidden" }}
              onBlur={() => save()}
            >
              <Grid xs={8} sx={{ overflow: "scroll", height: "100%", pr: 2 }}>
                {codeEditor ? (
                  <EditVariantModalAsCode />
                ) : (
                  <>
                    {variantSpecificFormSnippet}
                    <FormControl sx={{ mt: 1 }}>
                      <FormLabel>Annexes</FormLabel>
                      <Controller
                        control={form.control}
                        name={`question.variants.${variantId}.annexes`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <InputCommaSeparatedValues
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl sx={{ mt: 1 }}>
                      <FormLabel>External Ids</FormLabel>
                      <Controller
                        control={form.control}
                        name={`question.variants.${variantId}.externalIds`}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <InputCommaSeparatedValues
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                          />
                        )}
                      />
                    </FormControl>
                  </>
                )}
              </Grid>
              <Grid md={4}>
                <MarkdownClient>{getVariantPreview(variant)}</MarkdownClient>
              </Grid>
            </Grid>
          </>
        )}
      </ModalDialog>
    </Modal>
  );
};
