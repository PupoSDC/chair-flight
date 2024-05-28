import { useState } from "react";
import { default as NextLink } from "next/link";
import { default as SearchIcon } from "@mui/icons-material/Search";
import {
  Autocomplete,
  AutocompleteOption,
  Chip,
  Divider,
  IconButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import { Markdown } from "@cf/react/markdown";
import { useDebounce } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import type { SxProps } from "@mui/joy/styles/types";
import type { FunctionComponent } from "react";

const trpcSearch = trpc.questionBank.search;
const useSuggestions = trpcSearch.getAutocompleteSuggestions.useQuery;

export const QuestionBankSearch: FunctionComponent<{
  sx?: SxProps;
}> = ({ sx }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 250);

  const suggestions = useSuggestions(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 3, keepPreviousData: true },
  );

  return (
    <Stack direction="row" sx={sx}>
      <Autocomplete
        freeSolo
        placeholder="Search Questions, docs, and more"
        inputValue={query}
        onInputChange={(e, value) => setQuery(value)}
        options={suggestions.data?.results || []}
        filterOptions={(x) => x}
        getOptionLabel={(option) => {
          return typeof option === "string" ? option : option.id;
        }}
        renderOption={(_, option) => (
          <AutocompleteOption
            color="neutral"
            component={NextLink}
            href={option.href}
            sx={{ display: "flex", flexDirection: "row" }}
          >
            <ListItemDecorator>
              <Chip
                color="primary"
                variant="solid"
                size="sm"
                children={option.questionBank.toUpperCase()}
                sx={{ mr: 1 }}
              />
            </ListItemDecorator>

            <ListItemContent sx={{ flex: 1 }}>
              <Markdown
                children={option.text}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              />

              <Stack direction={"row"} sx={{ color: "text.tertiary" }}>
                <Typography level="body-xs">{option.type}</Typography>
                <Divider orientation="vertical" sx={{ mx: 0.5 }} />
                <Typography level="body-xs">{option.id}</Typography>
              </Stack>
            </ListItemContent>
          </AutocompleteOption>
        )}
        sx={{
          flex: 1,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRight: "none",
        }}
      />
      <IconButton
        component={NextLink}
        href={`/content/search?q=${query}`}
        color="primary"
        variant="solid"
        sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        <SearchIcon />
      </IconButton>
    </Stack>
  );
};
