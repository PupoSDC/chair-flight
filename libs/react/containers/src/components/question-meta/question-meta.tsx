import { default as Stack, StackProps } from "@mui/joy/stack";
import { QuestionBank } from "@cf/providers/question-bank";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { QuestionId } from "@cf/core/tests";
import type { FunctionComponent } from "react";
import { Grid, Link, Sheet, Typography } from "@mui/joy";
import { SearchLearningObjectivesList, SearchLearningObjectivesListProps } from "../search-learning-objectives";
import { AnnexSearch, LearningObjectiveSearch, QuestionSearch } from "@cf/providers/search";
import { SearchQuestionsList } from "../search-questions";
import { SearchAnnexesList } from "../search-annexes/search-annexes-list";
import { Ups } from "@cf/react/components";

export type QuestionMetaProps = {
    questionBank: QuestionBankName;
    questionId: QuestionId;
    sx?: StackProps["sx"];
    forceMode?: SearchLearningObjectivesListProps["forceMode"];
    component?: StackProps["component"];
}

export const QuestionMeta: FunctionComponent<
    QuestionMetaProps
> = async ({ questionBank, questionId, sx, forceMode, component = "div" }) => {
    const bank = QuestionBank.get(questionBank);
    const template = await bank.getOne("questions", questionId);
    const externalIds = template.externalIds;
    const [annexes, learningObjectives, relatedQuestions] = await Promise.all(
        [
            AnnexSearch.get().retrieve(bank, template.annexes),
            LearningObjectiveSearch.get().retrieve(bank, template.learningObjectives),
            QuestionSearch.get().retrieve(bank, template.relatedQuestions),
        ],
    );

    return (
        <Stack sx={sx} component={component}>
            <Typography level="h3">
                Preview
            </Typography>

            <Typography sx={{ mt: 2 }}>
                TODO
            </Typography>

            <Typography level="h3" sx={{ mt: 2 }}>
                Learning Objectives
            </Typography>
            <SearchLearningObjectivesList
                currentCourse="all"
                items={learningObjectives.items}
                noDataMessage="No connected Learning Objectives"
                forceMode={forceMode}
            />
            <Typography level="h3" sx={{ mt: 2 }}>
                Related Questions
            </Typography>
            <SearchQuestionsList
                items={relatedQuestions.items}
                noDataMessage="No related questions"
                forceMode={forceMode}
            />
            <Typography level="h3" sx={{ mt: 2 }}>
                Annexes
            </Typography>
            <SearchAnnexesList
                items={annexes.items}
                noDataMessage="No related questions"
                forceMode={forceMode}
            />
            <Typography level="h3" sx={{ mt: 2 }}>
                External References
            </Typography>
            <Sheet sx={{ p: 1 }}>
                {externalIds.length > 0 ? (
                    <Grid container>
                        {externalIds.map((ref) => (
                            <Grid key={ref} xs={6} md={3} lg={3}>
                                <Link href={""} disabled>
                                    <span>{ref}</span>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Ups message="No External References" />
                )}
            </Sheet>
        </Stack>
    );
};
