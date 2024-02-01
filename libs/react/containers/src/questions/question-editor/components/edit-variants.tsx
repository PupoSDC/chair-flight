import { memo, useCallback, useRef } from "react";
import Draggable from "react-draggable";
import { get, useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import { Box, Button, FormLabel, Stack, Typography, styled } from "@mui/joy";
import { getQuestionPreview } from "@chair-flight/core/question-bank";
import {
  HookFormErrorMessage,
  QuestionVariantPreview,
  toast,
} from "@chair-flight/react/components";
import { useFormHistory } from "../../../hooks/use-form-history/use-form-history";
import type { EditQuestionFormValues } from "../types/edit-question-form-values";
import type { QuestionVariant } from "@chair-flight/core/question-bank";
import type { FunctionComponent } from "react";

const ListContainer = styled(Box)`
  list-style: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: scroll;
  margin: 0;
  padding: ${({ theme }) => theme.spacing(0, 2, 0, 0)};
` as typeof Box;

type DraggableVariantProps = {
  error: boolean;
  variant: QuestionVariant;
  openVariant: (variantId: string) => void;
  deleteVariant: (variantId: string) => void;
  mergeVariants: (fromVariantId: string, toVariantId: string) => void;
};

const EditVariant = memo<DraggableVariantProps>(
  ({ variant, error, openVariant, deleteVariant, mergeVariants }) => {
    const ref = useRef<HTMLLinkElement>(null);
    return (
      <Draggable
        nodeRef={ref}
        key={variant.id}
        position={{ x: 0, y: 0 }}
        onStop={(_, data) => {
          setTimeout(() => {
            const target = data.node.parentNode
              ?.querySelectorAll(":hover")?.[0]
              ?.getAttribute("data-variant-id");
            if (!target) return;
            mergeVariants(variant.id, target);
          }, 10);
        }}
      >
        <Box
          ref={ref}
          component="li"
          data-variant-id={variant.id}
          sx={{
            px: { xs: 0, md: 1 },
            py: 1,
            height: 400,
            width: { xs: 1, lg: 1 / 2 },
            "&.react-draggable-dragging": {
              zIndex: 1000,
            },
            "&.react-draggable-dragging > *": {
              zIndex: 1000,
            },
            "&:hover:not(.react-draggable-dragging)": {},
          }}
        >
          <QuestionVariantPreview
            id={variant.id}
            error={error}
            text={getQuestionPreview(variant)}
            learningObjectives={[]}
            externalIds={variant.externalIds}
            topRightCorner={
              <>
                <Button
                  children="Edit"
                  variant="plain"
                  sx={{ mr: 1 }}
                  onClick={() => openVariant(variant.id)}
                />
                <Button
                  variant="plain"
                  color="danger"
                  onClick={() => deleteVariant(variant.id)}
                  children="Delete"
                />
              </>
            }
            sx={{
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "left",
              overflowY: "auto",
            }}
          />
        </Box>
      </Draggable>
    );
  },
);

EditVariant.displayName = "EditVariant";

const deepCopy = <T,>(a: T): T => JSON.parse(JSON.stringify(a)) as T;

export const EditVariants: FunctionComponent = () => {
  const router = useRouter();
  const form = useFormContext<EditQuestionFormValues>();
  const questionId = router.query["questionId"] as string;
  const variants = Object.values(form.watch("question.variants"));
  const errors = form.formState.errors;
  const { undo, save } = useFormHistory(questionId);
  const { getValues, setValue } = form;

  const mergeVariants = useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return;
      const allVariants = getValues("question.variants");
      const newAllVariants = deepCopy(allVariants);
      const to = newAllVariants[toId];
      const from = newAllVariants[fromId];
      to.externalIds = [...new Set([...to.externalIds, ...from.externalIds])];
      delete newAllVariants[fromId];
      save();
      setValue(`question.variants`, newAllVariants);
      toast({
        content: (
          <Stack>
            <Typography level="h5">{`${fromId} merged into ${toId}`}</Typography>
            <Button onClick={undo} sx={{ mt: 2 }}>
              Reverse
            </Button>
          </Stack>
        ),
        timeout: 8000,
        color: "success",
      });
    },
    [undo, save, setValue, getValues],
  );

  const deleteVariant = useCallback(
    (variantId: string) => {
      const { [variantId]: _, ...remainingValues } =
        getValues("question.variants");
      save();
      setValue(`question.variants`, remainingValues);
      toast({
        content: (
          <Stack>
            <Typography level="h5">{`${variantId} deleted`}</Typography>
            <Button onClick={undo} sx={{ mt: 2 }}>
              Reverse
            </Button>
          </Stack>
        ),
        timeout: 8000,
      });
    },
    [undo, save, setValue, getValues],
  );

  const openVariant = useCallback(
    (variantId: string) => {
      const query = { ...router.query, variantId };
      router.replace({ query }, undefined, { shallow: true });
    },
    [router],
  );

  return (
    <>
      <FormLabel sx={{ ml: 1 }}>
        {`Variants (${variants.length})`}
        <HookFormErrorMessage name="variants" sx={{ mt: 0 }} />
      </FormLabel>
      <ListContainer component={"ul"}>
        {variants.map((variant) => (
          <EditVariant
            error={!!get(errors, `question.variants.${variant.id}`)}
            key={variant.id}
            variant={variant}
            openVariant={openVariant}
            deleteVariant={deleteVariant}
            mergeVariants={mergeVariants}
            data-testid={`variant-card`}
          />
        ))}
      </ListContainer>
    </>
  );
};
