import { forwardRef } from "react";
import { Box, Grid as MuiGrid, styled } from "@mui/joy";
import { HEADER_HEIGHT } from "../constants";
import type { BoxProps, GridProps } from "@mui/joy";

const MainRoot = forwardRef<HTMLDivElement, BoxProps>(
  ({ component = "main", ...props }, ref) => (
    <Box component={component} ref={ref} {...props} />
  ),
);

MainRoot.displayName = "MainRoot";

const Main = styled(MainRoot)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  max-width: ${({ theme }) => theme.breakpoints.values.xl}px;
  margin: ${({ theme }) => theme.spacing(0, "auto")};
  padding: ${({ theme }) => theme.spacing(0, 1)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(0, 2)};
  }
`;

const MainGridRoot = forwardRef<HTMLDivElement, GridProps>(
  ({ container = true, spacing = { xs: 0, sm: 2 }, ...props }, ref) => (
    <MuiGrid container={container} spacing={spacing} ref={ref} {...props} />
  ),
);

MainGridRoot.displayName = "MainGridRoot";

const MainGrid = styled(MainGridRoot)`
  height: 100%;
  width: 100%;
  display: flex;
  margin: ${({ theme }) => theme.spacing(0)};
`;

const MainGridFixedColumn = styled(MuiGrid)`
  height: 100%;
  display: flex;
  flex-direction: column;

  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;

const MainGridScrollableColumnRoot = forwardRef<HTMLDivElement, GridProps>(
  ({ xs = true, ...props }, ref) => <MuiGrid xs={xs} ref={ref} {...props} />,
);

MainGridScrollableColumnRoot.displayName = "MainGridScrollableColumnRoot";

const MainGridScrollableColumn = styled(MainGridScrollableColumnRoot)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 0;
  padding-bottom: 0;
  margin-right: ${({ theme }) => theme.spacing(-1)};
  padding-right: ${({ theme }) => theme.spacing(1)};
  overflow-y: auto;
  list-style: none;
`;

const Header = styled(Box)`
  min-height: ${({ theme }) => theme.spacing(6)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(1, 0, 1, 0)};
  border-bottom: 1px solid ${({ theme }) => theme.vars.palette.divider};
`;

const BackgroundImageContainer = styled(Box)`
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  & > img {
    user-select: none;
    width: 600px;
    max-width: 600px;
    height: auto;
    mask: linear-gradient(90deg, rgba(0, 0, 0, 0.2), transparent) top right /
      cover;
  }
`;

/**
 * CSS building blocks to build consistent page layouts for the more
 * "app-like" pages.
 */
export const AppLayout = {
  Main: Main as typeof Box,
  MainGrid: MainGrid as typeof MuiGrid,
  MainGridFixedColumn: MainGridFixedColumn as typeof MuiGrid,
  MainGridScrollableColumn: MainGridScrollableColumn as typeof MuiGrid,
  Header: Header as typeof Box,
  BackgroundImageContainer: BackgroundImageContainer as typeof Box,
};
