import { default as ChangeIcon } from "@mui/icons-material/ChangeCircleOutlined";
import {
  Button,
  Stack,
  Modal,
  Divider,
  Typography,
  IconButton,
  ModalDialog,
  ModalClose,
} from "@mui/joy";
import {
  type QuestionBankName,
  questionVariantSchema,
  getNewVariant,
} from "@chair-flight/core/question-bank";
import { useDisclose } from "@chair-flight/react/components";
import { container } from "@chair-flight/trpc/client";
import { useQuestionEditor } from "../../hooks/use-question-editor";
import { QuestionEditorVariantOneTwo } from "./question-editor-variant-one-two";
import { QuestionEditorVariantSimple } from "./question-editor-variant-simple";
import { QuestionEditorVariantTrueOrFalse } from "./question-editor-variant-true-or-false";
import type {
  QuestionVariantType,
  QuestionVariant,
  QuestionVariantSimple,
  QuestionVariantOneTwo,
  QuestionVariantTrueOrFalse,
} from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorVariant"];

export const QuestionEditorVariant = container<Props, Params, Data>(
  ({ questionId, questionBank, sx, component = "div" }) => {
    const modal = useDisclose();
    const { type, variant, setQuestionVariant } = useQuestionEditor((s) => ({
      type: s[questionBank].afterState[questionId]?.variant?.type,
      variant: s[questionBank].afterState[questionId]?.variant,
      setQuestionVariant: s.setQuestionVariant,
    }));

    const changeVariant = (type: QuestionVariantType) => {
      modal.close();
      const newVariant = getNewVariant(type);
      setQuestionVariant({ questionBank, questionId, variant: newVariant });
    };

    const setVariant = (newVariant: QuestionVariant) => {
      const parse = questionVariantSchema.safeParse(newVariant);
      if (parse.success === false) return;
      const variant = parse.data;
      setQuestionVariant({ questionBank, questionId, variant });
    };

    return (
      <Stack sx={sx} component={component} gap={1}>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography level="h5">Variant {type}</Typography>
          <IconButton size="sm" sx={{ ml: 0.5 }} onClick={modal.open}>
            <ChangeIcon />
          </IconButton>
        </Stack>
        <Divider />

        {type &&
          {
            simple: (
              <QuestionEditorVariantSimple
                variant={variant as QuestionVariantSimple}
                setVariant={setVariant}
              />
            ),
            "true-or-false": (
              <QuestionEditorVariantTrueOrFalse
                variant={variant as QuestionVariantTrueOrFalse}
                setVariant={setVariant}
              />
            ),
            "one-two": (
              <QuestionEditorVariantOneTwo
                variant={variant as QuestionVariantOneTwo}
                setVariant={setVariant}
              />
            ),
            definition: null,
            "multiple-correct": null,
          }[type]}
        <Modal open={modal.isOpen} onClose={modal.close}>
          <ModalDialog>
            <ModalClose />
            <Typography level="h3">Variant Type</Typography>
            <Divider />
            <Stack gap={1}>
              <Button size="lg" onClick={() => changeVariant("simple")}>
                Simple
              </Button>
              <Button size="lg" onClick={() => changeVariant("one-two")}>
                One Two
              </Button>
              <Button size="lg" onClick={() => changeVariant("true-or-false")}>
                True or False
              </Button>
              <Button
                size="lg"
                onClick={() => changeVariant("multiple-correct")}
                disabled
              >
                Multiple Correct
              </Button>
              <Button
                size="lg"
                onClick={() => changeVariant("definition")}
                disabled
              >
                Definition
              </Button>
            </Stack>
            <Typography level="body-sm">
              *Changing variant will reset the question content!
            </Typography>
          </ModalDialog>
        </Modal>
      </Stack>
    );
  },
);

QuestionEditorVariant.displayName = "QuestionEditorVariant";
QuestionEditorVariant.getData = async () => ({});
QuestionEditorVariant.useData = () => ({});
