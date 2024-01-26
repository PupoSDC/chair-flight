import { QuestionBankName } from "@chair-flight/base/types";
import { container, getRequiredParam } from "../../wraper"
import { AppRouterOutput, trpc } from "@chair-flight/trpc/client";
import { Divider, GlobalStyles, Link, Typography } from "@mui/joy";
import { AppHead, markdownComponents } from "@chair-flight/react/components";
import { MDXRemote } from "next-mdx-remote";

type Props = {
    questionBank: QuestionBankName;
    docId: string;
}

type Params = {
    questionBank: QuestionBankName;
    docId: string;
}

type Data = AppRouterOutput["questionBankDocs"]["getDoc"];

export const BlogContent = container<Props, Params, Data>((props) => {
    const { doc } = BlogContent.useData(props);
    return (
        <>
            <GlobalStyles
                styles={{
                    main: {
                        "h1, h2, h3, h4, h5": { marginTop: "1em" },
                    },
                }}
            />
            <AppHead
                title={doc.title}
                linkTitle={doc.title}
                linkDescription={doc.description}
            />     
            <Typography
                level="h2"
                component="h1"
                sx={{ fontWeight: "bold" }}
                children={doc.title}
            />
            <Divider sx={{ width: "100%", mb: 1 }} />
            <MDXRemote
                {...doc.mdxSource}
                components={{
                    ...markdownComponents,
                    LearningObjectives: () => "hello"
                }}
            />
        </>
    )
});

BlogContent.getData = async ({ helper, params }) => {
    const questionBank = getRequiredParam(params, "questionBank");
    const docId = getRequiredParam(params, "docId");

    return await helper.questionBankDocs.getDoc.fetch({
        questionBank,
        docId,
    });
};

BlogContent.useData = (params) => {
    const questionBank = getRequiredParam(params, "questionBank");
    const docId = getRequiredParam(params, "docId");

    return trpc.questionBankDocs.getDoc.useSuspenseQuery({
        questionBank,
        docId,
    })[0];
};
