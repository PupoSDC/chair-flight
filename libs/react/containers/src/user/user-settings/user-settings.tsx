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
import { useUserPreferences } from "../../hooks/use-user-preferences";

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

export const UserSettings = () => {
  const {
    examModeAutoSkip,
    studyModeAutoSkip,
    setExamModeAutoSkip,
    setStudyModeAutoSkip,
  } = useUserPreferences();

  return (
    <Stack
      sx={{
        m: "auto",
        maxWidth: (t) => t.breakpoints.values.md,
        width: "100%",
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
          onChange={() => setExamModeAutoSkip(!examModeAutoSkip)}
        />
        <FormLabel>Skip to Next Question after answering (Exam Mode)</FormLabel>
      </StyledFormControl>
      <StyledFormControl>
        <Switch
          checked={studyModeAutoSkip}
          onChange={() => setStudyModeAutoSkip(!studyModeAutoSkip)}
        />
        <FormLabel>
          Skip to Next Question after answering correctly (Study Mode)
        </FormLabel>
      </StyledFormControl>
    </Stack>
  );
};
