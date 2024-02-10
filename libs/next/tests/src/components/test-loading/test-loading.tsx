import { Skeleton, Stack } from "@mui/joy";
import { QuestionMultipleChoice } from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

export const TestLoading: FunctionComponent = () => (
  <Stack>
    <Skeleton
      variant="rectangular"
      sx={{
        width: "100%",
        boxSizing: "content-box",
        height: (t) => t.spacing(6),
        mb: 2,
      }}
    />
    <QuestionMultipleChoice loading />
  </Stack>
);
