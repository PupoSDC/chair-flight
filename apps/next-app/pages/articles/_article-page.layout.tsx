import { MDXProvider } from "@mdx-js/react";
import { Divider, Typography } from "@mui/joy";
import {
  AppHead,
  LayoutBackground,
  LayoutPublic,
} from "@chair-flight/react/containers";
import type { FunctionComponent, PropsWithChildren } from "react";

type ArticlePageLayoutProps = PropsWithChildren<{
  meta: {
    title: string;
    linkTitle: string;
    description: string;
    imageUrl: string;
  };
}>;

const bgSrc = "/images/background-article.png";
const bgAlt = "cool cockpit";

export const ArticlePageLayout: FunctionComponent<ArticlePageLayoutProps> = ({
  meta,
  children,
}) => {
  return (
    <LayoutPublic background={<LayoutBackground src={bgSrc} alt={bgAlt} />}>
      <AppHead
        title={meta.title}
        linkTitle={meta.linkTitle}
        linkDescription={meta.description}
      />
      <MDXProvider
        children={children}
        components={{
          h1: ({ children }) => (
            <Typography
              level="h1"
              component="h1"
              sx={{ mb: 0.5 }}
              children={children}
            />
          ),
          h2: ({ children }) => (
            <Typography level="h2" component="h2" children={children} />
          ),
          h3: ({ children }) => (
            <Typography level="h3" component="h3" children={children} />
          ),
          h4: ({ children }) => (
            <Typography level="h4" component="h4" children={children} />
          ),
          h5: ({ children }) => (
            <Typography level="h5" component="h5" children={children} />
          ),
          hr: () => <Divider sx={{ width: "100%", my: 2 }} />,
          p: ({ children }) => (
            <Typography level="body-md" component="p" children={children} />
          ),
        }}
      />
    </LayoutPublic>
  );
};
