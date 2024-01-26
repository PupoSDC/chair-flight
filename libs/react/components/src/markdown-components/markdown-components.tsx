import { Box, Divider, Link, Typography } from "@mui/joy";
import type { MDXRemoteProps } from "next-mdx-remote";

export const markdownComponents: MDXRemoteProps["components"] = {
    h1: () => {
        throw new Error("No H1 components in blog posts!");
    },
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
    hr: () => (
        <Divider 
            sx={{ width: "100%", my: 2 }} 
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
    a: ({ children, href }) => (
        <Link href={href}> 
            {children}
        </Link>
    ),
    ul: ({ children }) => (
        <Box component="ul" sx={{ pl: 3 }}>
            {children}
        </Box>
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
                borderLeftColor: (t) => t.vars.palette.text.tertiary,
                "--joy-palette-text-secondary": (t) =>
                    t.vars.palette.text.tertiary,
                color: (t) => t.vars.palette.text.tertiary,
                background: (t) => t.vars.palette.background.surface,
            }}
        />
    ),
}