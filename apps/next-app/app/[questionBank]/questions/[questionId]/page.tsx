import { QuestionBankName, QuestionTemplateId } from "@cf/core/question-bank";
import { QuestionExplanation, QuestionMeta, QuestionStandAlone } from "@cf/react/containers";
import { Box, Link, Tab, TabList, TabPanel, Tabs, } from "@mui/joy";
import { FunctionComponent } from "react";
import { ModulesTabList } from "../../_client/modules-tab-list";
import { ModulesTabPanel } from "../../_client/modules-tab-panel";

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

const QuestionIdLayout: FunctionComponent<Props> = ({ params, searchParams }) => (
    <Tabs value={searchParams.tab ?? "question"} sx={{ backgroundColor: "transparent", flex: 1 }}>
        <ModulesTabList>
            <Tab component={Link} href="?tab=question" value={"question"}>
                Question
            </Tab>
            <Tab component={Link} href="?tab=explanation" value={"explanation"}>
                Explanation
            </Tab>
            <Tab component={Link} href="?tab=meta" value={"meta"}>
                Meta
            </Tab>
        </ModulesTabList>
        <ModulesTabPanel value={"question"}>
            <QuestionStandAlone
                questionBank={params.questionBank}
                questionId={params.questionId}
                seed={searchParams.seed ?? "123"}
                component="section"
                sx={{ maxWidth: "md", mx: "auto" }}
            />
        </ModulesTabPanel>

        <ModulesTabPanel value={"explanation"}>
            <QuestionExplanation
                questionBank={params.questionBank}
                questionId={params.questionId}
                component="article"
                sx={{ maxWidth: "md", mx: "auto" }}
            />
        </ModulesTabPanel>

        <ModulesTabPanel value={"meta"}>
            <QuestionMeta
                questionBank={params.questionBank}
                questionId={params.questionId}
                component="article"
                sx={{ maxWidth: "md", mx: "auto" }}
            />
        </ModulesTabPanel>
    </Tabs>
);

export default QuestionIdLayout;