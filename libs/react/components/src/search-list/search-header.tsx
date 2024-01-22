import { Stack, selectClasses, styled } from "@mui/joy";

/**
 * Companion container for search list. Add this for a nice
 * consistent header to search lists
 */
export const SearchHeader = styled(Stack)`
  gap: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(1)};

  .${selectClasses.root} {
    width: 13em;
  }

  ${({ theme }) => theme.breakpoints.up("sm")} {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;
