import {
  Box,
  Divider,
  Stack,
  Typography,
  dividerClasses,
  linkClasses,
} from "@mui/joy";
import type { BoxProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type ContentHeaderProps = {
  title?: string;
  actions?: React.ReactNode;
  links?: React.ReactNode;
} & Omit<BoxProps, "children">;

export const ContentHeader: FunctionComponent<ContentHeaderProps> = ({
  title,
  actions,
  links,
  children,
  ...props
}) => (
  <Box {...props}>
    <Stack direction="row">
      <Typography level="h3" component={"h1"} sx={{ mr: "auto" }}>
        {title}
      </Typography>
      {actions}
    </Stack>
    <Divider />
    <Stack
      direction="row"
      sx={{
        [`& .${linkClasses.disabled}`]: { color: `primary.300` },
        [`& .${dividerClasses.root}`]: { mx: 0.5, my: 0.25 },
      }}
    >
      {links}
    </Stack>
  </Box>
);
