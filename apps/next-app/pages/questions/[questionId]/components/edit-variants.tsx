import { memo, useCallback, useRef } from "react";
import Draggable from "react-draggable";
import { get, useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import { Box, Button, FormLabel, styled } from "@mui/joy";
import { toast } from "sonner";
import { getVariantPreview } from "@chair-flight/core/app";
import {
  HookFormErrorMessage,
  QuestionVariantPreview,
} from "@chair-flight/react/components";
import { useFormHistory } from "@chair-flight/react/containers";
import type {
  QuestionTemplate,
  QuestionVariant,
} from "@chair-flight/base/types";
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
`;

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
            text={getVariantPreview(variant)}
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
  const form = useFormContext<QuestionTemplate>();
  const questionId = router.query["questionId"] as string;
  const variants = Object.values(form.watch("variants"));
  const errors = form.formState.errors;
  const history = useFormHistory(questionId);
  const error = get(errors, "variants");

  console.log(error);

  const mergeVariants = useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return;
      const allVariants = form.getValues("variants");
      const newAllVariants = deepCopy(allVariants);
      const to = newAllVariants[toId];
      const from = newAllVariants[fromId];
      to.externalIds = [...new Set([...to.externalIds, ...from.externalIds])];
      delete newAllVariants[fromId];
      history.save();
      form.setValue(`variants`, newAllVariants);
      toast.success(`${fromId} merged into ${toId}`, {
        duration: 8000,
        action: { label: "Revert", onClick: history.undo },
      });
    },
    [history.undo, history.save, form.setValue, form.getValues],
  );

  const deleteVariant = useCallback(
    (variantId: string) => {
      const { [variantId]: _, ...remainingValues } = form.getValues("variants");
      history.save();
      form.setValue(`variants`, remainingValues);
      toast.success(`${variantId} deleted`, {
        duration: 8000,
        action: { label: "Revert", onClick: history.undo },
      });
    },
    [history.undo, history.save, form.setValue, form.getValues],
  );

  const openVariant = useCallback(
    (variantId: string) => {
      router.push(
        `/questions/${questionId}/edit?variantId=${variantId}`,
        undefined,
        { shallow: true },
      );
    },
    [questionId, router],
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
            error={get(errors, `variants.${variant.id}`)}
            key={variant.id}
            variant={variant}
            openVariant={openVariant}
            deleteVariant={deleteVariant}
            mergeVariants={mergeVariants}
          />
        ))}
      </ListContainer>
    </>
  );
};
