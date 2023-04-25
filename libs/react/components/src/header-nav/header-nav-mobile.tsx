import { forwardRef } from "react";
import { Box, Divider, Link } from "@mui/joy";
import { HeaderNavMenuItem } from "./header-nav-menu-item";
import type { HeaderNavProps } from "./header-nav-props";

export const HeaderNavMobile = forwardRef<HTMLDivElement, HeaderNavProps>(
  ({ items, ...boxProps }, ref) => {
    return (
      <Box
        {...boxProps}
        ref={ref}
        component="nav"
        sx={{
          display: "flex",
          flexDirection: "column",
          ...boxProps.sx,
        }}
      >
        {items.map((item) => (
          <Box key={item.href}>
            <Link
              key={item.title}
              href={item.href}
              level="h4"
              children={item.title}
              sx={{
                cursor: "pointer",
                color: "primary.plainColor",
                "&:hover": {
                  color: "primary.light",
                  textDecoration: "none",
                },
              }}
            />
            <Divider />
            <Box>
              {item.subItems?.map((props) => (
                <HeaderNavMenuItem
                  {...props}
                  key={props.title}
                  sx={{
                    "& > a": {
                      paddingRight: 0,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
);
