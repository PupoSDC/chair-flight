import { keyframes } from "@emotion/react";
import { Grid, styled } from "@mui/joy";

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const RightContainer = styled(Grid)`
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-in;

  & > * {
    margin-bottom: ${(t) => t.theme.spacing(1)};
  }
`;
