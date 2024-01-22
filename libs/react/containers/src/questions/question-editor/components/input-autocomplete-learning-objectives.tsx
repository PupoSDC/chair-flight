import { forwardRef, useState } from "react";
import { Autocomplete, AutocompleteOption, Typography } from "@mui/joy";
import { trpc } from "@chair-flight/trpc/client";

export type InputAutocompleteLearningObjectivesProps = {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
};

export const InputAutocompleteLearningObjectives = forwardRef<
  HTMLDivElement,
  InputAutocompleteLearningObjectivesProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ value, onChange, onBlur }, ref) => {
  const [search, setSearch] = useState("");

  const { data, isLoading } =
    trpc.questionBankLoSearch.searchLearningObjectives.useQuery({
      q: search,
      limit: 10,
      cursor: 0,
      questionBank: "atpl",
      subject: "all",
      course: "all",
      searchField: "all",
    });

  const optionsMap = (data?.items ?? []).reduce<
    Record<string, { id: string; text: string }>
  >((acc, result) => {
    acc[result.id] = result;
    return acc;
  }, {});

  return (
    <Autocomplete
      multiple
      freeSolo
      forcePopupIcon
      inputValue={search}
      value={value}
      loading={isLoading}
      onBlur={onBlur}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, newInputValue) => setSearch(newInputValue)}
      filterOptions={(options) => options}
      placeholder="Learning Objectives"
      options={data?.items.map((result) => result.id) ?? []}
      sx={{
        "& input": {
          minWidth: "100%",
        },
        "& input:not(:first-child)": {
          mt: 1,
        },
      }}
      renderOption={(props, id) => {
        return (
          <AutocompleteOption {...props}>
            <Typography level="body-md">
              <b> {optionsMap[id].id}</b>
              <br />
              {optionsMap[id].text}
            </Typography>
          </AutocompleteOption>
        );
      }}
    />
  );
});

InputAutocompleteLearningObjectives.displayName =
  "InputAutocompleteLearningObjectives";
