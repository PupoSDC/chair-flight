import { configureStore } from "@reduxjs/toolkit";
import { question } from "../__mocks__/question";
import {
  resetQuestionEditor,
  updateQuestionVariant,
} from "../actions/question-editor-actions";
import { questionEditorReducer } from "./question-editor-reducer";

const getStore = () =>
  configureStore({
    reducer: questionEditorReducer,
  });

describe("questionEditorReducer", () => {
  it("updates a question variant", () => {
    const store = getStore();
    store.dispatch(
      resetQuestionEditor({
        question,
      }),
    );
    store.dispatch(
      updateQuestionVariant({
        questionId: question.id,
        variant: {
          ...question.variants["Wuyr5cGQ"],
          question: "123-456",
        },
      }),
    );
    expect(
      store.getState().questions[question.id]?.currentVersion.variants[
        "Wuyr5cGQ"
      ].question,
    ).toBe("123-456");
  });
});
