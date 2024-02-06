import { useFormContext, useWatch } from "react-hook-form";
import { default as GitHubIcon } from "@mui/icons-material/GitHub";
import { Button, Stack, Tooltip, Typography } from "@mui/joy";
import { SearchHeader, SearchList } from "@chair-flight/react/components";
import { QuestionManagerChangesListItem } from "./question-manager-changes-list-item";
import type { QuestionEditorState } from "../hooks/use-question-editor";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { FunctionComponent } from "react";

export const QuestionManagerChangesList: FunctionComponent<{
  questionBank: QuestionBankName;
}> = ({ questionBank }) => {
  const form = useFormContext<QuestionEditorState>();

  const deletedQuestions =  form.watch("deletedQuestions");
  const editedQuestions = form.watch("editedQuestions");
  const newQuestions = form.watch("newQuestions");

  const items = [
    ...Object.values(deletedQuestions).filter(Boolean),
    ...Object.values(editedQuestions).filter(Boolean),
    ...Object.values(newQuestions).filter(Boolean),
  ];

  return (
    <Stack sx={{ flex: 1 }}>
      <Stack direction={"row"} sx={{ mb: 1 }}>
        <Typography level="h3">Changes</Typography>
        <Tooltip title={"Create a pull Request"} variant="soft">
          <Button
            size="sm"
            sx={{ ml: "auto" }}
            color={"success"}
            endDecorator={<GitHubIcon />}
            children={"Create a Pull Request"}
          />
        </Tooltip>
      </Stack>
      <SearchList
        forceMode="mobile"
        sx={{ flex: 1, overflow: "hidden" }}
        items={items.filter(Boolean)}
        noDataMessage={"No changes so far!"}
        renderThead={() => null}
        renderTableRow={() => null}
        renderListItemContent={QuestionManagerChangesListItem}
      />
    </Stack>
  );
};
