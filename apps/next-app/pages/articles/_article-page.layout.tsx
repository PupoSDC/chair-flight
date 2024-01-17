import { MDXProvider } from "@mdx-js/react";
import { Divider, Typography } from "@mui/joy";
import { AppHead, BackgroundFadedImage } from "@chair-flight/react/components";
import { LayoutPublic } from "@chair-flight/react/containers";
import type { FunctionComponent, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  meta: {
    title: string;
    linkTitle: string;
    description: string;
    imageUrl: string;
  };
}>;

export const ArticlePageLayout: FunctionComponent<Props> = ({
  meta,
  children,
}) => {
  return (
    <LayoutPublic background={<BackgroundFadedImage img="article" />}>
      <AppHead
        title={meta.title}
        linkTitle={meta.linkTitle}
        linkDescription={meta.description}
      />
      <MDXProvider
        children={children}
        components={{
          h1: ({ children }) => (
            <Typography level="h1" sx={{ mb: 0.5 }} children={children} />
          ),
          h2: ({ children }) => <Typography level="h2" children={children} />,
          h3: ({ children }) => <Typography level="h3" children={children} />,
          h4: ({ children }) => <Typography level="h4" children={children} />,
          h5: ({ children }) => <Typography level="h5" children={children} />,
          hr: () => <Divider sx={{ width: "100%", my: 2 }} />,
          p: ({ children }) => (
            <Typography level="body-md" children={children} />
          ),
        }}
      />
    </LayoutPublic>
  );
};
