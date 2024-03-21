import { forwardRef } from "react";
import { default as KeyboardArrowRightIcon } from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from "@mui/joy";
import { BlogPostChip } from "../blog-post-chip";
import type { BlogPostTag } from "../blog-post-chip";
import type { CardProps } from "@mui/joy";

export type BlogPostCardProps = {
  tag: BlogPostTag;
  title: string;
  description: string;
  author: string;
  date: string;
  href: string;
  imageUrl?: string;
} & CardProps;

export const BlogPostCard = forwardRef<HTMLDivElement, BlogPostCardProps>(
  (
    { tag, title, description, author, date, href, imageUrl, ...cardProps },
    ref,
  ) => (
    <Card {...cardProps} ref={ref}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <BlogPostChip key={tag} tag={tag} size="sm" />
        </Box>
        <Typography level="h3" color="primary">
          {title}
        </Typography>
        <Typography level="body-sm">{description}</Typography>
      </CardContent>
      <CardActions>
        <Box>
          <Typography level="body-sm">{author}</Typography>
          <Typography level="body-xs">{date}</Typography>
        </Box>
        <Button
          color="primary"
          variant="plain"
          component={Link}
          href={href}
          children="Read&nbsp;More"
          endDecorator={<KeyboardArrowRightIcon />}
          sx={{ flex: 0, ml: "auto" }}
        />
      </CardActions>
    </Card>
  ),
);

BlogPostCard.displayName = "BlogPostCard";
