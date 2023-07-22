import { forwardRef } from "react";
import { default as HandymanIcon } from "@mui/icons-material/Handyman";
import { Chip } from "@mui/joy";
import type { ChipProps, ColorPaletteProp } from "@mui/joy";
import type { FunctionComponent } from "react";

export type BlogPostTag = "Technical";

const tagToColor: Record<BlogPostTag, ColorPaletteProp> = {
  Technical: "primary",
};

const tagToIcon: Record<BlogPostTag, FunctionComponent> = {
  Technical: HandymanIcon,
};

export type BlogPostChipProps = Omit<
  ChipProps,
  "color" | "startDecorator" | "children"
> & {
  tag: BlogPostTag;
};

export const BlogPostChip = forwardRef<HTMLDivElement, BlogPostChipProps>(
  ({ tag, variant = "soft", ...props }, ref) => {
    const Icon = tagToIcon[tag];
    return (
      <Chip
        ref={ref}
        children={tag}
        startDecorator={<Icon />}
        color={tagToColor[tag]}
        variant={variant}
        {...props}
      />
    );
  }
);
