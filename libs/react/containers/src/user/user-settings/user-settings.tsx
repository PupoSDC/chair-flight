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
import { ThemeButton } from "@chair-flight/react/components";
import { container } from "../../wraper/container";
import { useUserPreferences } from "../hooks/use-user-preferences";
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

const UserSettingsFallback: FunctionComponent = () => null;

export const UserSettings = container(({ sx, component = "section" }) => {
  const [preferences, setUserPreference] = useUserPreferences();
  const { examModeAutoSkip, studyModeAutoSkip } = preferences;

  return (
    <Stack
      component={component}
      sx={{
        m: "auto",
        maxWidth: (t) => t.breakpoints.values.md,
        width: "100%",
        ...sx,
      }}
    >
      <Typography level="h3">Theme Configuration</Typography>
      <Divider sx={{ mb: 1 }} />
      <StyledFormControl>
        <ThemeButton sx={{ fontSize: 16, minHeight: 16 }} />
        <FormLabel>Toggle light/dark mode</FormLabel>
      </StyledFormControl>

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
});

UserSettings.displayName = "UserSettings";
UserSettings.getData = async () => ({});
UserSettings.useData = () => ({});
UserSettings.LoadingFallback = UserSettingsFallback;
