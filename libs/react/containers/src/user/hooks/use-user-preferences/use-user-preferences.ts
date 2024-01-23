import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createUsePersistenceHook } from "../../../hooks/use-persistence";
import { z } from "zod";
import { useCallback } from "react";


const userPreferencesSchema = z.object({
  examModeAutoSkip: z.boolean().default(false),
  studyModeAutoSkip: z.boolean().default(false),
  sortQuestionsByChapter: z.boolean().default(false),
})

const defaultValues = userPreferencesSchema.parse({});

type UserPreferences = z.infer<typeof userPreferencesSchema>;
type SetUserPreferences = (obj: Partial<UserPreferences>) => void;

export const useUserPreferencesPersistence = createUsePersistenceHook(
  `cf-user-preferences`,
  defaultValues
);

export const useUserPreferences = () : [UserPreferences, SetUserPreferences] => {
  const { data, getData, setData } = useUserPreferencesPersistence();

  const setUserPreference : SetUserPreferences = useCallback((newData) => {
    setData({ ...defaultValues, ...getData(), ...newData });
  }, [setData, getData]);

  return [data, setUserPreference];
}