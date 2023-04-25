import { FormControl, FormLabel, Box } from "@mui/joy";
import { useFormContext } from "react-hook-form";
import { AutoExpandTextArea } from "./AutoExpandTextArea";
import { FormSnippetEditVariantOneTwo } from "./FormSnippetEditVariantOneTwo";
import { FormSnippetEditVariantSimple } from "./FormSnippetEditVariantSimple";
import type { FunctionComponent } from "react";
import type { QuestionTemplate } from "@chair-flight/base/types";

export type FormSnippetEditVariantProps = {
  variantId: string;
};

export const FormSnippetEditVariant: FunctionComponent<
  FormSnippetEditVariantProps
> = ({ variantId }) => {
  const { register, watch } = useFormContext<QuestionTemplate>();
  const variant = watch(`variants.${variantId}`);

  return (
    <Box>
      <FormControl sx={{ mt: 1, mb: 1 }}>
        <FormLabel>Question</FormLabel>
        <AutoExpandTextArea {...register(`variants.${variantId}.question`)} />
      </FormControl>
      <FormControl sx={{ mt: 1 }}>
        <FormLabel>Explanation</FormLabel>
        <AutoExpandTextArea
          {...register(`variants.${variantId}.explanation`)}
        />
      </FormControl>
      {
        {
          ["simple"]: <FormSnippetEditVariantSimple variantId={variantId} />,
          ["one-two"]: <FormSnippetEditVariantOneTwo variantId={variantId} />,
          ["calculation"]: <>{`Not implemented yet :(`}</>,
        }[variant.type]
      }
    </Box>
  );
};
