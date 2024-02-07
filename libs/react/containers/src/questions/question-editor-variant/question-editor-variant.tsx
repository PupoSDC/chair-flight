import { useState, useTransition } from "react";
import { default as Editor } from "@monaco-editor/react";
import {
  Option,
  Button,
  ButtonGroup,
  Divider,
  Select,
  Stack,
  Box,
} from "@mui/joy";
import YAML from "yaml";
import { ZodError } from "zod";
import { getRandomId } from "@chair-flight/base/utils";
import {
  createTestQuestion,
  getQuestionPreview,
  type QuestionBankName,
  questionVariantSchema,
  getNewVariant,
} from "@chair-flight/core/question-bank";
import { MarkdownClient } from "@chair-flight/react/components";
import { container } from "../../wraper";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import { QuestionStandAloneComponent } from "../question-stand-alone/question-stand-alone";
import type { QuestionVariantType } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/server";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorVariant"];

type RhsMode = "preview" | "demo" | "validation";

const variants = [
  "simple",
  "multiple-correct",
  "definition",
  "true-or-false",
  "one-two",
] satisfies QuestionVariantType[];

export const QuestionEditorVariant = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    const [variantType, setVariantType] =
      useState<QuestionVariantType>("simple");
    const [rhsMode, setRhsMode] = useState<RhsMode>("preview");
    const [seed, setSeed] = useState(getRandomId());
    const [validationYaml, setValidationYAML] = useState("");
    const [, startTransition] = useTransition();
    const hasValidationErrors = !!validationYaml;

    const variant = useQuestionEditor((s) => {
      return s[questionBank].afterState[questionId]?.variant;
    });

    const template = useQuestionEditor((s) => {
      return s[questionBank].afterState[questionId];
    });

    const setQuestionVariant = useQuestionEditor((s) => {
      return s.setQuestionVariant;
    });

    const [variantYaml, setVariantYaml] = useState<string>(() =>
      YAML.stringify(variant, null, 2),
    );

    const updateVariant = (yamlInput: string | undefined = "") => {
      setVariantYaml(yamlInput);
      startTransition(() => {
        try {
          const newVariantObj = YAML.parse(yamlInput);
          const variant = questionVariantSchema.parse(newVariantObj);
          setQuestionVariant(questionBank, questionId, variant);
          setValidationYAML("");
        } catch (e) {
          setRhsMode("validation");
          if (e instanceof ZodError) {
            setValidationYAML(JSON.stringify(e.issues, null, 2));
          } else {
            setValidationYAML(YAML.stringify(e, null, 2));
          }
        }
      });
    };

    const resetVariant = (variant: QuestionVariantType) => {
      const newVariant = getNewVariant(variant);
      updateVariant(YAML.stringify(newVariant));
      console.log(newVariant);
    };

    if (!template || !variant) return null;

    return (
      <Stack direction="row" height="100%" width="100%">
        <Stack height="100%" flex={1} sx={{ overflowY: "hidden" }}>
          <Stack direction="row-reverse" gap={1} m={1}>
            <Button onClick={() => resetVariant(variantType)}>Restart</Button>

            <Select
              value={variantType}
              onChange={(_, v) => setVariantType(v as QuestionVariantType)}
              sx={{ width: "175px" }}
            >
              {variants.map((v) => (
                <Option key={v} value={v} children={v} />
              ))}
            </Select>
          </Stack>

          <Divider />
          <Box sx={{ height: "100%", mt: 1 }}>
            <Editor
              defaultLanguage="yaml"
              value={variantYaml}
              onChange={updateVariant}
              options={{ wordWrap: "on" }}
            />
          </Box>
        </Stack>
        <VerticalDivider />
        <Stack height="100%" flex={1}>
          <ButtonGroup
            variant="solid"
            buttonFlex={1}
            sx={{ margin: "auto", m: 1 }}
          >
            <Button
              color={rhsMode === "preview" ? "primary" : undefined}
              onClick={() => setRhsMode("preview")}
              disabled={hasValidationErrors}
            >
              Preview
            </Button>
            <Button
              color={rhsMode === "demo" ? "primary" : undefined}
              onClick={() => setRhsMode("demo")}
              disabled={hasValidationErrors}
            >
              Demo
            </Button>
            <Button
              color={rhsMode === "validation" ? "primary" : undefined}
              onClick={() => setRhsMode("validation")}
            >
              Validation
            </Button>
          </ButtonGroup>

          <Divider />

          {rhsMode === "demo" && (
            <QuestionStandAloneComponent
              questionBank={questionBank}
              questionId={questionId}
              seed={seed}
              onNavigateToNewSeed={({ seed }) => setSeed(seed)}
              question={createTestQuestion(template, { seed })}
              annexes={[]}
            />
          )}
          {rhsMode === "preview" && (
            <MarkdownClient>{getQuestionPreview(variant)}</MarkdownClient>
          )}
          {rhsMode === "validation" && !validationYaml && (
            <>No Validation errors!</>
          )}
          {rhsMode === "validation" && !!validationYaml && (
            <Box sx={{ height: "100%", mt: 1 }}>
              <Editor
                language="yaml"
                value={validationYaml}
                options={{ readOnly: true, wordWrap: "on" }}
              />
            </Box>
          )}
        </Stack>
      </Stack>
    );
  },
);

QuestionEditorVariant.displayName = "QuestionEditorVariant";
QuestionEditorVariant.getData = async () => ({});
QuestionEditorVariant.useData = () => ({});
