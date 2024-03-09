"use client";

import {
  Divider,
  FormControl,
  FormLabel,
  Stack,
  Switch,
  Typography,
  formLabelClasses,
  styled,
} from "@mui/joy";
import { useUserPreferences } from "../../hooks/use-user-preferences";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

const StyledFormControl = styled(FormControl)`
  display: flex;
  flex-direction: row;
  align-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(1)};

  & .${formLabelClasses.root} {
    display: block;
    margin-left: ${({ theme }) => theme.spacing(2)};
    margin-bottom: 0;
  }
`;

export type UserSettingsProps = {
  component?: StackProps["component"];
  sx?: StackProps["sx"];
};

export const UserSettings: FunctionComponent<UserSettingsProps> = ({
  sx,
  component = "div",
}) => {
  const [preferences, setUserPreference] = useUserPreferences();
  const { examModeAutoSkip, studyModeAutoSkip } = preferences;

  return (
    <Stack
      component={component}
      sx={{
        mx: "auto",
        maxWidth: (t) => t.breakpoints.values.md,
        width: "100%",
        ...sx,
      }}
    >
      <Typography level="h3">Theme Configuration</Typography>
      <Divider sx={{ mb: 1 }} />
      <Typography level="h3" sx={{ mt: 1 }}>
        Exam/Tests Configuration
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <StyledFormControl>
        <Switch
          checked={examModeAutoSkip}
          onChange={() =>
            setUserPreference({
              examModeAutoSkip: !examModeAutoSkip,
            })
          }
        />
        <FormLabel>
          Skip to Next Question after answering correctly (Exam Mode)
        </FormLabel>
      </StyledFormControl>
      <StyledFormControl>
        <Switch
          checked={studyModeAutoSkip}
          onChange={() =>
            setUserPreference({
              studyModeAutoSkip: !studyModeAutoSkip,
            })
          }
        />
        <FormLabel>
          Skip to Next Question after answering correctly (Study Mode)
        </FormLabel>
      </StyledFormControl>
    </Stack>
  );
};
