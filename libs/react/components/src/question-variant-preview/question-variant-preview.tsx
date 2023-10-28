import { forwardRef } from "react";
import { Box, Chip, Divider, Sheet, Typography } from "@mui/joy";
import { MarkdownClient } from "../markdown-client";
import type { SheetProps } from "@mui/joy";

export type QuestionVariantPreviewProps = {
  id: string;
  variantId?: string;
  text?: string;
  error?: boolean;
  learningObjectives?: string[];
  externalIds?: string[];
  highLightTerms?: string[];
  topRightCorner?: JSX.Element;
  showCorrect?: boolean;
} & Pick<SheetProps, "sx" | "className" | "onClick" | "component">;

export const QuestionVariantPreview = forwardRef<
  HTMLDivElement,
  QuestionVariantPreviewProps
>(
  (
    {
      id,
      variantId,
      text,
      learningObjectives,
      externalIds,
      topRightCorner,
      sx,
      error,
      className,
      component,
      onClick,
    },
    ref,
  ) => (
    <Sheet
      ref={ref}
      variant="outlined"
      className={className}
      component={component as "div"}
      onClick={onClick}
      color={error ? "danger" : "neutral"}
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        borderRadius: "sm",
        listStyle: "none",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        fontWeight: "normal",
        "&.MuiButton-root:hover": {
          backgroundColor: (t) => t.vars.palette.primary.outlinedHoverBg,
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          mb: 1,
          gap: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="h5">{`${id}`}</Typography>{" "}
        {variantId && <Typography level="body-sm">{`${variantId}`}</Typography>}
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          {topRightCorner}
        </Box>
      </Box>
      <Divider component="div" sx={{ my: 1 }} />
      <Box sx={{ gap: 2, display: "block", overflowX: "auto" }}>
        <MarkdownClient>{text ?? ""}</MarkdownClient>
      </Box>
      <Divider component="div" sx={{ my: 1 }} />
      <Box sx={{ display: "block", width: "100%" }}>
        {learningObjectives && (
          <Box sx={{ display: "flex", gap: 1, overflow: "auto" }}>
            {learningObjectives.map((lo) => (
              <Chip
                key={lo}
                variant="outlined"
                color="neutral"
                size="sm"
                sx={{ borderRadius: "sm", mb: 1 }}
                children={lo}
              />
            ))}
          </Box>
        )}
        {externalIds && (
          <Box sx={{ display: "flex", gap: 1, overflow: "auto" }}>
            {externalIds.map((id) => (
              <Chip
                key={id}
                variant="outlined"
                color="neutral"
                size="sm"
                sx={{ borderRadius: "sm", mb: 1 }}
                children={id}
              />
            ))}
          </Box>
        )}
      </Box>
    </Sheet>
  ),
);

QuestionVariantPreview.displayName = "QuestionVariantPreview";
