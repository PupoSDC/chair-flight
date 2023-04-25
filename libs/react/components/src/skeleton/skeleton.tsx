import { Box, styled } from "@mui/joy";

export const Skeleton = styled(Box)`
  background: ${({ theme }) => theme.vars.palette.neutral.plainActiveBg};
  animation: pulse 1.5s ease-in-out 0.5s infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
` as typeof Box;
