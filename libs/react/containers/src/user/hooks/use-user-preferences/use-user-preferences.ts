import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserPreferences = {
  examModeAutoSkip: boolean;
  studyModeAutoSkip: boolean;
  setExamModeAutoSkip: (v: boolean) => void;
  setStudyModeAutoSkip: (v: boolean) => void;
};

export const useUserPreferences = create<UserPreferences>()(
  devtools(
    persist(
      (set) => ({
        examModeAutoSkip: false,
        studyModeAutoSkip: false,
        setExamModeAutoSkip: (v) => set({ examModeAutoSkip: v }),
        setStudyModeAutoSkip: (v) => set({ studyModeAutoSkip: v }),
      }),
      { name: "cf-user-preferences" },
    ),
  ),
);
