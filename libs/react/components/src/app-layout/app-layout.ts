import { Box, Grid as MuiGrid, styled } from "@mui/joy";
import { HEADER_HEIGHT } from "../constants";
import type { BoxProps, GridProps } from "@mui/joy";

const Main = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  margin: 0 auto;
  max-width: ${({ theme }) => theme.breakpoints.values.xl}px;
  padding: ${({ theme }) => theme.spacing(1)};

  ${({ theme }) => theme.breakpoints.up("md")} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;

Main.defaultProps = {
  component: "main",
} as BoxProps;

const Grid = styled(MuiGrid)`
  height: 100%;
  width: 100%;
  display: flex;
`;

Grid.defaultProps = {
  container: true,
  spacing: { xs: 0, md: 2 },
} as GridProps;

const Column = styled(MuiGrid)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled(Box)`
  min-height: ${({ theme }) => theme.spacing(6)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(1, 0, 1, 0)};
  border-bottom: 1px solid ${({ theme }) => theme.vars.palette.divider};
`;

const ScrollableContainer = styled(Box)`
  margin: ${({ theme }) => theme.spacing(0, -1, 0, 0)};
  padding: ${({ theme }) => theme.spacing(0, 1, 0, 0)};
  overflow-y: auto;
  list-style: none;
`;

/**
 * CSS building blocks to build consistent page layouts for the more
 * "app-like" pages.
 */
export const AppLayout = {
  Main: Main as typeof Box,
  Grid: Grid as typeof MuiGrid,
  Column: Column as typeof MuiGrid,
  Header: Header as typeof Box,
  ScrollableContainer: ScrollableContainer as typeof Box,
};
