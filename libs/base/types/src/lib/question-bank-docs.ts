export type QuestionBankDoc = {
    id: string;
    title: string;
    fileName: string;
    learningObjectiveId: string;
    empty?: boolean;
    parentId?: string;
    content: string;
}