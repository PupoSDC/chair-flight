import { createReducer } from "@reduxjs/toolkit";
import {
  setExamModeAutoSkip,
  setStudyModeAutoSkip,
} from "../actions/user-preferences-actions";

export type UserPreferencesReducer = {
  examModeAutoSkip: boolean;
  studyModeAutoSkip: boolean;
};

export const userPreferencesReducer = createReducer<UserPreferencesReducer>(
  {
    examModeAutoSkip: true,
    studyModeAutoSkip: true,
  },
  (builder) => {
    builder
      .addCase(setExamModeAutoSkip, (store, action) => {
        store.examModeAutoSkip = action.payload.value;
      })
      .addCase(setStudyModeAutoSkip, (store, action) => {
        store.studyModeAutoSkip = action.payload.value;
      });
  }
);
