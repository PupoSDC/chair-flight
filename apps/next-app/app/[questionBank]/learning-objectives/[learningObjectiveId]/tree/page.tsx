import type { LearningObjectiveId, QuestionBankName } from "@cf/core/question-bank";
import { SearchLearningObjectivesList } from "@cf/next/question-bank";
import { ModulesMain } from "@cf/next/ui";
import { QuestionBank } from "@cf/providers/question-bank";
import { LearningObjectiveSearch } from "@cf/providers/search";
import type { FunctionComponent } from "react";


type Props = {
    params: {
        questionBank: QuestionBankName;
        learningObjectiveId: LearningObjectiveId;
    }
}

export const getLearningObjectiveTree = async (props: Props) => {
    const questionBank = new QuestionBank(props.params.questionBank);
    const loSearch = new LearningObjectiveSearch();
    const loId = props.params.learningObjectiveId;
    const mainLo = await questionBank.getOne("learningObjectives", loId);
    const tree = [mainLo.id];
    
    // Populate up the tree
    for (let i = tree.length - 1; i < tree.length; i++) {
        try {
            const lo = await questionBank.getOne("learningObjectives", tree[i]);
            lo.parentId && tree.push(lo.parentId);
        } catch (e) {
            break;
        }
    }
    
    tree.reverse();

    // Populate down the tree
    for (let i = tree.length - 1; i < tree.length; i++) {
        const lo = await questionBank.getOne("learningObjectives", tree[i]);
        tree.push(...lo.learningObjectives);
    }

    return await loSearch.retrieve(questionBank, tree.sort());
}

const Page : FunctionComponent<Props> = async ({ params }) => {
  const { items } = await getLearningObjectiveTree({ params });

  return (
    <ModulesMain fixedHeight>
        <SearchLearningObjectivesList items={items} currentCourse="all" />
    </ModulesMain>
  );
}

export default Page;