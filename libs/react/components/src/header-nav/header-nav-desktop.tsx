import { forwardRef, useEffect, useRef, useState } from "react";
import { Box, Link, Menu, styled } from "@mui/joy";
import { HeaderNavMenuItem } from "./header-nav-menu-item";
import type { HeaderNavProps } from "./header-nav-props";

const StyledBox = styled(Box)`
  & > a {
    color: ${({ theme }) => theme.vars.palette.text.tertiary};
    text-decoration: none;
    font-weight: 700;
    margin-right: ${({ theme }) => theme.spacing(3)};
  }

  & > a:hover {
    color: ${({ theme }) => theme.vars.palette.text.secondary};
    text-decoration: none;
  }
`;

const StyledMenu = styled(Menu)`
  padding: ${({ theme }) => theme.spacing(1, 0)};
  width: 410px;
`;

export const HeaderNavDesktop = forwardRef<HTMLDivElement, HeaderNavProps>(
  ({ items, ...boxProps }, ref) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
      const handleDocumentClick = (e: MouseEvent) => {
        if (anchorEl && !anchorEl.contains(e.target as HTMLElement)) {
          setAnchorEl(null);
        }
      };
      document.addEventListener("click", handleDocumentClick);
      return () => document.removeEventListener("click", handleDocumentClick);
    }, [anchorEl]);

    return (
      <StyledBox {...boxProps} ref={ref} component="nav">
        {items.map((item, i) => (
          <Link
            key={item.href}
            onMouseOver={(e) => {
              if (!item.subItems?.length) {
                setAnchorEl(null);
                setSelectedIndex(0);
                return;
              }
              setAnchorEl(e.target as HTMLElement);
              setSelectedIndex(i);
              clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => {
                setAnchorEl(null);
              }, 2500);
            }}
            href={item.href}
            level="body2"
            children={item.title}
          />
        ))}

        <StyledMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
            setTimeout(() => setAnchorEl(null), 2500);
          }}
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={() => setAnchorEl(null)}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 15],
              },
            },
          ]}
        >
          {items[selectedIndex].subItems?.map((props) => (
            <HeaderNavMenuItem {...props} key={props.title} />
          ))}
        </StyledMenu>
      </StyledBox>
    );
  },
);
