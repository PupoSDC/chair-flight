import { useRef } from "react";
import { default as Draggable } from "react-draggable";
import { useRouter } from "next/router";
import { Box, Button } from "@mui/joy";
import { getVariantPreview } from "@chair-flight/core/app";
import {
  actions,
  useAppDispatch,
  useAppSelector,
} from "@chair-flight/core/redux";
import { QuestionVariantPreview, toast } from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

export type DraggableVariantProps = {
  variantId: string;
  questionId: string;
};

export const EditVariant: FunctionComponent<DraggableVariantProps> = ({
  variantId,
  questionId,
}) => {
  const ref = useRef<HTMLLinkElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const variant = useAppSelector(
    (state) =>
      state.questionEditor.questions[questionId]?.currentVersion?.variants?.[
        variantId
      ]
  );

  // Just here to (hopefully) silence TS
  if (!variant) return null;

  const revert = () =>
    dispatch(
      actions.undoQuestionEditorLastChange({
        questionId,
      })
    );

  const mergeVariant = (fromVariantId: string, toVariantId: string) => {
    if (fromVariantId === toVariantId) return;
    dispatch(
      actions.mergeQuestionVariants({ questionId, fromVariantId, toVariantId })
    );
    toast.success(`${fromVariantId} merged into ${toVariantId}`, {
      duration: 8000,
      action: {
        label: "Revert",
        onClick: revert,
      },
    });
  };

  const deleteVariant = () => {
    dispatch(
      actions.deleteQuestionVariant({
        questionId,
        variantId,
      })
    );
    toast.success(`${variantId} deleted`, {
      duration: 8000,
      action: {
        label: "Revert",
        onClick: revert,
      },
    });
  };

  const openModal = () => {
    router.query["variantId"] = variantId;
    router.replace(router);
  };

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
          mergeVariant(variant.id, target);
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
          text={getVariantPreview(variant)}
          learningObjectives={[]}
          externalIds={variant.externalIds}
          topRightCorner={
            <>
              <Button
                children="Edit"
                variant="plain"
                sx={{ mr: 1 }}
                onClick={openModal}
              />
              <Button
                variant="plain"
                color="danger"
                onClick={deleteVariant}
                children="Delete"
              />
            </>
          }
          sx={{
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
          }}
        />
      </Box>
    </Draggable>
  );
};
