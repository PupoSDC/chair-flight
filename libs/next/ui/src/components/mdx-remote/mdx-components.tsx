import { Children } from "react";
import { Box, Divider, Link, Sheet, Table, Typography } from "@mui/joy";
import type { FunctionComponent } from "react";
import type { Components } from "react-markdown";

export const mdxComponents: Partial<Components> = {
  h1: ({ children }) => (
    <Typography
      sx={{ mt: "1em" }}
      level="h2"
      component="h1"
      children={children}
    />
  ),
  h2: ({ children }) => (
    <Typography
      sx={{ "&:not(:first-child)": { mt: "1em" } }}
      level="h2"
      component="h2"
      children={children}
    />
  ),
  h3: ({ children }) => (
    <Typography
      sx={{ mt: "1em" }}
      level="h3"
      component="h3"
      children={children}
    />
  ),
  h4: ({ children }) => (
    <Typography
      sx={{ mt: "1em" }}
      level="h4"
      component="h4"
      children={children}
    />
  ),
  h5: ({ children }) => (
    <Typography
      sx={{ mt: "1em" }}
      level="body-lg"
      component="h5"
      children={children}
    />
  ),
  p: ({ children }) => {
    const defaultOutput = (
      <Typography
        sx={{ mt: "0.5em" }}
        level="body-md"
        component="p"
        children={children}
      />
    );

    const childrenArray = Children.toArray(children);
    if (childrenArray.length > 1) return defaultOutput;

    const onlyChild = childrenArray[0] as unknown as {
      type?: FunctionComponent;
    };
    if (onlyChild?.type?.displayName !== "img") return defaultOutput;

    return <>{children}</>;
  },
  hr: () => <Divider orientation="horizontal" sx={{ width: "100%", my: 2 }} />,
  a: ({ children, href }) => <Link href={href} children={children} />,
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 3 }}>
      {children}
    </Box>
  ),
  img: ({ src, alt }) => (
    <Sheet
      sx={{
        width: "100%",
        p: 0.5,
        display: "flex",
        mx: 0,
        flexDirection: "column",
      }}
      component="figure"
    >
      <Box
        component={"img"}
        src={src}
        alt={alt}
        sx={{
          maxWidth: "100%",
          height: "auto",
          maxHeight: "500px",
          mx: "auto",
        }}
      />
      <Divider sx={{ my: 1 }} />
      <Box component="figcaption" sx={{ textAlign: "center", fontSize: "sm" }}>
        {alt}
      </Box>
    </Sheet>
  ),
  table: ({ children }) => (
    <Sheet sx={{ my: 1, p: 0.5 }}>
      <Table children={children} />
    </Sheet>
  ),
  blockquote: ({ children }) => (
    <Box
      children={children}
      component="blockquote"
      sx={{
        mx: 0,
        p: 2,
        borderRadius: 8,
        borderLeft: "solid 8px",
        borderLeftColor: "text.tertiary",
        "--joy-palette-text-secondary": "text.tertiary",
        color: "text.tertiary",
        background: "background.surface",
      }}
    />
  ),
};
