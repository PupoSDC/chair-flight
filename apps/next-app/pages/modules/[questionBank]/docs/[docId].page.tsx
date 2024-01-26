import * as fs from "node:fs/promises";
import { BackgroundFadedImage } from "@chair-flight/react/components";
import { BlogContent, Breadcrumbs, LayoutModule, LearningObjectiveQuestions } from "@chair-flight/react/containers";
import { staticHandler, staticPathsHandler } from "@chair-flight/trpc/server";
import { LearningObjectiveId, QuestionBankName } from "@chair-flight/base/types";
import type { NextPage } from "next";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Box, Divider, Typography } from "@mui/joy";

type PageProps = {
    docId: string;
    questionBank: QuestionBankName;
    learningObjectiveId: LearningObjectiveId;
};

type PageParams = {
    docId: string;
    questionBank: QuestionBankName;
};

export const Page: NextPage<PageProps> = ({
    docId,
    questionBank,
    learningObjectiveId
}) => {
    const crumbs = [
        [questionBank.toUpperCase(), `/modules/${questionBank}`],
        ["Docs", `/modules/${questionBank}/docs`],
        docId
    ] as Breadcrumbs;

    return (
        <LayoutModule questionBank={questionBank} breadcrumbs={crumbs}>
            <Box sx={{ maxWidth: "md", margin: "auto" }}>
                <BlogContent docId={docId} questionBank={questionBank} />

                <AccordionGroup size="lg">
                    <Accordion>
                        <AccordionSummary>
                            Learning Objectives
                        </AccordionSummary>
                        <AccordionDetails>
                            <LearningObjectiveQuestions
                                questionBank={questionBank}
                                learningObjectiveId={learningObjectiveId}
                                forceMode="mobile"
                                sx={{
                                    height: 500,
                                    overflowY: "scroll",
                                }}
                            />

                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary>
                            Questions
                        </AccordionSummary>
                        <AccordionDetails sx={{ "& > *": { px: 0, pt: 0 } }}>
                            <LearningObjectiveQuestions
                                component="div"
                                questionBank={questionBank}
                                learningObjectiveId={learningObjectiveId}
                                forceMode="mobile"
                                sx={{
                                    height: 500,
                                    overflowY: "scroll",
                                    backgroundColor: "transparent",
                                    borderRadius: 0,
                                }}
                            />

                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>

            </Box>
        </LayoutModule>
    );
};

export const getStaticProps = staticHandler<PageProps, PageParams>(
    async ({ params, helper }) => {
        const { doc } = await helper.questionBankDocs.getDoc.fetch(params);
        await LayoutModule.getData({ helper, params });
        await BlogContent.getData({ helper, params });
        const props = { ...params, learningObjectiveId: doc.learningObjective };
        return { props };
    },
    fs,
);

export const getStaticPaths = staticPathsHandler<PageParams>(
    async ({ helper }) => {
        const qbDocs = helper.questionBankDocs;
        const { paths } = await qbDocs.getAllDocPaths.fetch();
        return { fallback: false, paths };
    },
    fs,
);

export default Page;
