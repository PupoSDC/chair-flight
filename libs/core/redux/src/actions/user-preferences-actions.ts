import { createAction } from "@reduxjs/toolkit";

export const setExamModeAutoSkip = createAction<{
  value: boolean;
}>("user-preferences/exam-mode-auto-skip");

export const setStudyModeAutoSkip = createAction<{
  value: boolean;
}>("user-preferences/study-mode-auto-skip");
