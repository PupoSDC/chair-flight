import { default as CelebrationIcon } from "@mui/icons-material/Celebration";
import { default as HandymanIcon } from "@mui/icons-material/Handyman";
import { default as LibraryBooksIcon } from "@mui/icons-material/LibraryBooks";
import { Chip } from "@mui/joy";
import type { ChipProps, ColorPaletteProp } from "@mui/joy";
import type { FunctionComponent } from "react";

export type BlogPostTag = "Technical" | "Feature" | "Content";

const tagToColor: Record<BlogPostTag, ColorPaletteProp> = {
  Technical: "primary",
  Feature: "success",
  Content: "warning",
};

const tagToIcon: Record<BlogPostTag, FunctionComponent> = {
  Technical: HandymanIcon,
  Feature: CelebrationIcon,
  Content: LibraryBooksIcon,
};

export type BlogPostChipProps = Omit<
  ChipProps,
  "color" | "startDecorator" | "children"
> & {
  tag: BlogPostTag;
};

export const BlogPostChip: FunctionComponent<BlogPostChipProps> = ({
  tag,
  variant = "soft",
  ...props
}) => {
  const Icon = tagToIcon[tag];
  return (
    <Chip
      {...props}
      children={tag}
      startDecorator={<Icon />}
      color={tagToColor[tag]}
      variant={variant}
      sx={{ px: 1, py: 0.5, ...props.sx }}
    />
  );
};
