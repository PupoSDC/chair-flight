import { useState } from "react";
import { Autocomplete, AutocompleteOption, Typography } from "@mui/joy";
import { default as useAxios } from "axios-hooks";
import type { LearningObjective } from "@chair-flight/base/types";
import type { SearchLearningObjectivesResults } from "@chair-flight/core/app";
import type { FunctionComponent } from "react";

export type InputAutocompleteLearningObjectivesProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const InputAutocompleteLearningObjectives: FunctionComponent<
  InputAutocompleteLearningObjectivesProps
> = ({ value, onChange }) => {
  const [search, setSearch] = useState("");

  const [{ data, loading }] = useAxios<SearchLearningObjectivesResults>({
    url: "/api/search/learning-objectives",
    params: {
      q: search,
      pageSize: 10,
      page: 0,
    },
  });

  const optionsMap = (data?.results ?? []).reduce<
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
      loading={loading}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, newInputValue) => setSearch(newInputValue)}
      filterOptions={(options) => options}
      placeholder="Learning Objectives"
      options={data?.results.map((result) => result.result.id) ?? []}
      sx={{
        p: 0.5,
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
};
