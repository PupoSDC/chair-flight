import { QuestionBankName, QuestionTemplateId } from "@cf/core/question-bank";
import { QuestionExplanation, QuestionMeta, QuestionStandAlone, SearchLearningObjectivesList } from "@cf/react/containers";
import { Box, Divider, Grid, Link, Sheet, Stack, Tab, TabList, TabPanel, Tabs, Typography, } from "@mui/joy";
import { FunctionComponent } from "react";
import { ModulesMain } from "../../../_client/modules-main";
import { QuestionBank } from "@cf/providers/question-bank";
import { AnnexSearch, LearningObjectiveSearch } from "@cf/providers/search";
import { SearchAnnexesList } from "libs/react/containers/src/components/search-annexes/search-annexes-list";


type Props = {
    params: {
        questionBank: QuestionBankName;
        questionId: QuestionTemplateId;
    };
    searchParams: {
        tab?: "question" | "explanation" | "meta";
        seed?: string;
    }
}


const LearningObjectives: FunctionComponent<Props> = async ({ params, searchParams }) => {
    const bank = QuestionBank.get(params.questionBank);
    const template = await bank.getOne("questions", params.questionId);
    const loSearch = LearningObjectiveSearch.get();
    const los = await loSearch.retrieve(bank, template.learningObjectives);
    return (
        <SearchLearningObjectivesList
            currentCourse="all"
            items={los.items}
            noDataMessage="No connected Learning Objectives"
            forceMode={"mobile"}
        />
    )

};

const Annexes : FunctionComponent<Props> = async ({ params, searchParams }) => {
    const bank = QuestionBank.get(params.questionBank);
    const template = await bank.getOne("questions", params.questionId);
    const annexSearch = AnnexSearch.get();
    const annexes = await annexSearch.retrieve(bank, template.annexes);
    return (
        <SearchAnnexesList
            items={annexes.items}
            noDataMessage="No connected Annexes"
        />
    )
}


const QuestionIdLayout: FunctionComponent<Props> = ({ params, searchParams }) => (
    <ModulesMain>
        <Grid container spacing={2}>
            <Grid xs={12} md={6}>
                <Sheet sx={{ width: "100%" }}>
                    <Stack sx={{ p: { xs: 1, sm: 2 } }} direction="row">
                        <Typography level="h5">
                            {params.questionId}
                        </Typography>

                        <Link href="/" ml="auto">
                            Show Explanation and Meta
                        </Link>
                    </Stack>
                    <Divider />
                    <Stack sx={{ p: { xs: 1, sm: 2 } }}>
                        <QuestionStandAlone
                            questionBank={params.questionBank}
                            questionId={params.questionId}
                            seed={searchParams.seed ?? "123"}
                            component="section"
                        />
                    </Stack>
                </Sheet>
            </Grid>
            <Grid xs={12} md={6}>
                <Sheet>
                    <QuestionExplanation    
                        questionBank={params.questionBank}
                        questionId={params.questionId}
                        component="article"
                        sx={{ maxWidth: "md", mx: "auto" }}
                    />
                </Sheet>
            </Grid>
            <Grid xs={12} md={6}>
                <Sheet>
                    <LearningObjectives 
                        params={params} 
                        searchParams={searchParams} 
                    />
                </Sheet>
            </Grid>
            <Grid xs={12} md={6}>
                <Sheet>
                    <Annexes 
                        params={params} 
                        searchParams={searchParams} 
                    />
                </Sheet>
            </Grid>
        </Grid>
    </ModulesMain>

);


export default QuestionIdLayout;