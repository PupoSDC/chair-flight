import { useFormContext } from "react-hook-form";
import { default as CreateIcon } from "@mui/icons-material/Add";
import { default as CloseIcon } from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/joy";
import { AppLayout } from "@chair-flight/react/components";
import { AutoExpandTextArea } from "./AutoExpandTextArea";
import type {
  QuestionTemplate,
  QuestionVariantOneTwo,
} from "@chair-flight/base/types";
import type { FunctionComponent } from "react";

export type FormSnippetEditVariantOneTwoProps = {
  variantId: string;
};

type Statements =
  | "firstCorrectStatements"
  | "firstIncorrectStatements"
  | "secondCorrectStatements"
  | "secondIncorrectStatements";

const statements: Statements[] = [
  "firstCorrectStatements",
  "firstIncorrectStatements",
  "secondCorrectStatements",
  "secondIncorrectStatements",
];

export const FormSnippetEditVariantOneTwo: FunctionComponent<
  FormSnippetEditVariantOneTwoProps
> = ({ variantId }) => {
  const { register, setValue, watch } = useFormContext<QuestionTemplate>();
  const variant = watch(`variants.${variantId}`) as QuestionVariantOneTwo;

  return (
    <>
      {statements.map((field) => (
        <>
          <AppLayout.Header>
            <Typography level="h5">
              {field
                .split(/(?=[A-Z])/)
                .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
                .join(" ")}
            </Typography>
            <IconButton
              variant="plain"
              color="success"
              children={<CreateIcon />}
              onClick={() => {
                const length = variant[field].length;
                setValue(`variants.${variant.id}.${field}.${length}`, "");
              }}
            />
          </AppLayout.Header>
          {variant[field].map((_, index) => (
            <Box key={index} sx={{ my: 1, display: "flex" }}>
              <AutoExpandTextArea
                {...register(`variants.${variant.id}.${field}.${index}`)}
                sx={{ flexGrow: 1, ml: 1 }}
              />
              <IconButton
                variant="plain"
                color="danger"
                children={<CloseIcon />}
                onClick={() =>
                  setValue(
                    `variants.${variant.id}.${field}`,
                    variant[field].filter((_, i) => i !== index)
                  )
                }
              />
            </Box>
          ))}
        </>
      ))}
    </>
  );
};
