import { QuestionBankName, QuestionTemplateId } from "@cf/core/question-bank";
import { QuestionExplanation, QuestionMeta, QuestionStandAlone } from "@cf/react/containers";
import { Box, Divider, Link, Sheet, Stack, Tab, TabList, TabPanel, Tabs, Typography, } from "@mui/joy";
import { FunctionComponent } from "react";
import { ModulesTabList } from "../../_client/modules-tab-list";
import { ModulesTabPanel } from "../../_client/modules-tab-panel";
import { ModulesMain } from "../../_client/modules-main";

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
    <ModulesMain>
        <QuestionStandAlone
            questionBank={params.questionBank}
            questionId={params.questionId}
            seed={searchParams.seed ?? "123"}
            component="section"
            sx={{ maxWidth: "md", mx: "auto", width: "100%" }}
        />
    </ModulesMain>
);
/**
 * 
 * 
 * 
 * 
 *   <Button
        children={<RefreshIcon />}
        component={Link}
        href={"?seed=" + getRandomId()}
        sx={{
          borderRadius: "50%",
          position: "absolute",
          width: (theme) => theme.spacing(5),
          height: (theme) => theme.spacing(5),
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
      />

 *     <Tabs value={searchParams.tab ?? "question"} sx={{ backgroundColor: "transparent", flex: 1 }}>
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
        </ModulesTabList>        <ModulesTabPanel value={"explanation"}>
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
 * 
 */

export default QuestionIdLayout;