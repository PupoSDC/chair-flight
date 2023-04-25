import { IconButton as MuiIconButton, styled } from "@mui/joy";

const StyledIconButton = styled(MuiIconButton)`
  border: none;
  margin: 0;
  flex: 0;
  padding: 0;
  color: ${({ theme }) => theme.vars.palette.text.primary};
`;

StyledIconButton.defaultProps = {
  size: "sm",
  variant: "outlined",
};

export const IconButton = StyledIconButton as typeof MuiIconButton;
