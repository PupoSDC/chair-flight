import { forwardRef, useState } from "react";
import { Autocomplete, AutocompleteOption, Typography } from "@mui/joy";
import { trpc } from "@chair-flight/trpc/client";
import type { LearningObjective } from "@chair-flight/base/types";

export type InputAutocompleteLearningObjectivesProps = {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
};

export const InputAutocompleteLearningObjectives = forwardRef<
  HTMLDivElement,
  InputAutocompleteLearningObjectivesProps
>(({ value, onChange, onBlur }) => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.search.searchLearningObjectives.useQuery({
    q: search,
    limit: 10,
    cursor: 0,
  });

  const optionsMap = (data?.items ?? []).reduce<
    Record<string, LearningObjective>
  >((acc, result) => {
    acc[result.result.id] = result.result;
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
      options={data?.items.map((result) => result.result.id) ?? []}
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
            <Typography level="body1">
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
