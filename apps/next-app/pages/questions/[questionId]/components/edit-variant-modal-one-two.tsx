import { get, useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import { default as CreateIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { Box, FormLabel, IconButton, Sheet } from "@mui/joy";
import { HookFormTextArea } from "@chair-flight/react/components";
import type { QuestionTemplate } from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

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

export const EditVariantModalOneTwo: FunctionComponent = () => {
  const router = useRouter();
  const form = useFormContext<QuestionTemplate>();
  const variantId = router.query["variantId"] as string;

  return (
    <>
      <HookFormTextArea
        {...form.register(`variants.${variantId}.question`)}
        formLabel={"Question"}
        minRows={1}
      />
      {statementTypes.map((statementType) => {
        const statements = form.watch(`variants.${variantId}.${statementType}`);
        const error = get(
          form.formState.errors,
          `variants.${variantId}.${statementType}`,
        );

        return (
          <Sheet
            key={statementType}
            sx={{ p: 1, my: 1 }}
            variant="outlined"
            color={error ? "danger" : "neutral"}
          >
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
                  const length = statements.length;
                  form.setValue(
                    `variants.${variantId}.${statementType}.${length}`,
                    "",
                  );
                  form.clearErrors(`variants.${variantId}.${statementType}`);
                }}
              />
            </Box>
            {statements.map((_, index) => {
              return (
                <Box
                  key={index}
                  sx={{ my: 1, display: "flex", justifyContent: "flex-start" }}
                >
                  <HookFormTextArea
                    {...form.register(
                      `variants.${variantId}.${statementType}.${index}`,
                    )}
                    formLabel={"Question"}
                    minRows={1}
                  />
                  <IconButton
                    variant="plain"
                    color="danger"
                    children={<CloseIcon />}
                    onClick={() =>
                      form.setValue(
                        `variants.${variantId}.${statementType}`,
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
