import { useFormContext } from "react-hook-form";
import { default as CreateIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Sheet,
  Textarea,
} from "@mui/joy";
import type { QuestionVariantOneTwo } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

export type EditVariantFormSnippetOneTwoProps = {
  variantId: string;
};

type Statements =
  | "firstCorrectStatements"
  | "firstIncorrectStatements"
  | "secondCorrectStatements"
  | "secondIncorrectStatements";

const statementTypes: Statements[] = [
  "firstCorrectStatements",
  "firstIncorrectStatements",
  "secondCorrectStatements",
  "secondIncorrectStatements",
];

export const EditVariantFormSnippetOneTwo: FunctionComponent = () => {
  const { register, setValue, watch } = useFormContext<{
    variant: QuestionVariantOneTwo;
  }>();

  return (
    <>
      <FormControl sx={{ mt: 1 }}>
        <FormLabel>Question</FormLabel>
        <Textarea {...register("variant.question")} minRows={1} />
      </FormControl>
      {statementTypes.map((statementType) => {
        const statements = watch(`variant.${statementType}`);
        return (
          <Sheet key={statementType} sx={{ p: 1, my: 1 }} variant="outlined">
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel sx={{ mt: 1 }}>
                {statementType
                  .split(/(?=[A-Z])/)
                  .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
                  .join(" ")}
              </FormLabel>
              <IconButton
                variant="plain"
                color="success"
                children={<CreateIcon />}
                onClick={() => {
                  const statements = watch(`variant.${statementType}`);
                  const length = statements.length;
                  setValue(`variant.${statementType}.${length}`, "");
                }}
              />
            </Box>
            {statements.map((statement, index) => {
              return (
                <Box key={index} sx={{ my: 1, display: "flex" }}>
                  <Textarea
                    {...register(`variant.${statementType}.${index}`)}
                    minRows={1}
                    sx={{ flexGrow: 1, ml: 1 }}
                  />
                  <IconButton
                    variant="plain"
                    color="danger"
                    children={<CloseIcon />}
                    onClick={() =>
                      setValue(
                        `variant.${statementType}`,
                        statements.filter((_, i) => i !== index),
                      )
                    }
                  />
                </Box>
              );
            })}
          </Sheet>
        );
      })}
    </>
  );
};
