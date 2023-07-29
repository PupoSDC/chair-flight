import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Card,
  CardContent,
  Link,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/joy";
import { default as fs } from "fs/promises";
import { DateTime } from "luxon";
import { default as path } from "path";
import { default as dedent } from "ts-dedent";
import {
  AppLayout,
  BlogPostChip,
  Header,
} from "@chair-flight/react/components";
import { AppHead, AppHeaderMenu } from "@chair-flight/react/containers";
import type { BlogPageMeta } from "./_blog-page.layout";
import type { GetStaticProps } from "next";
import type { FunctionComponent } from "react";

export type ArticlesIndexPageProps = {
  blogPostsMeta: BlogPageMeta[];
};

export const ArticlesIndexPage: FunctionComponent<ArticlesIndexPageProps> = ({
  blogPostsMeta,
}) => {
  return (
    <>
      <AppHead linkDescription={dedent``} />
      <Header>
        <AppHeaderMenu />
      </Header>
      <AppLayout.Main sx={{ maxWidth: "md" }}>
        <Typography component="h2" level="h3" fontWeight="bold" sx={{ pt: 4 }}>
          Posts
        </Typography>
        {blogPostsMeta.map((meta) => (
          <Card sx={{ mt: 2 }} key={meta.file}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                {meta.tags.map((tag) => (
                  <BlogPostChip key={tag} tag={tag} size="sm" />
                ))}
              </Box>
              <Typography level="h4" fontWeight="lg" color="primary">
                {meta.title}
              </Typography>
              <Typography level="body2">{meta.description}</Typography>
            </CardContent>
            <CardActions>
              <Box>
                <Typography level="body1" fontSize={"small"}>
                  {meta.author}
                </Typography>
                <Typography level="body2" fontSize={"small"}>
                  {DateTime.fromISO(meta.isoDate).toFormat("dd LLL yyyy")}
                </Typography>
              </Box>
              <Button
                color="primary"
                variant="plain"
                component={Link}
                href={`/articles/blog/${meta.file}`}
                children="Read&nbsp;More"
                endDecorator={<KeyboardArrowRightIcon />}
                sx={{ flex: 0, ml: "auto" }}
              />
            </CardActions>
          </Card>
        ))}
      </AppLayout.Main>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  ArticlesIndexPageProps
> = async () => {
  const folderPath = path.join(process.cwd(), "pages/articles/blog");
  const files = (await fs.readdir(folderPath)).filter((file) =>
    file.endsWith(".mdx"),
  );
  const content = await Promise.all(files.map((f) => import(`./${f}`)));
  const blogPostsMeta = content.map<BlogPageMeta>((c) => c.meta).reverse();
  return {
    props: {
      blogPostsMeta,
    },
  };
};

export default ArticlesIndexPage;
