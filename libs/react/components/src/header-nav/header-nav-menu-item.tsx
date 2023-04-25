import { forwardRef } from "react";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Box, Link, Typography, styled } from "@mui/joy";
import type { HeaderNavMenuItemProps } from "./header-nav-props";
import type { BoxProps } from "@mui/joy";

const StyledMenuItem = styled("li")`
  padding: 0;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: unset;
  }

  & > a {
    padding: ${({ theme }) => theme.spacing(1, 2)};
    display: flex;
    width: 100%;
    cursor: "pointer";
  }

  & > a:hover {
    text-decoration: none;
  }

  & > a > svg:nth-of-type(1) {
    margin-right: ${({ theme }) => theme.spacing(2)};
    color: ${({ theme }) => theme.vars.palette.neutral.solidBg};
  }

  & > a:hover > svg:nth-of-type(1) {
    color: ${({ theme }) => theme.vars.palette.primary.plainColor};
  }

  & > a > div:nth-of-type(1) {
    flex: 1;
  }

  & > a > div:nth-of-type(1) > span:nth-of-type(1) {
    color: ${({ theme }) => theme.vars.palette.primary.plainColor};
  }

  & > a:hover > div:nth-of-type(1) > span:nth-of-type(1) {
    font-weight: 900;
  }

  & > a > svg:nth-of-type(2) {
    visibility: hidden;
    margin-left: ${({ theme }) => theme.spacing(2)};
    transition: transform 0.5s ease-in-out;
    transform: translateX(-100%);
    color: ${({ theme }) => theme.vars.palette.primary.plainColor};
  }

  & > a:hover > svg:nth-of-type(2) {
    visibility: visible;
    transform: translateX(0%);
  }
`;

export const HeaderNavMenuItem = forwardRef<
  HTMLLIElement,
  HeaderNavMenuItemProps & Pick<BoxProps, "sx" | "className">
>(({ title, subtitle, href, icon: Icon, ...props }, ref) => {
  return (
    <StyledMenuItem ref={ref} {...props}>
      <Link href={href}>
        <Icon fontSize={"xl2"} />
        <Box>
          <Typography level="body2" component="span" children={title} />
          <br />
          <Typography level="body3" component="span" children={subtitle} />
        </Box>
        <FlightTakeoffIcon fontSize={"xl2"} />
      </Link>
    </StyledMenuItem>
  );
});
