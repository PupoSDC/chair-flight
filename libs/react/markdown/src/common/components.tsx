import { Box, Divider, Link, Sheet, Table, Typography } from "@mui/joy";
import type { Components } from "react-markdown";

export const markdownComponents: Partial<Components> = {
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
      sx={{ mt: "1em" }}
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
      level="h5"
      component="h5"
      children={children}
    />
  ),
  p: ({ children }) => (
    <Typography
      sx={{ mt: "0.5em" }}
      level="body-md"
      component="p"
      children={children}
    />
  ),
  hr: () => <Divider orientation="horizontal" sx={{ width: "100%", my: 2 }} />,
  a: ({ children, href }) => <Link href={href} children={children} />,
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 3 }}>
      {children}
    </Box>
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
